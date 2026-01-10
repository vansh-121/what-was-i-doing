/**
 * Represents a work session context that can be saved and restored
 */
export interface WorkContext {
    /** Absolute file path of the active document */
    filePath: string;
    /** Line number (0-based) where the cursor was positioned */
    line: number;
    /** Column number (0-based) where the cursor was positioned */
    column: number;
    /** Name of the function/class/method being edited, if detected */
    functionName?: string;
    /** TODO/FIXME comment found near the cursor position */
    todoComment?: string;
    /** Automatically generated note describing what you were working on */
    note?: string;
    /** Git branch name when context was saved */
    gitBranch?: string;
    /** Last commit message in the repository */
    gitLastCommit?: string;
    /** Number of uncommitted/modified files */
    gitUncommittedFiles?: number;
    /** Timestamp when this context was saved */
    timestamp: number;
    /** Workspace folder path this context belongs to */
    workspaceFolder?: string;
}

/**
 * Configuration settings for the extension
 */
export interface ExtensionConfig {
    /** Idle timeout in minutes before considering user inactive */
    idleTimeoutMinutes: number;
    /** Maximum number of work sessions to keep in history */
    maxHistorySize: number;
    /** File patterns to exclude from tracking (glob patterns) */
    excludePatterns: string[];
    /** Whether to show the resume popup automatically */
    autoShowResumePopup: boolean;
    /** Keywords to detect in comments (TODO, FIXME, etc.) */
    todoKeywords: string[];
}
