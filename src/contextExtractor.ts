import * as vscode from 'vscode';
import { WorkContext } from './types';
import { GitHelper } from './gitHelper';

/**
 * Extracts code context information from the active editor
 */
export class ContextExtractor {
    private todoKeywords: string[] = ['TODO', 'FIXME', 'HACK', 'NOTE', 'BUG', 'XXX'];
    private gitHelper: GitHelper;

    constructor() {
        this.gitHelper = new GitHelper();
    }

    /**
     * Set custom TODO keywords to search for
     */
    public setTodoKeywords(keywords: string[]): void {
        this.todoKeywords = keywords;
    }

    /**
     * Enhance a WorkContext with function name, TODO comments, auto-generated note, and git info
     */
    public async enhanceContext(context: WorkContext): Promise<WorkContext> {
        try {
            const document = await vscode.workspace.openTextDocument(context.filePath);

            // Get function/class name at cursor position
            const functionName = await this.getFunctionNameAtPosition(
                document,
                new vscode.Position(context.line, context.column)
            );

            // Get TODO comment near cursor
            const todoComment = this.getTodoCommentNearPosition(
                document,
                context.line
            );

            // Generate automatic note
            const note = this.generateAutoNote(context.filePath, functionName, todoComment);

            // Get Git information
            const gitInfo = await this.gitHelper.getGitInfo(context.filePath);

            return {
                ...context,
                functionName,
                todoComment,
                note,
                gitBranch: gitInfo.branch,
                gitLastCommit: gitInfo.lastCommit,
                gitUncommittedFiles: gitInfo.uncommittedFiles,
            };
        } catch (error) {
            console.error('Failed to enhance context:', error);
            return context;
        }
    }

    /**
     * Get the function or class name at a specific position using DocumentSymbolProvider
     */
    private async getFunctionNameAtPosition(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<string | undefined> {
        try {
            // Use VS Code's built-in symbol provider
            const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                'vscode.executeDocumentSymbolProvider',
                document.uri
            );

            if (!symbols || symbols.length === 0) {
                return undefined;
            }

            // Find the most specific symbol containing this position
            const containingSymbol = this.findContainingSymbol(symbols, position);

            if (containingSymbol) {
                return this.formatSymbolName(containingSymbol);
            }

            return undefined;
        } catch (error) {
            console.error('Failed to get symbols:', error);
            return undefined;
        }
    }

    /**
     * Recursively find the most specific symbol containing the position
     */
    private findContainingSymbol(
        symbols: vscode.DocumentSymbol[],
        position: vscode.Position
    ): vscode.DocumentSymbol | undefined {
        let bestMatch: vscode.DocumentSymbol | undefined;

        for (const symbol of symbols) {
            if (symbol.range.contains(position)) {
                // This symbol contains the position
                bestMatch = symbol;

                // Check children for more specific match
                if (symbol.children && symbol.children.length > 0) {
                    const childMatch = this.findContainingSymbol(symbol.children, position);
                    if (childMatch) {
                        bestMatch = childMatch;
                    }
                }
            }
        }

        return bestMatch;
    }

    /**
     * Format symbol name with its kind for better context
     */
    private formatSymbolName(symbol: vscode.DocumentSymbol): string {
        const kind = this.getSymbolKindName(symbol.kind);

        // For methods, include parent class if available
        if (symbol.kind === vscode.SymbolKind.Method || symbol.kind === vscode.SymbolKind.Function) {
            return `${kind}: ${symbol.name}()`;
        }

        return `${kind}: ${symbol.name}`;
    }

    /**
     * Get human-readable symbol kind name
     */
    private getSymbolKindName(kind: vscode.SymbolKind): string {
        const kindMap: Record<number, string> = {
            [vscode.SymbolKind.Function]: 'Function',
            [vscode.SymbolKind.Method]: 'Method',
            [vscode.SymbolKind.Class]: 'Class',
            [vscode.SymbolKind.Interface]: 'Interface',
            [vscode.SymbolKind.Constructor]: 'Constructor',
            [vscode.SymbolKind.Property]: 'Property',
            [vscode.SymbolKind.Variable]: 'Variable',
            [vscode.SymbolKind.Constant]: 'Constant',
        };
        return kindMap[kind] || 'Code';
    }

    /**
     * Search for TODO/FIXME comments near a line number
     */
    private getTodoCommentNearPosition(
        document: vscode.TextDocument,
        lineNumber: number
    ): string | undefined {
        const searchRange = 10; // Search 10 lines before and after
        const startLine = Math.max(0, lineNumber - searchRange);
        const endLine = Math.min(document.lineCount - 1, lineNumber + searchRange);

        // Search backwards from current line first (more likely to be relevant)
        for (let i = lineNumber; i >= startLine; i--) {
            const todo = this.extractTodoFromLine(document.lineAt(i).text);
            if (todo) {
                return todo;
            }
        }

        // Then search forward
        for (let i = lineNumber + 1; i <= endLine; i++) {
            const todo = this.extractTodoFromLine(document.lineAt(i).text);
            if (todo) {
                return todo;
            }
        }

        return undefined;
    }

    /**
     * Extract TODO comment from a line of text
     */
    private extractTodoFromLine(line: string): string | undefined {
        const trimmedLine = line.trim();

        for (const keyword of this.todoKeywords) {
            // Match patterns like: // TODO: fix this, /* TODO fix this */, # TODO: fix this
            const patterns = [
                new RegExp(`//\\s*${keyword}\\s*:?\\s*(.+)`, 'i'),
                new RegExp(`/\\*\\s*${keyword}\\s*:?\\s*(.+?)\\s*\\*/`, 'i'),
                new RegExp(`#\\s*${keyword}\\s*:?\\s*(.+)`, 'i'),
                new RegExp(`<!--\\s*${keyword}\\s*:?\\s*(.+?)\\s*-->`, 'i'),
            ];

            for (const pattern of patterns) {
                const match = trimmedLine.match(pattern);
                if (match && match[1]) {
                    return `${keyword}: ${match[1].trim()}`;
                }
            }
        }

        return undefined;
    }

    /**
     * Generate an automatic note based on the current context
     */
    private generateAutoNote(filePath: string, functionName?: string, todoComment?: string): string {
        const fileName = filePath.split(/[\\/]/).pop() || 'unknown file';

        // If there's a TODO comment, use it as the primary context
        if (todoComment) {
            if (functionName) {
                return `${todoComment.replace(/^(TODO|FIXME|HACK|NOTE|BUG|XXX):\s*/i, '')} in ${functionName}`;
            }
            return todoComment.replace(/^(TODO|FIXME|HACK|NOTE|BUG|XXX):\s*/i, '');
        }

        // If there's a function name, describe what you're working on
        if (functionName) {
            return `Working on ${functionName} in ${fileName}`;
        }

        // Fallback to just the file name
        return `Editing ${fileName}`;
    }

    /**
     * Get a preview of the code around a specific line
     */
    public getCodePreview(document: vscode.TextDocument, lineNumber: number, contextLines: number = 3): string {
        const startLine = Math.max(0, lineNumber - contextLines);
        const endLine = Math.min(document.lineCount - 1, lineNumber + contextLines);

        const lines: string[] = [];
        for (let i = startLine; i <= endLine; i++) {
            const prefix = i === lineNumber ? '→ ' : '  ';
            lines.push(`${prefix}${i + 1}: ${document.lineAt(i).text}`);
        }

        return lines.join('\n');
    }
}
