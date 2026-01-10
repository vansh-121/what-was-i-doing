import * as vscode from 'vscode';
import { WorkContext } from './types';
import * as path from 'path';

/**
 * Creates a styled webview popup for resume context
 */
export class WebviewPopup {
    private panel: vscode.WebviewPanel | undefined;

    /**
     * Show the styled resume popup
     */
    public async show(context: WorkContext, onContinue: () => void, onViewHistory: () => void): Promise<void> {
        // Create or reveal webview panel
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
        } else {
            this.panel = vscode.window.createWebviewPanel(
                'whatWasIDoing',
                'What Was I Doing?',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );

            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }

        // Set the HTML content
        this.panel.webview.html = this.getWebviewContent(context);

        // Handle messages from webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'continue':
                        onContinue();
                        this.panel?.dispose();
                        break;
                    case 'viewHistory':
                        onViewHistory();
                        this.panel?.dispose();
                        break;
                    case 'dismiss':
                        this.panel?.dispose();
                        break;
                }
            }
        );
    }

    /**
     * Generate the HTML content for the webview
     */
    private getWebviewContent(context: WorkContext): string {
        const fileName = path.basename(context.filePath);
        const timeAgo = this.formatTimeAgo(context.timestamp);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>What Was I Doing?</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            background: var(--vscode-sideBar-background);
            border-radius: 12px;
            padding: 24px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--vscode-panel-border);
        }

        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }

        .icon {
            font-size: 32px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--vscode-button-background);
            border-radius: 8px;
        }

        .header-text {
            flex: 1;
        }

        .header-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .header-subtitle {
            font-size: 13px;
            opacity: 0.7;
        }

        .info-section {
            margin-bottom: 16px;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 0;
            font-size: 14px;
        }

        .info-icon {
            opacity: 0.7;
            font-size: 16px;
            width: 20px;
        }

        .info-label {
            opacity: 0.7;
            min-width: 80px;
        }

        .info-value {
            font-weight: 500;
        }

        .function-name {
            color: var(--vscode-symbolIcon-functionForeground, #C586C0);
        }

        .note-box {
            background: var(--vscode-inputValidation-warningBackground, rgba(255, 140, 0, 0.15));
            border-left: 3px solid var(--vscode-inputValidation-warningBorder, #ff8c00);
            padding: 12px 16px;
            border-radius: 6px;
            margin: 16px 0;
            font-size: 14px;
        }

        .note-label {
            opacity: 0.8;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .note-text {
            line-height: 1.5;
        }

        .git-box {
            background: var(--vscode-inputValidation-infoBackground, rgba(0, 122, 204, 0.15));
            border-left: 3px solid var(--vscode-inputValidation-infoBorder, #007acc);
            padding: 12px 16px;
            border-radius: 6px;
            margin: 16px 0;
            font-size: 13px;
        }

        .git-line {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 4px 0;
        }

        .git-icon {
            opacity: 0.7;
        }

        .buttons {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }

        button {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }

        .btn-primary:hover {
            background: var(--vscode-button-hoverBackground);
            transform: translateY(-1px);
        }

        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }

        .btn-dismiss {
            padding: 8px;
            min-width: auto;
            background: transparent;
            opacity: 0.6;
        }

        .btn-dismiss:hover {
            opacity: 1;
            background: var(--vscode-toolbar-hoverBackground);
        }

        .divider {
            height: 1px;
            background: var(--vscode-panel-border);
            margin: 16px 0;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🧠</div>
            <div class="header-text">
                <div class="header-title">Welcome Back!</div>
                <div class="header-subtitle">You've been away for ${timeAgo}</div>
            </div>
        </div>

        <div class="info-section">
            <div class="info-item">
                <span class="info-icon">📄</span>
                <span class="info-value">${fileName}</span>
            </div>
            ${context.functionName ? `
            <div class="info-item">
                <span class="info-icon">📍</span>
                <span class="info-value function-name">${this.escapeHtml(context.functionName)}</span>
            </div>
            ` : ''}
        </div>

        ${context.note ? `
        <div class="note-box">
            <div class="note-label">What you were doing</div>
            <div class="note-text">💡 ${this.escapeHtml(context.note)}</div>
        </div>
        ` : ''}

        ${context.todoComment ? `
        <div class="note-box">
            <div class="note-label">Next Step</div>
            <div class="note-text">📝 ${this.escapeHtml(context.todoComment)}</div>
        </div>
        ` : ''}

        ${(context.gitBranch || context.gitLastCommit) ? `
        <div class="git-box">
            ${context.gitBranch ? `
            <div class="git-line">
                <span class="git-icon">🔀</span>
                <span><strong>${this.escapeHtml(context.gitBranch)}</strong></span>
                ${context.gitUncommittedFiles ? `<span>• ${context.gitUncommittedFiles} uncommitted</span>` : ''}
            </div>
            ` : ''}
            ${context.gitLastCommit ? `
            <div class="git-line">
                <span class="git-icon">💬</span>
                <span>${this.escapeHtml(context.gitLastCommit.substring(0, 60))}${context.gitLastCommit.length > 60 ? '...' : ''}</span>
            </div>
            ` : ''}
        </div>
        ` : ''}

        <div class="buttons">
            <button class="btn-primary" onclick="continueWork()">
                ✨ Jump to Location
            </button>
            <button class="btn-secondary" onclick="viewHistory()">
                📋 History
            </button>
            <button class="btn-dismiss" onclick="dismiss()">
                ✕
            </button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function continueWork() {
            vscode.postMessage({ command: 'continue' });
        }

        function viewHistory() {
            vscode.postMessage({ command: 'viewHistory' });
        }

        function dismiss() {
            vscode.postMessage({ command: 'dismiss' });
        }
    </script>
</body>
</html>`;
    }

    /**
     * Format timestamp as human-readable "time ago"
     */
    private formatTimeAgo(timestamp: number): string {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / (60 * 1000));
        const hours = Math.floor(diff / (60 * 60 * 1000));

        if (minutes < 1) {
            return 'just now';
        } else if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    private escapeHtml(text: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    /**
     * Dispose the panel
     */
    public dispose(): void {
        this.panel?.dispose();
    }
}
