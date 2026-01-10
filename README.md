<p align="center">
  <img src="https://raw.githubusercontent.com/vansh-121/what-was-i-doing/master/icon.png" alt="What Was I Doing Logo" width="120" height="120">
</p>

<h1 align="center">What Was I Doing?</h1>

<p align="center">
  <strong>Never lose your train of thought when returning to code</strong>
</p>

<p align="center">
  <a href="https://whatwasidoing.dev">
    <img src="https://img.shields.io/badge/Website-whatwasidoing.dev-blue?style=for-the-badge&logo=google-chrome" alt="Website">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing">
    <img src="https://img.shields.io/visual-studio-marketplace/v/VanshSethi.what-was-i-doing?style=for-the-badge&logo=visual-studio-code&label=VS%20Code%20Marketplace" alt="VS Code Marketplace Version">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing">
    <img src="https://img.shields.io/visual-studio-marketplace/d/VanshSethi.what-was-i-doing?style=for-the-badge&logo=visual-studio-code" alt="Downloads">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing">
    <img src="https://img.shields.io/visual-studio-marketplace/r/VanshSethi.what-was-i-doing?style=for-the-badge&logo=visual-studio-code" alt="Rating">
  </a>
  <a href="https://github.com/vansh-121/what-was-i-doing/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/vansh-121/what-was-i-doing?style=for-the-badge" alt="License">
  </a>
</p>

<p align="center">
  <a href="https://whatwasidoing.dev">🌐 Website</a> •
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#%EF%B8%8F-configuration">Configuration</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 📖 About

**What Was I Doing?** is a VS Code extension that automatically tracks your work context and helps you resume exactly where you left off after breaks. Perfect for developers who switch between tasks, take coffee breaks, or need to context-switch frequently.

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔄 Automatic Context Tracking

Seamlessly monitors your coding activity without any manual intervention.

- 📝 **Activity Monitoring** - Tracks file edits, cursor movements, and active editors
- ⏱️ **Smart Idle Detection** - Automatically detects when you step away
- 💾 **Context Preservation** - Saves your exact position, function name, and nearby TODO comments
- 🚫 **Smart Deduplication** - Doesn't save duplicate contexts repeatedly

</td>
<td width="50%">

### 🎯 Instant Resume

Get back to work instantly with helpful context.

- 📄 **Last Active File** - Jump to the exact file you were editing
- 🔍 **Function/Method** - See the function or class you were in
- � **Auto-Generated Notes** - Automatic context summary (e.g., "Fixing auth bug in login.ts")- 🔀 **Git Awareness** - Branch name, last commit, and uncommitted files count- �📝 **Next Steps** - View TODO/FIXME comments for context
- ⏰ **Time Tracking** - Know how long you've been away

</td>
</tr>
<tr>
<td width="50%">

### 📋 Work Session History

Never lose track of your recent work.

- 🕒 **Session Timeline** - Browse through recent work sessions
- 🔍 **Quick Navigation** - Jump to any previous context instantly
- 📊 **Configurable Size** - Keep as many sessions as you need
- 🗂️ **Per-Workspace** - Separate history for each project

</td>
<td width="50%">

### ⚙️ Highly Configurable

Customize the extension to fit your workflow.

- ⏲️ **Idle Timeout** - Set from 1-120 minutes (default: 10)
- 🚫 **File Exclusions** - Ignore node_modules, .git, etc.
- 🏷️ **Custom Keywords** - Define your own TODO keywords
- 🔔 **Auto-Popup** - Toggle automatic resume notifications

</td>
</tr>
</table>

## 🚀 Installation

### From VS Code Marketplace

<a href="https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing">
  <img src="https://img.shields.io/badge/Install-VS%20Code%20Marketplace-blue?style=for-the-badge&logo=visual-studio-code" alt="Install from Marketplace">
</a>

#### Method 1: VS Code UI (Recommended)
1. Open **VS Code**
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
3. Search for **"What Was I Doing"**
4. Click **Install**

#### Method 2: Command Line
```bash
code --install-extension VanshSethi.what-was-i-doing
```

#### Method 3: Direct Link
[→ Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing)

## 💡 Usage

### Quick Start

