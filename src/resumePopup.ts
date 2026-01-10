import * as vscode from 'vscode';
import { WorkContext } from './types';
import * as path from 'path';

/**
 * Displays resume popup and handles navigation to saved context
 */
export class ResumePopup {
    /**
     * Show a quiet notification when context is saved (non-intrusive)
     */
    public showSavedNotification(context: WorkContext): void {
        const fileName = path.basename(context.filePath);
        let message = `🧠 Context saved • 📄 ${fileName}`;

        if (context.functionName) {
            message += ` • ${context.functionName}`;
        }

        if (context.gitBranch) {
            message += ` 🔀 ${context.gitBranch}`;
        }

        // Show as an information message that auto-dismisses (no buttons = non-intrusive)
        vscode.window.showInformationMessage(message);

        // Also show in status bar
        vscode.window.setStatusBarMessage(message, 5000);
    }

    /**
     * Show the resume work popup with notification banner style
     * (Action-driven for when user returns)
     */
    public async show(context: WorkContext): Promise<void> {
        const fileName = path.basename(context.filePath);
        const timeAgo = this.formatTimeAgo(context.timestamp);

        // Build a clean, concise message
        let message = `🧠 Welcome back! You were last active ${timeAgo}`;

        // File and function on same line if both exist
        if (context.functionName) {
            message += `\n📄 ${fileName} → ${context.functionName}`;
        } else {
            message += `\n📄 ${fileName}`;
        }

        // Only show note if it contains TODO/FIXME comment (unique info)
        if (context.todoComment) {
            message += `\n📝 ${context.todoComment}`;
        }

        // Git branch and uncommitted files
        if (context.gitBranch) {
            const uncommitted = context.gitUncommittedFiles
                ? ` • ${context.gitUncommittedFiles} uncommitted`
                : '';
            message += `\n🔀 ${context.gitBranch}${uncommitted}`;
        }

        // Show notification with action buttons
        const result = await vscode.window.showInformationMessage(
            message,
            { modal: false },
            '✅ Continue',
            '📋 View History',
            '✖ Dismiss'
        );

        if (result === '✅ Continue') {
            await this.navigateToContext(context);
        } else if (result === '📋 View History') {
            await vscode.commands.executeCommand('whatWasIDoing.showHistory');
        }
    }

    /**
     * Navigate to the saved work context
     */
    public async navigateToContext(context: WorkContext): Promise<void> {
        try {
            // Check if file exists
            const uri = vscode.Uri.file(context.filePath);

            try {
                await vscode.workspace.fs.stat(uri);
            } catch {
                vscode.window.showWarningMessage(
                    `File not found: ${path.basename(context.filePath)}`
                );
                return;
            }

            // Open the document
            const document = await vscode.workspace.openTextDocument(uri);

            // Calculate position and selection range
            const position = new vscode.Position(context.line, context.column);
            const selectionRange = new vscode.Range(position, position);

            // Show the document with selection
            const editor = await vscode.window.showTextDocument(document, {
                selection: selectionRange,
                preview: false,
                viewColumn: vscode.ViewColumn.One,
            });

            // Reveal the line in the center of the viewport
            editor.revealRange(
                selectionRange,
                vscode.TextEditorRevealType.InCenter
            );

            // Show a subtle confirmation
            vscode.window.setStatusBarMessage(
                `Resumed at ${context.functionName || 'last position'}`,
                3000
            );

        } catch (error) {
            console.error('Failed to navigate to context:', error);
            vscode.window.showErrorMessage('Failed to navigate to saved position');
        }
    }

    /**
     * Format the popup message with context details
     */
    private formatMessage(context: WorkContext): string {
        const timeAgo = this.formatTimeAgo(context.timestamp);
        const fileName = path.basename(context.filePath);

        let message = `🧠 Welcome back! You were last active ${timeAgo}\n`;
        message += `📄 File: ${fileName}`;

        // Show the auto-generated note prominently
        if (context.note) {
            message += `\n💡 ${context.note}`;
        }

        if (context.functionName) {
            message += `\n🔍 Location: ${context.functionName}`;
        }

        if (context.todoComment) {
            message += `\n📝 ${context.todoComment}`;
        }

        // Show Git information
        if (context.gitBranch || context.gitLastCommit || context.gitUncommittedFiles) {
            const gitParts: string[] = [];

            if (context.gitBranch) {
                gitParts.push(`Branch: ${context.gitBranch}`);
            }

            if (context.gitUncommittedFiles !== undefined && context.gitUncommittedFiles > 0) {
                gitParts.push(`Uncommitted files: ${context.gitUncommittedFiles}`);
            }

            if (gitParts.length > 0) {
                message += `\n🔀 ${gitParts.join(' • ')}`;
            }

            if (context.gitLastCommit) {
                const shortCommit = context.gitLastCommit.length > 50
                    ? context.gitLastCommit.substring(0, 50) + '...'
                    : context.gitLastCommit;
                message += `\n💬 Last commit: ${shortCommit}`;
            }
        }

        return message;
    }

    /**
     * Format timestamp as human-readable "time ago"
     */
    private formatTimeAgo(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / (60 * 1000));
        const hours = Math.floor(diff / (60 * 60 * 1000));
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));

        if (minutes < 1) {
            return 'just now';
        } else if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (hours < 24) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (days < 7) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            const date = new Date(timestamp);
            return `on ${date.toLocaleDateString()}`;
        }
    }

    /**
     * Show a quick pick menu with context history
     */
    public async showHistoryQuickPick(contexts: WorkContext[]): Promise<void> {
        if (contexts.length === 0) {
            vscode.window.showInformationMessage('No work context history available');
            return;
        }

        const items = contexts.map(ctx => {
            // Build detail string with time, TODO, and git info
            const detailParts: string[] = [this.formatTimeAgo(ctx.timestamp)];

            if (ctx.todoComment) {
                detailParts.push(ctx.todoComment);
            }

            if (ctx.gitBranch) {
                const gitInfo = ctx.gitBranch;
                if (ctx.gitUncommittedFiles !== undefined && ctx.gitUncommittedFiles > 0) {
                    detailParts.push(`🔀 ${gitInfo} (${ctx.gitUncommittedFiles} uncommitted)`);
                } else {
                    detailParts.push(`🔀 ${gitInfo}`);
                }
            }

            return {
                label: `$(file) ${path.basename(ctx.filePath)}`,
                description: ctx.note || ctx.functionName || `Line ${ctx.line + 1}`,
                detail: detailParts.join(' • '),
                context: ctx,
            };
        });

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a previous work context to resume',
            matchOnDescription: true,
            matchOnDetail: true,
        });

        if (selected) {
            await this.navigateToContext(selected.context);
        }
    }

    /**
     * Show minimal notification (less intrusive alternative)
     */
    public async showMinimalNotification(context: WorkContext): Promise<void> {
        const fileName = path.basename(context.filePath);
        const message = `Last active in ${fileName}${context.functionName ? ` @ ${context.functionName}` : ''}`;

        const action = await vscode.window.showInformationMessage(
            message,
            'Resume'
        );

        if (action === 'Resume') {
            await this.navigateToContext(context);
        }
    }
}
