# Open in IDE

Open the current Obsidian file in your IDE of choice. Supports all file types in your vault (`.md`, `.base`, `.canvas`, and more). Cursor support reuses existing windows when possible and can optionally focus a configured Cursor workspace (`.code-workspace`) before jumping to the file.

**Current version: 1.1.1**

## ✨ Features
- Command palette action + optional hotkey
- Reuse an existing Cursor window (or spawn a new one)
- (Optional) Focus a specific Cursor workspace (`.code-workspace`) when the active file belongs to it
- Jump to the active file and cursor position (supports all file types)
- Settings for CLI path, workspace targeting, vault staging, reuse behaviour, and OS fallbacks

## ✅ Currently supported IDEs

| IDE    | Status              | Notes                      |
| ------ | ------------------- | -------------------------- |
| Cursor | ✅ Supported         | macOS tested, CLI required |
| VSCode | ❌ Not supported yet | Coming soon                |
Next up: Neovim, JetBrains, and more.

## 🧩 Requirements
- Desktop Obsidian (relies on `FileSystemAdapter`)
- Cursor CLI installed  
  - Install within Cursor via `Cmd+Shift+P` → `Shell Command: Install "cursor"`  
  - macOS Homebrew: `brew install --cask cursor`
  - Windows: ensure Cursor is installed and restart the terminal so `%LocalAppData%\Programs\cursor\bin` is on PATH.
- If Obsidian can’t find `cursor` on PATH (common when launched from Finder), set **Cursor executable path** in settings.
- Tested on macOS; other platforms have not yet been formally certified

## 🚀 Installation

1. Open **Settings** → **Community plugins** in Obsidian.
2. Search for **Open in IDE**.
3. Click **Install** and then **Enable**.

Alternatively, for manual installation:
1. Copy `main.js` and `manifest.json` into `Vault/.obsidian/plugins/open-in-ide/`.
2. Reload Obsidian and enable the plugin.

## 🧭 Usage

1. Open any file in your vault (markdown, `.base`, `.canvas`, etc.)
2. Run `Open in IDE (Cursor)` from the command palette or your hotkey
3. Cursor reuses or opens a window, stages the vault (if enabled), and focuses the file
4. For text files with an active editor, the cursor position is preserved

## ⚙️ Settings

| Setting                | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| Cursor executable path | Override the Cursor binary location                          |
| Cursor workspace file  | Optional `.code-workspace` to focus/open when the file belongs to it |
| Reuse existing window  | Prefer existing Cursor windows for the vault                 |
| Open vault before file | Ensure the vault is loaded into Cursor before the note       |
| Allow system fallback  | Use `open` / `start` / `xdg-open` if the CLI cannot be found |

## 🪲 Troubleshooting
- "Cursor executable not found …" → update the path or install the CLI
- "Unable to resolve absolute path …" → only files inside the vault are supported
- OS fallback notices mean the command fell back to system launchers instead of the CLI

## 🚧 Known limitations
- Desktop-only; mobile lacks the required APIs
- Cursor CLI is strongly recommended—fallback launchers are best-effort
- Only supports files inside the vault
- Window reuse ultimately depends on the Cursor CLI
- The plugin can’t inspect “currently open” Cursor windows; it targets a workspace/folder and lets Cursor focus an existing matching window when available
- Cursor position is only preserved for files with an active text editor

See [CHANGELOG.md](./CHANGELOG.md) for release history and [AGENTS.md](./AGENTS.md) for developer notes.
