import { Plugin } from "obsidian";
import { EnhancedImageSettings, DEFAULT_SETTINGS } from "./settings";
import ImageContextMenuImpl, { ImageContextMenu } from "./menu";

export default class EnhancedImagePlugin extends Plugin {
  settings: EnhancedImageSettings;

  imageContextMenu: ImageContextMenu = new ImageContextMenuImpl(this);

  async onload() {
    await this.loadSettings();

    this.imageContextMenu.registerEvents();
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
