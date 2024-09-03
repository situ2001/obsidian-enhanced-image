import { App, PluginSettingTab, Setting } from "obsidian";
import AioImagePlugin from "./main";

export class AioImageSettingTab extends PluginSettingTab {
  plugin: AioImagePlugin;

  constructor(app: App, plugin: AioImagePlugin) {
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


export interface AioImageSettings {
  mySetting: string;
}

export const DEFAULT_SETTINGS: AioImageSettings = {
  mySetting: "default"
};
