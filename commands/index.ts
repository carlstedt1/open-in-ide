import { Notice } from "obsidian";
import type { PluginSettings, PluginWithSettings } from "../settings";
import { resolveVaultAbsolutePath } from "../utils/helpers";
import { openFileInCursor } from "../launcher/cursorLauncher";

export function registerCommands(plugin: PluginWithSettings<PluginSettings>): void {
  plugin.addCommand({
    id: "open-in-cursor",
    name: "Open in cursor",
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file) {
        return false;
      }

      if (checking) {
        return true;
      }

      // Try to get cursor position if an editor is available (for text files)
      const editor = plugin.app.workspace.activeEditor?.editor;
      let line: number | undefined;
      let column: number | undefined;

      if (editor) {
        const cursor = editor.getCursor();
        line = cursor?.line !== undefined ? cursor.line + 1 : undefined;
        column = cursor?.ch !== undefined ? cursor.ch + 1 : undefined;
      }

      openFileInCursor(plugin.app, plugin.settings, file, { line, column })
        .then((result) => {
          if (result.ok) {
            const absolute = resolveVaultAbsolutePath(plugin.app, file);
            const payload = absolute ?? `Vault-relative path: ${file.path}`;
            new Notice(result.message ?? `Opened in cursor: ${payload}`);
          } else if (result.message) {
            new Notice(result.message);
          }
        })
        .catch((error) => {
          console.error("[open-in-ide] failed to launch Cursor", error);
          new Notice("Failed to launch cursor. Check the console for details.");
        });

      return true;
    }
  });
}
