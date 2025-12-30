import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, loadPluginSettings, savePluginSettings, OpenInIDESettingTab, type PluginSettings } from "./settings";
import { registerCommands } from "./commands";

export default class OpenInIDEPlugin extends Plugin {
  settings!: PluginSettings;

  async onload(): Promise<void> {
    this.settings = await loadPluginSettings(this, DEFAULT_SETTINGS);

    registerCommands(this);

    this.addSettingTab(new OpenInIDESettingTab(this.app, this));
  }

  onunload(): void {
    // Clean up resources that are not already handled by register* helpers.
  }

  async saveSettings(): Promise<void> {
    await savePluginSettings(this, this.settings);
  }
}
