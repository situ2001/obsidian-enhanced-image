import { App } from "obsidian";
import { imgExtensions } from "src/constants";
import { ImageRole } from "../enum/ImageRole";

export const getImageRole = (app: App, elem: HTMLImageElement): ImageRole => {
  if (elem instanceof HTMLImageElement === false) {
    return ImageRole.Unknown;
  }

  const parent = elem.parentElement;
  if (!parent) {
    return ImageRole.Unknown;
  }

  const activeFile = app.workspace.getActiveFile();
  if (!parent.matches(".image-embed")) {
    if (!imgExtensions.test(activeFile?.name ?? "")) {
      return ImageRole.Unknown;
    } else {
      return ImageRole.AsActiveTab;
    }
  }

  if (parent.matches(".image-embed") && activeFile?.extension === "md") {
    return ImageRole.AsEmbed;
  }

  return ImageRole.Unknown;
};
