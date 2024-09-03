import { Notice } from "obsidian";
import { timeout } from "./timeout";
import { loadPngFrom } from "./loadPngBlobFromSrc";


export async function copyImageToClipboard(imgElement: HTMLImageElement) {
  const f = async () => {
    try {
      const blob = await loadPngFrom(imgElement.src);
      if (!blob) {
        throw new Error("Failed to copy image to clipboard");
      }
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      new Notice("Copied image to clipboard");
    } catch (e) {
      console.error("Failed to copy image to clipboard", e);
      new Notice("Failed to copy image to clipboard", e.message);
    }
  };

  return timeout(f(), {
    milliseconds: 5000,
    message: "Failed to copy image to clipboard"
  });
}
