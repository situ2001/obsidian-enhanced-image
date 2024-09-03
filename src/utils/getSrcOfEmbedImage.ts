
import { App } from "obsidian";
import { getImageRole } from "./getImageRole";
import { ImageRole } from "../enum/ImageRole";

export function getSrcOfEmbedImage(app: App, elem: HTMLImageElement) {
  const role = getImageRole(app, elem);
  if (role === ImageRole.Unknown) {
    throw new Error("Unknown image role");
  }

  switch (role) {
  case ImageRole.AsActiveTab:
    return elem.src;
  case ImageRole.AsEmbed:
  {
    const parent = elem.parentElement;
    if (!parent) {
      throw new Error("No parent element");
    }
    return parent.getAttribute("src");
  }
  }
}