1. **Install the extension** (see [Installation](#-installation))
2. **Start coding** - The extension automatically tracks your activity
3. **Take a break** - Step away for coffee, meetings, or lunch
4. **Return** - See a helpful popup showing where you left off!

### Available Commands

Open the Command Palette with `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac):

| Command | Description | Icon |
|---------|-------------|------|
| `What Was I Doing: Show Last Context` | View your most recent work context | 🕒 |
| `What Was I Doing: View History` | Browse all saved work sessions | 📋 |
| `What Was I Doing: Save Current Context` | Manually save your current position | 💾 |
| `What Was I Doing: Clear History` | Reset all saved contexts | 🗑️ |

### Status Bar Integration

Look for the **clock icon** (🕒) in your status bar:
- Shows time since last activity (e.g., "2m ago", "1h ago")
- Click it to quickly view your work history
- Hover for tooltip with last active function/file

### 💡 Automatic Context Notes

The extension automatically generates helpful notes about what you were working on:

**Examples:**
```
💡 Fixing auth bug in login.ts, need to check JWT expiry in Method: validateToken()
💡 Working on Method: fetchUserData() in api.ts
💡 Editing database.ts
```

These notes are generated from:
- TODO/FIXME comments near your cursor
- Function/method names you were editing
- The file you were working in

The notes appear in:
- 🔔 Resume popup when you return
- 📋 History quick pick menu
- 🕒 Status bar tooltips

### 🔀 Git Awareness

The extension automatically captures Git context when saving your work:

**Captured Information:**
- 🌿 Branch name (e.g., `feature/auth-fix`)
- 💬 Last commit message
- 📝 Number of uncommitted files

**Example Display:**
```
🔀 Branch: feature/auth-fix • Uncommitted files: 3
💬 Last commit: feat: add JWT token validation
```

This helps you quickly understand:
- What feature/fix you were working on
- If you have uncommitted changes
- The last stable point in your work

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` or `Ctrl+,` (Windows/Linux) / `Cmd+,` (Mac), then search for "What Was I Doing".

<details>
<summary><b>📋 All Configuration Options</b></summary>

<br>

### ⏲️ `whatWasIDoing.idleTimeoutMinutes`

Minutes of inactivity before context is automatically saved.

- **Type**: `number`
- **Default**: `10`
- **Range**: 1-120

```json
{
  "whatWasIDoing.idleTimeoutMinutes": 15
}
```

---

### 📚 `whatWasIDoing.maxHistorySize`

Maximum number of work sessions to keep in history.

- **Type**: `number`
- **Default**: `10`
- **Range**: 1-50

```json
{
  "whatWasIDoing.maxHistorySize": 20
}
```

---

### 🔔 `whatWasIDoing.autoShowResumePopup`

Automatically show resume popup when returning to work.

- **Type**: `boolean`
- **Default**: `true`

```json
{
  "whatWasIDoing.autoShowResumePopup": false
}
```

---

### 🚫 `whatWasIDoing.excludePatterns`

File path regex patterns to exclude from tracking.

- **Type**: `array of strings`
- **Default**: `[".*node_modules.*", ".*\\.git.*", ".*dist.*", ".*build.*"]`

```json
{
  "whatWasIDoing.excludePatterns": [
    ".*node_modules.*",
    ".*\\.git.*",
    ".*test.*",
    ".*\\.cache.*"
  ]
}
```

---

### 🏷️ `whatWasIDoing.todoKeywords`

Keywords to detect in comments for next-step hints.

- **Type**: `array of strings`
- **Default**: `["TODO", "FIXME", "HACK", "NOTE", "BUG", "XXX"]`

```json
{
  "whatWasIDoing.todoKeywords": [
    "TODO",
    "FIXME",
    "WIP",
    "REVIEW"
  ]
}
```

</details>

## 🎯 Use Cases

<details open>
<summary><b>Perfect for developers who...</b></summary>

<br>

| Scenario | How It Helps |
|----------|--------------|
| ☕ **Coffee Breaks** | Return from a 15-minute break and instantly recall what you were coding |
| 🔀 **Context Switching** | Jump between multiple projects without losing your place |
| 🌙 **End of Day** | Close VS Code at 5pm, reopen at 9am, pick up exactly where you left off |
| 📞 **Unexpected Meetings** | Get pulled into a meeting? Resume your work seamlessly afterward |
| 🐛 **Debugging Sessions** | Navigate through different files and functions while maintaining context |
| 📚 **Code Reviews** | Switch between reviewing PRs and your own work effortlessly |
| 🎯 **Focus Sessions** | Take breaks between Pomodoro sessions without losing momentum |

</details>

## 🔒 Privacy & Security

<table>
<tr>
<td>

✅ **100% Local Storage**
</td>
<td>
All data stored locally in VS Code's workspace state
</td>
</tr>
<tr>
<td>

✅ **No External Servers**
</td>
<td>
Zero network requests - your code stays private
</td>
</tr>
<tr>
<td>

✅ **User Control**
</td>
<td>
Clear history anytime with one command
</td>
</tr>
<tr>
<td>

✅ **Open Source**
</td>
<td>
<a href="https://github.com/vansh-121/what-was-i-doing">Fully auditable code on GitHub</a>
</td>
</tr>
</table>

## ❓ FAQ

<details>
<summary><b>Does this extension slow down VS Code?</b></summary>

No! The extension uses efficient event listeners and only activates after VS Code finishes starting up. It has minimal performance impact.
</details>

<details>
<summary><b>Will it track files in node_modules or .git?</b></summary>

No. Common directories like `node_modules`, `.git`, `dist`, and `build` are excluded by default. You can customize exclusions in settings.
</details>

<details>
<summary><b>Can I use this across multiple workspaces?</b></summary>

Yes! Each workspace maintains its own separate history, so contexts don't mix between projects.
</details>

<details>
<summary><b>What happens if I don't want the auto-popup?</b></summary>

You can disable it in settings with `"whatWasIDoing.autoShowResumePopup": false`. You can still view history manually via the command palette or status bar.
</details>

<details>
<summary><b>Does it work with all programming languages?</b></summary>

Yes! Activity tracking works with all languages. Function name detection works best with JavaScript/TypeScript, Python, Java, C++, and other common languages.
</details>

## 🛠️ Development

### Building from Source

```bash
git clone https://github.com/vansh-121/what-was-i-doing
cd what-was-i-doing
npm install
npm run compile
```

### Testing

Press `F5` in VS Code to launch Extension Development Host.

## 📋 Requirements

| Requirement | Version |
|-------------|---------|
| **VS Code** | ≥ 1.106.0 |
| **OS** | Windows, macOS, Linux |

## 🐛 Known Issues & Limitations

| Issue | Workaround |
|-------|------------|
| Symbol detection may not work for all languages | Works best with JS/TS, Python, Java, C++ |
| Very large files (>1MB) may have slower extraction | Excluded by default in most cases |
| Function detection in complex nested structures | Still captures file and line number |

**Found a bug?** [Report it here](https://github.com/vansh-121/what-was-i-doing/issues/new?labels=bug) 🐛

## 📊 Release Notes

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

### Latest Version: 1.0.4

- 🐛 **FIXED**: Custom TODO keywords now properly respected in note generation
- 🐛 **FIXED**: TODO comment changes now correctly trigger new context saves
- 💡 Automatic context notes generation
- 🔀 Git awareness (branch, commit, uncommitted files)
- 📝 Intelligent notes from TODO comments, function names, and file context
- 🎯 Enhanced resume experience with prominent note display
- ⏰ Smart idle detection
- 🎯 Instant resume popup
- 📋 Work session history
- 🚫 Duplicate context prevention

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

- 🐛 [Report a Bug](https://github.com/vansh-121/what-was-i-doing/issues/new?labels=bug)
- 💡 [Request a Feature](https://github.com/vansh-121/what-was-i-doing/issues/new?labels=enhancement)
- 📖 [Read Contributing Guidelines](CONTRIBUTING.md)

### Development

```bash
# Clone the repository
git clone https://github.com/vansh-121/what-was-i-doing.git
cd what-was-i-doing

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in development mode
# Press F5 in VS Code to launch Extension Development Host
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support & Feedback

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing">
    <img src="https://img.shields.io/badge/⭐-Rate%20this%20extension-blue?style=for-the-badge" alt="Rate Extension">
  </a>
  <a href="https://github.com/vansh-121/what-was-i-doing/issues">
    <img src="https://img.shields.io/badge/🐛-Report%20Issue-red?style=for-the-badge" alt="Report Issue">
  </a>
</p>

<p align="center">
  <strong>If you find this extension helpful, please consider:</strong><br>
  ⭐ Starring the repo on GitHub<br>
  ⭐ Rating it on the VS Code Marketplace<br>
  🐦 Sharing it with your developer friends
</p>

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/vansh-121">Vansh Sethi</a>
</p>

<p align="center">
  <a href="https://whatwasidoing.dev">Website</a> •
  <a href="https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing">VS Code Marketplace</a> •
  <a href="https://github.com/vansh-121/what-was-i-doing">GitHub Repository</a> •
  <a href="https://github.com/vansh-121/what-was-i-doing/issues">Report Issues</a>
</p>
