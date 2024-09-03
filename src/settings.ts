import { App, PluginSettingTab, Setting } from "obsidian";
import EnhancedImagePlugin from "./main";

export class EnhancedImageSettingTab extends PluginSettingTab {
  plugin: EnhancedImagePlugin;

  constructor(app: App, plugin: EnhancedImagePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText(text => text
        .setPlaceholder("Enter your secret")
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        }));
  }
}


export interface EnhancedImageSettings {
  mySetting: string;
}

export const DEFAULT_SETTINGS: EnhancedImageSettings = {
  mySetting: "default"
};
