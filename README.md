# Open in IDE

Open the current Obsidian note in your IDE of choice. Version 0.1.0 focuses on Cursor support, reusing existing windows when possible and staging the vault before jumping to the note.

## ✨ Features
- Command palette action + optional hotkey
- Reuse an existing Cursor window (or spawn a new one)
- Jump to the active markdown file and cursor position
- Settings for CLI path, vault staging, reuse behaviour, and OS fallbacks

## ✅ Currently supported IDEs

| IDE    | Status            | Notes                  |
|--------|-------------------|------------------------|
| Cursor | ✅ Supported      | macOS tested, CLI required |
| VSCode | ❌ Not supported yet | Coming soon |
Next up: Neovim, JetBrains, and more.

## 🧩 Requirements
- Desktop Obsidian (relies on `FileSystemAdapter`)
- Cursor CLI on your PATH  
  > Install within Cursor via `Cmd+Shift+P` → `Shell Command: Install "cursor"`  
  > macOS Homebrew: `brew install --cask cursor`
  > Windows: ensure Cursor is installed and restart the terminal so `%LocalAppData%\Programs\cursor\bin` is on PATH.
- Tested on macOS; other platforms have not yet been formally certified

## 🚀 Installation

1. Copy this folder into your vault as `Vault/.obsidian/plugins/open-in-ide`
2. Enable **Open in IDE** in **Settings → Community plugins**
3. Optional: assign a hotkey in **Settings → Hotkeys**

## 🧭 Usage

1. Open a Markdown file in edit mode
2. Run `Open in IDE (Cursor)` from the command palette or your hotkey
3. Cursor reuses or opens a window, stages the vault (if enabled), and focuses the markdown file

## ⚙️ Settings

| Setting                 | Description                                                  |
|-------------------------|--------------------------------------------------------------|
| Cursor executable path  | Override the Cursor binary location                          |
| Reuse existing window   | Prefer existing Cursor windows for the vault                 |
| Open vault before file  | Ensure the vault is loaded into Cursor before the note       |
| Allow system fallback   | Use `open` / `start` / `xdg-open` if the CLI cannot be found |

## 🪲 Troubleshooting
- “Cursor executable not found …” → update the path or install the CLI
- “Unable to resolve absolute path …” → only markdown files inside the vault are supported
- OS fallback notices mean the command fell back to system launchers instead of the CLI

## 🚧 Known limitations
- Desktop-only; mobile lacks the required APIs
- Cursor CLI is strongly recommended—fallback launchers are best-effort
- Only supports markdown files inside the vault
- Window reuse ultimately depends on the Cursor CLI

See [CHANGELOG.md](./CHANGELOG.md) for release history and [AGENTS.md](./AGENTS.md) for developer notes.
