# Changelog

## 0.2.0 - 2025-11-11
- **Extended file type support**: Plugin now works with all file types in the vault, not just markdown files.
- Support for `.base`, `.canvas`, and any other file type in your vault.
- Cursor position is preserved when available (for files with active text editors).
- Fixed path handling for files with spaces in names or paths.
- Command is now available for any active file, not just markdown editors.

## 0.1.0 - 2025-11-02
- Initial release branded as **Open in IDE**. Goal is to support other IDEs in the future. One stop shop for opening files in your IDE of choice.
- Command palette action opens the active note in Cursor, reusing an existing window and staging the vault when required.
- Settings for CLI path overrides, vault staging, window reuse, and fallback behaviour.
- Hardened CLI error handling, cross-vault path resolution, and added unit coverage for command argument construction.
