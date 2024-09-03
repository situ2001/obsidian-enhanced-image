import { Notice } from "obsidian";
import FileSaver from "file-saver";
import { loadBlobFromUrl } from "./loadBlobFromUrl";

export async function saveImage(imgSrc: string, as: string | undefined = undefined) {
  const blob = await loadBlobFromUrl(imgSrc);
  if (!blob) {
    new Notice("Failed to save image");
    return null;
  }
  const file = new File([blob], as ?? "image.png", { type: blob.type });
  FileSaver.saveAs(file);
}
