import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

export interface PluginSettings {
  /** Absolute path to the Cursor CLI binary. Leave empty to use PATH lookup. */
  cursorExecutablePath: string;
  /** Optional path to a .code-workspace file to target when the active file belongs to it. */
  cursorWorkspaceFilePath: string;
  /** Attempt to reuse the existing Cursor window if one is open on the vault. */
  reuseExistingWindow: boolean;
  /** Open the vault folder before targeting the active file. */
  openVaultBeforeFile: boolean;
  /** When the CLI is unavailable, try a system-level opener (open/start/xdg-open). */
  allowSystemFallback: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  cursorExecutablePath: "",
  cursorWorkspaceFilePath: "",
  reuseExistingWindow: true,
  openVaultBeforeFile: true,
  allowSystemFallback: true
};

export interface PluginWithSettings<T extends PluginSettings> extends Plugin {
  settings: T;
  saveSettings(): Promise<void>;
}

export async function loadPluginSettings<T extends PluginSettings>(plugin: Plugin, defaults: T): Promise<T> {
  const stored = await plugin.loadData();
  return Object.assign({}, defaults, stored ?? {});
}

export async function savePluginSettings<T extends PluginSettings>(plugin: Plugin, settings: T): Promise<void> {
  await plugin.saveData(settings);
}

export class OpenInIDESettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: PluginWithSettings<PluginSettings>) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Cursor executable path")
      .setDesc("Optional absolute path to the cursor executable. Leave blank to rely on your system path.")
      .addText((text) =>
        text
          .setPlaceholder("/usr/local/bin/cursor")
          .setValue(this.plugin.settings.cursorExecutablePath)
          .onChange(async (value) => {
            this.plugin.settings.cursorExecutablePath = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Cursor workspace file (optional)")
      .setDesc("If set, the plugin will try to focus/open this .code-workspace when the active file is inside one of its folders.")
      .addText((text) =>
        text
          .setPlaceholder("/Users/you/Obsidian-Main.code-workspace")
          .setValue(this.plugin.settings.cursorWorkspaceFilePath)
          .onChange(async (value) => {
            this.plugin.settings.cursorWorkspaceFilePath = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Reuse existing window")
      .setDesc("Request cursor to reuse an open window for this vault when possible.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.reuseExistingWindow)
          .onChange(async (value) => {
            this.plugin.settings.reuseExistingWindow = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Open vault before file")
      .setDesc("Open the vault root in cursor before targeting the active note.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.openVaultBeforeFile)
          .onChange(async (value) => {
            this.plugin.settings.openVaultBeforeFile = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Allow system fallback")
      .setDesc("Use the system opener if the cursor executable cannot be found.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.allowSystemFallback)
          .onChange(async (value) => {
            this.plugin.settings.allowSystemFallback = value;
            await this.plugin.saveSettings();
            if (!value) {
              new Notice("System fallback disabled. The command will fail if the cursor executable is unavailable.");
            }
          })
      );
  }
}
