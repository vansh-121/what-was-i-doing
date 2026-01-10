import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Git information for a work context
 */
export interface GitInfo {
    /** Current branch name */
    branch?: string;
    /** Last commit message */
    lastCommit?: string;
    /** Number of uncommitted files */
    uncommittedFiles?: number;
}

/**
 * Helper class to extract Git information from the workspace
 */
export class GitHelper {
    /**
     * Get Git information for a file path
     */
    public async getGitInfo(filePath: string): Promise<GitInfo> {
        try {
            // Get the workspace folder for this file
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
            if (!workspaceFolder) {
                return {};
            }

            // Try to get the Git extension
            const gitExtension = vscode.extensions.getExtension('vscode.git');
            if (!gitExtension) {
                return {};
            }

            if (!gitExtension.isActive) {
                await gitExtension.activate();
            }

            const git = gitExtension.exports;
            const api = git.getAPI(1);

            if (!api || api.repositories.length === 0) {
                return {};
            }

            // Find the repository that contains this file
            const repo = api.repositories.find((r: any) => {
                const repoPath = r.rootUri.fsPath;
                return filePath.startsWith(repoPath);
            });

            if (!repo) {
                return {};
            }

            const info: GitInfo = {};

            // Get branch name
            if (repo.state.HEAD?.name) {
                info.branch = repo.state.HEAD.name;
            }

            // Get last commit message
            if (repo.state.HEAD?.commit) {
                try {
                    const commit = await repo.getCommit(repo.state.HEAD.commit);
                    if (commit && commit.message) {
                        // Get first line of commit message
                        info.lastCommit = commit.message.split('\n')[0].trim();
                    }
                } catch (error) {
                    console.error('Failed to get commit info:', error);
                }
            }

            // Get uncommitted files count
            const changes = repo.state.workingTreeChanges || [];
            const staged = repo.state.indexChanges || [];
            info.uncommittedFiles = changes.length + staged.length;

            return info;
        } catch (error) {
            console.error('Failed to get git info:', error);
            return {};
        }
    }

    /**
     * Format git info for display
     */
    public formatGitInfo(info: GitInfo): string {
        const parts: string[] = [];

        if (info.branch) {
            parts.push(`Branch: ${info.branch}`);
        }

        if (info.lastCommit) {
            // Truncate long commit messages
            const commit = info.lastCommit.length > 50
                ? info.lastCommit.substring(0, 50) + '...'
                : info.lastCommit;
            parts.push(`Commit: ${commit}`);
        }

        if (info.uncommittedFiles !== undefined && info.uncommittedFiles > 0) {
            parts.push(`Uncommitted files: ${info.uncommittedFiles}`);
        }

        return parts.join(' • ');
    }

    /**
     * Get short git summary for quick display
     */
    public getShortGitSummary(info: GitInfo): string {
        const parts: string[] = [];

        if (info.branch) {
            parts.push(info.branch);
        }

        if (info.uncommittedFiles !== undefined && info.uncommittedFiles > 0) {
            parts.push(`${info.uncommittedFiles} uncommitted`);
        }

        return parts.join(' • ');
    }
}
