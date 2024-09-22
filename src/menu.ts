// a place to store the context menu
import { Editor, MarkdownFileInfo, MarkdownView, Menu, Notice, Plugin } from "obsidian";
import { saveImage } from "./utils/saveImage";
import { getCurrentSelectedImageAsFile } from "./utils/getCurrentSelectedImage";
import { copyImageToClipboard } from "./utils/copyImageToClipboard";
import RenameModal from "./ui/RenameModal";
import DeleteModal from "./ui/DeleteModal";
import { obsidianLinkRegexImage } from "./constants";
import { downloadImage } from "./utils/downloadImage";

export interface ImageContextMenu {
  registerEvents(): void;
}

export default class ImageContextMenuImpl implements ImageContextMenu {
  private static imgSelectors = [
    "img",
  ];

  private plugin: Plugin;
  private currentlySelectedImages: HTMLImageElement | undefined;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  private buildMenuForLocalImage(menu: Menu): Menu {
    menu.addItem((item) => {
      item.setTitle("Copy");
      item.setIcon("copy");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        copyImageToClipboard(this.currentlySelectedImages);
      });
    });

    menu.addItem((item) => {
      item.setTitle("Copy link");
      item.setIcon("link");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        const file = getCurrentSelectedImageAsFile(this.plugin.app, this.currentlySelectedImages);
        if (!file) {
          new Notice("File not found");
          return;
        }
        const link = this.plugin.app.fileManager.generateMarkdownLink(file, file.path);
        navigator.clipboard.writeText(link);
        new Notice("Copy link successfully");
      });
    });

    menu.addItem((item) => {
      item.setTitle("Save as");
      item.setIcon("save");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        const file = getCurrentSelectedImageAsFile(this.plugin.app, this.currentlySelectedImages);
        saveImage(this.currentlySelectedImages.src, file?.name);
      });
    });

    menu.addItem((item) => {
      item.setTitle("Show in folder"); // TODO macOS is finder and windows is explorer
      item.setIcon("folder-closed");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        // TODO check if the file is local or remote
        const file = getCurrentSelectedImageAsFile(this.plugin.app, this.currentlySelectedImages);
        if (!file) {
          new Notice("No file found");
          return;
        }
        // @ts-ignore
        this.plugin.app.showInFolder(file.path);
      });
    });

    menu.addItem((item) => {
      item.setTitle("Reveal file in navigation");
      item.setIcon("folder-open");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        const file = getCurrentSelectedImageAsFile(this.plugin.app, this.currentlySelectedImages);
        if (!file) {
          new Notice("No file found");
          return;
        }
        // @ts-ignore
        this.plugin.app.internalPlugins.getEnabledPluginById("file-explorer")?.revealInFolder(file);
      });
    });

    menu.addItem((item) => {
      item.setTitle("Open in new tab");
      item.setIcon("external-link");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        const file = getCurrentSelectedImageAsFile(this.plugin.app, this.currentlySelectedImages);
        if (!file) {
          new Notice("No file found");
          return;
        }
        this.plugin.app.workspace.openLinkText(file.path, file.path, true);
      });
    });

    menu.addItem((item) => {
      item.setTitle("Rename");
      item.setIcon("pencil");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        const file = getCurrentSelectedImageAsFile(this.plugin.app, this.currentlySelectedImages);
        if (!file) {
          new Notice("No file found");
          return;
        }
        // TODO hardcoded name, should show a modal to user to input new name instead
        new RenameModal(this.plugin.app, file).open();
      });
    });

    menu.addItem((item) => {
      item.setTitle("Delete");
      item.setIcon("trash");
      item.onClick(() => {
        if (!this.currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        const file = getCurrentSelectedImageAsFile(this.plugin.app, this.currentlySelectedImages);
        if (!file) {
          new Notice("No file found");
          return;
        }
        // TODO maybe we can use generateMarkdown Link to get the link we want to replace by ''?
        new DeleteModal(this.plugin.app, {
          title: "Delete image",
          content: "Are you sure you want to delete this image?",
        }, file, this.currentlySelectedImages).open();
        // safelyTrashImageFile(this.plugin.app, file);
      });
    });

    return menu;
  }

  private onContextMenu(event: MouseEvent) {
    console.warn("onContextMenu", event);
    this.currentlySelectedImages = undefined;

    const target = event.target as HTMLElement;

    const anyMatched = ImageContextMenuImpl.imgSelectors.some((selector) => target.matches(selector));
    if (!anyMatched) {
      return;
    } else {
      this.currentlySelectedImages = event.target as HTMLImageElement;
      event.stopPropagation();
      event.preventDefault();
    }

    // trigger a click event to make corresponding markdown text selected
    const clickEvent = new PointerEvent("click",
      { bubbles: true, cancelable: true, pointerType: "mouse", button: 0 });
    // to avoid trigger another plugins' event handler registered to img element(e.g image toolkit), we need to dispatch the event to its parent element
    const clickDispatchTarget = this.currentlySelectedImages.parentElement ?? this.currentlySelectedImages;
    clickDispatchTarget.dispatchEvent(clickEvent);

    const menu = new Menu();
    this.buildMenuForLocalImage(menu);

    // TODO this may be a bug, the execution order is different between origin window and new window
    // menu.onHide(() => {
    //   console.error("onHide");
    //   this.currentlySelectedImages = undefined;
    // });

    menu.showAtPosition({ x: event.clientX, y: event.clientY });
  }

  private currentMouseDownTarget: HTMLElement | null = null;
  private onMouseDown(event: MouseEvent) {
    this.currentMouseDownTarget = event.target as HTMLElement;
  }

  private onEditorContextMenu(menu: Menu, editor: Editor, info: MarkdownView | MarkdownFileInfo) {
    if (!this.currentMouseDownTarget) {
      return;
    }

    if (this.currentMouseDownTarget instanceof HTMLImageElement === false) {
      return;
    }

    // only effect with img element in view-content
    if (!this.currentMouseDownTarget.matches(".view-content img")) {
      return;
    }

    this.buildMenuForRemoteImage(menu);
  }

  private buildMenuForRemoteImage(menu: Menu): Menu {
    menu.addSeparator();

    const currentlySelectedImages = this.currentMouseDownTarget as HTMLImageElement;

    menu.addItem((item) => {
      item.setTitle("Copy image");
      item.setIcon("copy");
      item.onClick(() => {
        if (!currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        copyImageToClipboard(currentlySelectedImages);
      });
    });

    menu.addItem((item) => {
      item.setTitle("Copy link");
      item.setIcon("link");
      item.onClick(() => {
        if (!currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        navigator.clipboard.writeText(currentlySelectedImages.src);
        new Notice("Link copied to clipboard");
      });
    });

    menu.addItem((item) => {
      item.setTitle("Save Image as");
      item.setIcon("save");
      item.onClick(() => {
        if (!currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        const url = new URL(currentlySelectedImages.src);
        const filename = url.pathname.split("/").filter((x) => x).pop();
        console.warn("filename", filename);
        saveImage(currentlySelectedImages.src, filename);
      });
    });

    menu.addItem((item) => {
      item.setTitle("Download and replace");
      item.setIcon("download");
      item.onClick(async () => {
        if (!currentlySelectedImages) {
          new Notice("No image selected");
          return;
        }
        
        const activeMdFile = this.plugin.app.workspace.getActiveFile();
        if (!activeMdFile) {
          new Notice("No active file to replace");
          return;
        }
        
        const downloadedFile = await downloadImage(this.plugin.app, currentlySelectedImages.src);
        new Notice("Downloaded");
        
        const mdLink = this.plugin.app.fileManager.generateMarkdownLink(downloadedFile, downloadedFile.path);
        console.warn("mdLink", mdLink);

        await this.plugin.app.vault.process(activeMdFile, (content) => {
          const regex = /!\[([^[]+)\]\((.*)\)/gm; // TODO refactor to constants.ts
          const src = currentlySelectedImages.src;
          const newContent = content.replace(regex, (match, p1, p2) => {
            if (p2 === src) {
              return mdLink;
            }
            return match;
          });

          console.log("newContent", newContent);

          return newContent;
        });
        new Notice("Replaced");
      });
    });

    return menu;
  }

  registerEvents() {
    // note that only the image with `![[]]` syntax will trigger this event
    this.plugin.registerDomEvent(document, "contextmenu", this.onContextMenu.bind(this));

    this.plugin.registerDomEvent(document, "mousedown", this.onMouseDown.bind(this));
    this.plugin.registerEvent(
      // note that only the image with `![]()` syntax will trigger this event
      this.plugin.app.workspace.on("editor-menu", this.onEditorContextMenu.bind(this))
    );

    // when new app window is created, we need to re-register the event
    this.plugin.registerEvent(
      this.plugin.app.workspace.on("window-open", (workspace, window) => {
        console.warn("window-open", window);
        const newThis = new ImageContextMenuImpl(this.plugin);
        this.plugin.registerDomEvent(window.document, "contextmenu", newThis.onContextMenu.bind(newThis));
        this.plugin.registerDomEvent(window.document, "mousedown", newThis.onMouseDown.bind(newThis));
        this.plugin.registerEvent(this.plugin.app.workspace.on("editor-menu", newThis.onEditorContextMenu.bind(newThis)));
      })
    );
  }
}
