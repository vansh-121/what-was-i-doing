# Change Log

All notable changes to the "what-was-i-doing" extension will be documented in this file.

**[📥 Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=VanshSethi.what-was-i-doing)**

## [1.0.3] - 2026-01-10

### Added
- 💡 **Automatic Context Notes** - Extension now generates helpful notes automatically when context is saved
  - Examples: "Fixing auth bug in login.ts, need to check JWT expiry"
  - Notes are derived from TODO comments, function names, and file context
  - Displayed prominently in resume popup and history quick pick
- � **Git Awareness** - Automatically captures Git information with each context
  - Branch name (e.g., "feature/auth-fix")
  - Last commit message
  - Number of uncommitted/modified files
  - Helps developers track what feature they were working on
- 🎨 **Dual-Popup UX Strategy** - Perfect balance of information and action
  - 🔔 Quiet notification when context is SAVED (non-intrusive, informational)
  - 🚀 Styled QuickPick when you RETURN (action-driven, focused on continuity)
  - Best of both worlds for developer experience
- 📝 Enhanced context information for better resume experience

### Improved
- 🎯 Resume popup now shows auto-generated notes and Git info for quick context
- 📋 History quick pick displays Git branch and uncommitted files count
- 📖 Updated README with automatic notes and Git awareness documentation

## [1.0.2] - 2025-11-29

### Added
- 📖 Professional README with badges, tables, and improved formatting
- 🎨 Enhanced marketplace presentation
- ❓ FAQ section for common questions
- 🔒 Detailed privacy and security information
- 📋 Comprehensive configuration documentation
- 💾 **Context saving on file switch** - Now saves context when switching between files after 2+ minutes of editing
- 🚪 **Save on deactivate** - Context is automatically saved when VS Code closes or extension deactivates

### Improved
- 🎯 Better use cases presentation with examples
- 💡 Enhanced usage instructions with quick start guide
- 📊 Improved feature descriptions with visual tables
- 🔧 More detailed configuration options with examples
- 🔄 Smarter context tracking with better timing logic

## [1.0.1] - 2025-11-29

### Added
- ✨ Professional extension icon for marketplace
- 📖 Enhanced documentation with marketplace link

### Fixed
- 🐛 Fixed duplicate context detection logic

## [1.0.0] - 2025-11-29

### Added
- 🔄 Automatic activity tracking (file edits, cursor movements, active editors)
- ⏰ Smart idle detection with configurable timeout
- 🎯 Instant resume popup showing last work context
- 📋 Work session history with quick navigation
- 💾 Context preservation (file, line, function name, TODO comments)
- 📊 Status bar integration showing last activity time
- ⚙️ Full configuration support:
  - Customizable idle timeout
  - File exclusion patterns
  - TODO keyword detection
  - History size limits
  - Auto-popup toggle
- 🔒 Local-only storage (privacy-focused)
- 🚫 Duplicate context prevention (doesn't save same context repeatedly)

### Commands
- Show Last Context
- View History
- Save Current Context
- Clear History

### Initial Release
First public release of What Was I Doing extension on VS Code Marketplace.