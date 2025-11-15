<!-- # 🧠 What Was I Doing?

Never lose your train of thought when returning to code. This VS Code extension automatically tracks your work context and helps you resume exactly where you left off after breaks.

## ✨ Features

### 🔄 Automatic Context Tracking
- **Activity Monitoring**: Tracks file edits, cursor movements, and active editors
- **Smart Idle Detection**: Automatically detects when you step away (configurable timeout)
- **Context Preservation**: Saves your exact position, function name, and nearby TODO comments

### 🎯 Instant Resume
When you return to work, get a helpful popup showing:
- **📄 Last Active File**: The file you were working on
- **🔍 Function/Method**: The exact function or class you were editing  
- **📝 Next Step**: TODO/FIXME comments near your cursor for context
- **⏰ Time Away**: How long you've been away

### 📋 Work Session History
- View your recent work sessions with the **View History** command
- Quick navigation to any previous context
- Configurable history size (default: 10 sessions)

### ⚙️ Highly Configurable
- Customize idle timeout (default: 10 minutes)
- Define file exclusion patterns (node_modules, .git, etc.)
- Set custom TODO keywords (TODO, FIXME, HACK, etc.)
- Toggle auto-popup on/off

## 🚀 Getting Started

1. Install the extension from VS Code Marketplace
2. Start coding as usual
3. Step away for a break
4. Return and see the resume popup automatically

## 💡 Usage

### Commands

Access these via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **What Was I Doing: Show Last Context** - View your last saved work context
- **What Was I Doing: View History** - Browse through your recent work sessions
- **What Was I Doing: Save Current Context** - Manually save your current position
- **What Was I Doing: Clear History** - Reset all saved contexts

### Status Bar

Look for the clock icon in the status bar showing your last activity time. Click it to view history.

## ⚙️ Configuration

Customize the extension in VS Code Settings (`File > Preferences > Settings` or `Ctrl+,`):

### `whatWasIDoing.idleTimeoutMinutes`
**Default**: `10`

Minutes of inactivity before context is automatically saved.

```json
"whatWasIDoing.idleTimeoutMinutes": 15
```

### `whatWasIDoing.maxHistorySize`
**Default**: `10`

Maximum number of work sessions to keep in history.

```json
"whatWasIDoing.maxHistorySize": 20
```

### `whatWasIDoing.autoShowResumePopup`
**Default**: `true`

Automatically show resume popup when returning to work.

```json
"whatWasIDoing.autoShowResumePopup": false
```

### `whatWasIDoing.excludePatterns`
**Default**: `[".*node_modules.*", ".*\\.git.*", ".*dist.*", ".*build.*"]`

File path regex patterns to exclude from tracking.

```json
"whatWasIDoing.excludePatterns": [
  ".*node_modules.*",
  ".*\\.git.*",
  ".*test.*"
]
```

### `whatWasIDoing.todoKeywords`
**Default**: `["TODO", "FIXME", "HACK", "NOTE", "BUG", "XXX"]`

Keywords to detect in comments for next-step hints.

```json
"whatWasIDoing.todoKeywords": [
  "TODO",
  "FIXME",
  "WIP"
]
```

## 🎯 Use Cases

### After Coffee Breaks ☕
Return from a 15-minute coffee break and instantly see what you were working on.

### Context Switching 🔀
Switch between projects or tasks and easily resume where you left off.

### End of Day 🌙
Close VS Code at end of day, reopen tomorrow, and pick up exactly where you stopped.

### Interrupted by Meetings 📞
Get pulled into an unexpected meeting? Resume seamlessly afterward.

## 🔒 Privacy

- All data is stored **locally** in VS Code's workspace state
- No data is sent to external servers
- History can be cleared anytime with the "Clear History" command

## 🛠️ Development

### Building from Source

```bash
git clone https://github.com/your-username/what-was-i-doing
cd what-was-i-doing
npm install
npm run compile
```

### Testing

Press `F5` in VS Code to launch Extension Development Host.

## 📝 Requirements

- VS Code version 1.106.0 or higher

## 🐛 Known Issues

- Symbol detection may not work for all programming languages
- Very large files (>1MB) may have slower context extraction

## 📊 Release Notes

### 0.0.1

Initial release:
- Automatic activity tracking
- Idle detection with configurable timeout
- Context extraction (function names, TODO comments)
- Resume popup with navigation
- Work session history
- Status bar integration
- Full configuration support

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests on GitHub.

## 📄 License

MIT License - see LICENSE file for details

## 💬 Feedback

Found a bug or have a feature request? [Open an issue](https://github.com/your-username/what-was-i-doing/issues)

---

**Enjoy coding with better context awareness!** 🎉
 -->
