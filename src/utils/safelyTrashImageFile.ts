import { App, TFile, Notice } from "obsidian";

/**
 * Safely delete image file. If file has no links to it, then trash it
 * @param app 
 * @param file 
 */
export async function safelyTrashImageFile(app: App, file: TFile) {
  const resolvedLinks = app.metadataCache.resolvedLinks;
  const entities = Object.entries(resolvedLinks);
  let count = 0;
  for (const [path, links] of entities) {
    const obj = Object.entries(links);
    for (const [link, linkCount] of obj) {
      if (link === file.path) {
        count += linkCount;
      }
    }
  }
  if (count <= 1) {
    new Notice("Trashing file");
    await app.fileManager.trashFile(file);
    new Notice("Trashed file");
  } else {
    new Notice("File has other links, not trashing");
  }
}
