import { App, TFile } from "obsidian";
import { imgExtensions } from "src/constants";
import { getImageRole } from "./getImageRole";
import { ImageRole } from "../enum/ImageRole";
import { getSrcOfEmbedImage } from "./getSrcOfEmbedImage";


export function getCurrentSelectedImageAsFile(app: App, elem: HTMLImageElement): TFile | null {
  const role = getImageRole(app, elem);
  if (role === ImageRole.Unknown) {
    return null;
  }


  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    return null;
  }

  switch (role) {
  case ImageRole.AsEmbed: {

    const src = getSrcOfEmbedImage(app, elem);
    if (!src) {
      return null;
    }

    // if the active file is not an image, check if the image is embedded in the active file
    const fileCache = app.metadataCache.getFileCache(activeFile);
    if (!(fileCache && fileCache.embeds)) {
      return null;
    }

    const imgFile = app.metadataCache.getFirstLinkpathDest(src, activeFile.path);
    if (imgFile) {
      return imgFile;
    } else {
      return null;
    }
  };
  case ImageRole.AsActiveTab: {
    const file = app.vault.getFileByPath(activeFile.path);
    return file;
  }
  }
}
