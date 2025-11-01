# Open in IDE

Open the active Obsidian note in your IDE of choice. The first release focuses on Cursor support, reusing existing windows whenever possible and making sure the vault is loaded before jumping to the note.

## Currently supported IDEs

- Cursor (macOS tested)

## Requirements

- Desktop Obsidian (the plugin relies on the `FileSystemAdapter` API).
- Cursor CLI installed and available on your PATH, or the absolute path configured in the plugin settings.
- Tested on macOS; other platforms should work but have not yet been formally certified.

## Installation

1. Clone or copy this repository into your vault as `Vault/.obsidian/plugins/open-in-ide`.
2. In Obsidian, go to **Settings → Community plugins** and enable “Open in IDE”.
3. Optional: assign a hotkey in **Settings → Hotkeys → Open in IDE**.

## Usage

1. Open a Markdown file in Obsidian’s editor (the command appears only when an editor is active).
2. Run the command palette entry `Open in IDE (Cursor)` (or use your assigned hotkey).
3. Cursor reuses an existing window for the vault when it can, then focuses the active note at the current cursor location.

### Settings

- **Cursor executable path** – point to the Cursor binary if it isn’t on your PATH (leave blank to auto-detect).
- **Reuse existing window** – reuse existing Cursor windows for the vault (default: enabled).
- **Open vault before file** – ensure the vault root is present in Cursor before opening the note (default: enabled).
- **Allow system fallback** – use OS launchers (`open`, `start`, `xdg-open`) if the Cursor CLI cannot be found.

### Error messages

- *“Cursor executable not found …”* – update the executable path or clear the field to use PATH lookup.
- *“Unable to resolve absolute path for the active file.”* – the plugin can only open Markdown files stored in the vault.
- *Fallback notices* – the OS-specific opener was used instead of the Cursor CLI.

## Known limitations

- Desktop-only; the plugin is disabled on mobile.
- Requires the Cursor CLI; without it the plugin can only attempt best-effort fallbacks.
- Window-reuse behaviour ultimately depends on Cursor’s CLI flags.

## Manual installation / updates

1. Run `npm install` inside the plugin folder.
2. Build with `npm run dev` (watch mode) or `npm run build` (production bundle).
3. Reload the plugin from **Settings → Community plugins** after each build.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
