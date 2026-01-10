import * as vscode from 'vscode';
import { ActivityTracker } from './activityTracker';
import { ContextExtractor } from './contextExtractor';
import { StateManager } from './stateManager';
import { ResumePopup } from './resumePopup';
import { WorkContext, ExtensionConfig } from './types';

let activityTracker: ActivityTracker | undefined;
let contextExtractor: ContextExtractor | undefined;
let stateManager: StateManager | undefined;
let resumePopup: ResumePopup | undefined;
let statusBarItem: vscode.StatusBarItem | undefined;
let extensionContext: vscode.ExtensionContext | undefined;
let currentConfig: ExtensionConfig | undefined;

/**
 * Get extension configuration
 */
function getConfig(): ExtensionConfig {
	const config = vscode.workspace.getConfiguration('whatWasIDoing');
	return {
		idleTimeoutMinutes: config.get('idleTimeoutMinutes', 10),
		maxHistorySize: config.get('maxHistorySize', 10),
		excludePatterns: config.get('excludePatterns', []),
		autoShowResumePopup: config.get('autoShowResumePopup', true),
		todoKeywords: config.get('todoKeywords', ['TODO', 'FIXME', 'HACK', 'NOTE', 'BUG', 'XXX']),
	};
}

/**
 * Check if file should be tracked based on exclude patterns
 */
function shouldTrackFile(filePath: string, excludePatterns: string[]): boolean {
	// Skip non-file schemes
	if (!filePath.startsWith('/') && !filePath.match(/^[a-zA-Z]:\\/)) {
		return false;
	}

	// Check exclude patterns
	for (const pattern of excludePatterns) {
		const regex = new RegExp(pattern.replace(/\*/g, '.*'));
		if (regex.test(filePath)) {
			return false;
		}
	}

	return true;
}

/**
 * Update status bar with last activity info
 */
function updateStatusBar(context?: WorkContext): void {
	if (!statusBarItem) {
		return;
	}

	if (context) {
		const timeAgo = formatTimeAgo(context.timestamp);
		statusBarItem.text = `$(clock) Last: ${timeAgo}`;
		statusBarItem.tooltip = `Last active: ${context.functionName || 'Unknown'}\nClick to view history`;
		statusBarItem.show();
	}
}

function formatTimeAgo(timestamp: number): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / (60 * 1000));
	const hours = Math.floor(diff / (60 * 60 * 1000));

	if (minutes < 1) { return 'now'; }
	if (minutes < 60) { return `${minutes}m ago`; }
	return `${hours}h ago`;
}

