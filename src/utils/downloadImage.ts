import { App, TFile } from "obsidian";
import { loadBlobFromUrl } from "./loadBlobFromUrl";
import { fileTypeFromBlob } from "file-type";

export async function downloadImage(app: App, url: string, to?: string): Promise<TFile> {
  const blob = await loadBlobFromUrl(url);
  if (!blob) {
    throw Error("blob is null"); // TODO better log & error, should add a tag for indicating the module
  }
  const arrayBuffer = await blob.arrayBuffer();

  const fileType = await fileTypeFromBlob(blob);
  console.warn(fileType);

  if (!fileType) {
    throw Error("fileType is null");
  }

  if (!fileType.mime.startsWith("image/")) {
    throw Error("fileType is not image");
  }

  if (to !== undefined) {
    // add extension to the file name if it doesn't have one
    const ext = fileType.ext;
    to = to.endsWith(ext) ? to : `${to}.${ext}`;
  } else {
    const urlObject = new URL(url);
    const filename = urlObject.pathname.split("/").pop() ?? "downloaded-image";
    const filenameWithExt = filename.endsWith(fileType.ext) ? filename : `${filename}.${fileType.ext}`;
    // Automatically generate a save-to path
    const defaultPath = await app.fileManager.getAvailablePathForAttachment(filenameWithExt);
    to = defaultPath;
  }

  const file = await app.vault.createBinary(to, arrayBuffer);

  return file;
}
