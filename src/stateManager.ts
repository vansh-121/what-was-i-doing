import * as vscode from 'vscode';
import { WorkContext } from './types';

/**
 * Manages persistent storage of work sessions
 */
export class StateManager {
    private static readonly HISTORY_KEY = 'workContextHistory';
    private static readonly LAST_SHOWN_KEY = 'lastShownTimestamp';
    private context: vscode.ExtensionContext;
    private maxHistorySize: number;

    constructor(context: vscode.ExtensionContext, maxHistorySize: number = 10) {
        this.context = context;
        this.maxHistorySize = maxHistorySize;
    }

    /**
     * Check if two contexts are essentially the same (to avoid duplicates)
     */
    private areContextsSame(ctx1: WorkContext, ctx2: WorkContext): boolean {
        // Different files are always different
        if (ctx1.filePath !== ctx2.filePath) {
            return false;
        }

        // Different TODO comments mean different contexts (user added/changed a note)
        if (ctx1.todoComment !== ctx2.todoComment) {
            return false;
        }

        // Same function name means same context (even if line changed slightly)
        if (ctx1.functionName && ctx2.functionName && ctx1.functionName === ctx2.functionName) {
            // If lines are within 10 lines of each other in the same function, consider it the same
            const lineDiff = Math.abs(ctx1.line - ctx2.line);
            if (lineDiff <= 10) {
                return true;
            }
        }

        // If no function name, check if lines are very close (within 5 lines)
        const lineDiff = Math.abs(ctx1.line - ctx2.line);
        if (lineDiff <= 5) {
            return true;
        }

        return false;
    }

    /**
     * Save a work context to history
     */
    public async saveContext(workContext: WorkContext): Promise<void> {
        try {
            const history = await this.getHistory();

            // Check if the new context is the same as the last saved one
            if (history.length > 0) {
                const lastContext = history[0];
                if (this.areContextsSame(workContext, lastContext)) {
                    console.log('Context unchanged, skipping duplicate save');
                    return; // Don't save duplicate
                }
            }

            // Add new context at the beginning
            history.unshift(workContext);

            // Limit history size
            const trimmedHistory = history.slice(0, this.maxHistorySize);

            // Save to workspace state (per-workspace tracking)
            await this.context.workspaceState.update(
                StateManager.HISTORY_KEY,
                trimmedHistory
            );

            console.log('Saved new work context (different from previous)');
        } catch (error) {
            console.error('Failed to save context:', error);
            vscode.window.showErrorMessage('Failed to save work context');
        }
    }

    /**
     * Get the most recent work context
     */
    public async getLastContext(): Promise<WorkContext | undefined> {
        const history = await this.getHistory();
        return history.length > 0 ? history[0] : undefined;
    }

    /**
     * Get all work context history
     */
    public async getHistory(): Promise<WorkContext[]> {
        try {
            const history = this.context.workspaceState.get<WorkContext[]>(
                StateManager.HISTORY_KEY,
                []
            );
            return history;
        } catch (error) {
            console.error('Failed to get history:', error);
            return [];
        }
    }

    /**
     * Clear all work context history
     */
    public async clearHistory(): Promise<void> {
        try {
            await this.context.workspaceState.update(StateManager.HISTORY_KEY, []);
            vscode.window.showInformationMessage('Work context history cleared');
        } catch (error) {
            console.error('Failed to clear history:', error);
            vscode.window.showErrorMessage('Failed to clear history');
        }
    }

    /**
     * Check if we should show the resume popup
     * (only show once per session to avoid annoyance)
     */
    public shouldShowResumePopup(): boolean {
        const lastShown = this.context.globalState.get<number>(StateManager.LAST_SHOWN_KEY, 0);
        const now = Date.now();

        // Show if it's been more than 30 minutes since last shown
        const thirtyMinutes = 30 * 60 * 1000;
        return (now - lastShown) > thirtyMinutes;
    }

    /**
     * Mark that we've shown the resume popup
     */
    public async markResumePopupShown(): Promise<void> {
        await this.context.globalState.update(StateManager.LAST_SHOWN_KEY, Date.now());
    }

    /**
     * Get context history for a specific workspace folder
     */
    public async getContextsForWorkspace(workspacePath: string): Promise<WorkContext[]> {
        const history = await this.getHistory();
        return history.filter(ctx => ctx.workspaceFolder === workspacePath);
    }

    /**
     * Remove old contexts (older than specified days)
     */
    public async pruneOldContexts(maxAgeDays: number = 30): Promise<void> {
        const history = await this.getHistory();
        const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
        const now = Date.now();

        const recentHistory = history.filter(ctx => {
            return (now - ctx.timestamp) < maxAgeMs;
        });

        if (recentHistory.length < history.length) {
            await this.context.workspaceState.update(StateManager.HISTORY_KEY, recentHistory);
            console.log(`Pruned ${history.length - recentHistory.length} old contexts`);
        }
    }

    /**
     * Update max history size
     */
    public setMaxHistorySize(size: number): void {
        this.maxHistorySize = size;
    }

    /**
     * Export history as JSON string (for debugging/backup)
     */
    public async exportHistory(): Promise<string> {
        const history = await this.getHistory();
        return JSON.stringify(history, null, 2);
    }

    /**
     * Import history from JSON string
     */
    public async importHistory(jsonString: string): Promise<void> {
        try {
            const history = JSON.parse(jsonString) as WorkContext[];
            await this.context.workspaceState.update(StateManager.HISTORY_KEY, history);
            vscode.window.showInformationMessage('Work context history imported successfully');
        } catch (error) {
            console.error('Failed to import history:', error);
            vscode.window.showErrorMessage('Failed to import history: Invalid JSON');
        }
    }
}