export async function activate(context: vscode.ExtensionContext) {
	console.log('What Was I Doing extension is now active');

	// Show visible confirmation that extension loaded
	vscode.window.showInformationMessage('✅ What Was I Doing extension activated!');

	extensionContext = context;
	const config = getConfig();
	currentConfig = config;

	// Initialize components
	stateManager = new StateManager(context, config.maxHistorySize);
	activityTracker = new ActivityTracker(config.idleTimeoutMinutes);
	contextExtractor = new ContextExtractor();
	resumePopup = new ResumePopup();

	contextExtractor.setTodoKeywords(config.todoKeywords);

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'whatWasIDoing.showHistory';
	context.subscriptions.push(statusBarItem);

	// Set up idle detection callback
	activityTracker.onIdle(async (workContext) => {
		if (!stateManager || !contextExtractor || !resumePopup) {
			return;
		}

		// Check if file should be tracked
		if (!shouldTrackFile(workContext.filePath, config.excludePatterns)) {
			return;
		}

		// Enhance context with function name and TODO comments
		const enhancedContext = await contextExtractor.enhanceContext(workContext);

		// Save to state
		await stateManager.saveContext(enhancedContext);

		// Show quiet notification
		resumePopup.showSavedNotification(enhancedContext);

		console.log('Saved work context:', enhancedContext);
	});

	// Track file switching and editing behavior
	let currentFile: string | undefined;
	let fileOpenedAt: number = 0;
	let hasEditedCurrentFile: boolean = false;
	const MIN_FILE_TIME_MS = 2 * 60 * 1000; // 2 minutes

	// Save context on specific triggers
	const saveCurrentContext = async () => {
		if (activityTracker && stateManager && contextExtractor && resumePopup) {
			const currentContext = activityTracker.getCurrentContext();
			if (currentContext && shouldTrackFile(currentContext.filePath, config.excludePatterns)) {
				const enhancedContext = await contextExtractor.enhanceContext(currentContext);
				await stateManager.saveContext(enhancedContext);
				// Show quiet notification
				resumePopup.showSavedNotification(enhancedContext);
				console.log('Saved context:', enhancedContext);
			}
		}
	};

	// Save when window loses focus (user switching away or closing)
	context.subscriptions.push(
		vscode.window.onDidChangeWindowState(async (state) => {
			if (!state.focused) {
				await saveCurrentContext();
			}
		})
	);

	// Track edits to current file
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((e) => {
			if (e.document.uri.scheme === 'file' && e.document.uri.fsPath === currentFile) {
				hasEditedCurrentFile = true;
			}
		})
	);

	// Smart file switching - only save if meaningful work was done
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(async (editor) => {
			if (!editor || editor.document.uri.scheme !== 'file') {
				return;
			}

			const newFile = editor.document.uri.fsPath;
			const now = Date.now();
			const timeOnFile = now - fileOpenedAt;

			// Save previous context if conditions are met:
			// 1. File is changing
			// 2. User made edits
			// 3. Stayed on file for at least 2 minutes
			if (currentFile &&
				newFile !== currentFile &&
				hasEditedCurrentFile &&
				timeOnFile >= MIN_FILE_TIME_MS) {
				await saveCurrentContext();
				console.log('Saved context after meaningful work on file');
			}

			// Update tracking for new file
			currentFile = newFile;
			fileOpenedAt = now;
			hasEditedCurrentFile = false;
		})
	);

	// Show resume popup on activation if appropriate
	setTimeout(async () => {
		if (!stateManager || !resumePopup || !config.autoShowResumePopup) {
			return;
		}

		const lastContext = await stateManager.getLastContext();

		if (lastContext) {
			// Show popup every time VS Code reopens if there's a saved context
			await resumePopup.show(lastContext);
		}

		updateStatusBar(lastContext);
	}, 2000); // Delay to avoid interfering with startup

	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('whatWasIDoing.showLastContext', async () => {
			if (!stateManager || !resumePopup) {
				return;
			}

			const lastContext = await stateManager.getLastContext();
			if (lastContext) {
				await resumePopup.show(lastContext);
			} else {
				vscode.window.showInformationMessage('No saved work context available');
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('whatWasIDoing.showHistory', async () => {
			if (!stateManager || !resumePopup) {
				return;
			}

			const history = await stateManager.getHistory();
			await resumePopup.showHistoryQuickPick(history);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('whatWasIDoing.clearHistory', async () => {
			if (!stateManager) {
				return;
			}

			const confirm = await vscode.window.showWarningMessage(
				'Clear all work context history?',
				{ modal: true },
				'Clear'
			);

			if (confirm === 'Clear') {
				await stateManager.clearHistory();
				if (statusBarItem) {
					statusBarItem.hide();
				}
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('whatWasIDoing.saveCurrentContext', async () => {
			if (!activityTracker || !stateManager || !contextExtractor || !resumePopup) {
				return;
			}

			const currentContext = activityTracker.getCurrentContext();
			if (currentContext) {
				const enhancedContext = await contextExtractor.enhanceContext(currentContext);
				await stateManager.saveContext(enhancedContext);
				// Show quiet notification instead of intrusive message
				resumePopup.showSavedNotification(enhancedContext);
				updateStatusBar(enhancedContext);
			} else {
				vscode.window.showWarningMessage('No active context to save');
			}
		})
	);

	// Listen for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('whatWasIDoing')) {
				const newConfig = getConfig();

				if (activityTracker) {
					activityTracker.setIdleTimeout(newConfig.idleTimeoutMinutes);
				}

				if (stateManager) {
					stateManager.setMaxHistorySize(newConfig.maxHistorySize);
				}

				if (contextExtractor) {
					contextExtractor.setTodoKeywords(newConfig.todoKeywords);
				}
			}
		})
	);

	// Periodically update status bar
	const statusUpdateInterval = setInterval(async () => {
		if (stateManager) {
			const lastContext = await stateManager.getLastContext();
			updateStatusBar(lastContext);
		}
	}, 30000); // Update every 30 seconds

	context.subscriptions.push({
		dispose: () => clearInterval(statusUpdateInterval),
	});
}

export async function deactivate() {
	// Save current context on deactivate
	if (activityTracker && stateManager && contextExtractor && currentConfig) {
		const currentContext = activityTracker.getCurrentContext();
		if (currentContext) {
			try {
				if (shouldTrackFile(currentContext.filePath, currentConfig.excludePatterns)) {
					const enhancedContext = await contextExtractor.enhanceContext(currentContext);
					await stateManager.saveContext(enhancedContext);
					console.log('Successfully saved context on deactivate:', enhancedContext);
				}
			} catch (error) {
				console.error('Failed to save on deactivate:', error);
			}
		}
	}

	// Cleanup
	if (activityTracker) {
		activityTracker.dispose();
	}
}
