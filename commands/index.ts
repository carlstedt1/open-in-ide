import { Editor, MarkdownView, Notice } from "obsidian";
import type { PluginSettings, PluginWithSettings } from "../settings";
import { resolveVaultAbsolutePath } from "../utils/helpers";
import { openFileInCursor } from "../launcher/cursorLauncher";

export function registerCommands(plugin: PluginWithSettings<PluginSettings>): void {
  plugin.addCommand({
    id: "open-in-ide",
    name: "Open in IDE (Cursor)",
    editorCheckCallback: (checking, editor: Editor, view) => {
      if (!(view instanceof MarkdownView)) {
        return false;
      }

      const file = view.file;
      if (!file) {
        return false;
      }

      if (checking) {
        return true;
      }

      const cursor = editor.getCursor();
      const line = cursor?.line !== undefined ? cursor.line + 1 : undefined;
      const column = cursor?.ch !== undefined ? cursor.ch + 1 : undefined;

      openFileInCursor(plugin.app, plugin.settings, file, { line, column })
        .then((result) => {
          if (result.ok) {
            const absolute = resolveVaultAbsolutePath(plugin.app, file);
            const payload = absolute ?? `Vault-relative path: ${file.path}`;
            new Notice(result.message ?? `Opened in Cursor: ${payload}`);
          } else if (result.message) {
            new Notice(result.message);
          }
        })
        .catch((error) => {
          console.error("[open-in-ide] failed to launch Cursor", error);
          new Notice("Failed to launch Cursor. Check console for details.");
        });

      return true;
    }
  });
}
