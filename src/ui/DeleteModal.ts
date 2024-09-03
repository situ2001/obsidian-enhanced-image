import { App, MarkdownView, Notice, Setting, TFile } from "obsidian";
import ConfirmModal from "./ComfirmModal";
import { safelyTrashImageFile } from "src/utils/safelyTrashImageFile";
import { getImageRole } from "src/utils/getImageRole";
import { ImageRole } from "src/enum/ImageRole";

enum DeleteType {
  /**
   * delete the file and the markdown text
   */
  REMOVE_MD_TEXT_ONLY = 0,
  /**
   * delete the file and the markdown text, but safely consider the links
   */
  REMOVE_FILE_SAFE = 1,
  /**
   * delete the file and the markdown text, without considering the links
   */
  REMOVE_FILE_FORCE = 2,
}

export default class DeleteModal extends ConfirmModal {
  private file: TFile;
  private elem: HTMLImageElement;

  private selectedDeleteType: DeleteType = DeleteType.REMOVE_FILE_SAFE;

  private onConfirmDeleteFile = () => {
    if (!this.file) {
      return;
    }

    if (getImageRole(this.app, this.elem) === ImageRole.AsActiveTab) {
      new ConfirmModal(this.app, {
        title: "Warning",
        content: "The image is in the active tab, it will be deleted immediately, are you sure?",
        onConfirm: () => {
          this.app.fileManager.trashFile(this.file);
        }
      }).open();
      return;
    }

    const removeMdText = (app: App) => {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      console.error(view);
      if (!view) {
        return;
      }
      const editor = view.editor;
      console.error(editor);
      if (!editor) {
        return;
      }
      const selection = editor.getSelection();
      if (!selection) {
        new Notice("No text selected, please delete the image manually");
        return;
      }
      // TODO better to check the selected text
      editor.replaceSelection("");
    };

    switch (this.selectedDeleteType) {
    case DeleteType.REMOVE_MD_TEXT_ONLY:
      removeMdText(this.app);
      break;
    case DeleteType.REMOVE_FILE_SAFE:
      safelyTrashImageFile(this.app, this.file);
      removeMdText(this.app);
      break;
    case DeleteType.REMOVE_FILE_FORCE:
      this.app.fileManager.trashFile(this.file);
      removeMdText(this.app);
      break;
    }
  };


  constructor(app: App, opt: Partial<typeof ConfirmModal.defaultOptions>, file: TFile, elem: HTMLImageElement) {
    super(app, opt);

    this.onConfirm = this.onConfirmDeleteFile;
    this.file = file;
    this.elem = elem;
  }

  onOpen(): void {
    super.onOpen();

    if (getImageRole(this.app, this.elem) === ImageRole.AsActiveTab) {
      // force delete the file if the image is in the active tab
      return;
    }

    // add input check button: Safely delete the file
    new Setting(this.contentEl)
      .setName("Select the delete behavior")
      .addDropdown((dropdown) => {
        dropdown
          .addOptions({
            0: "Remove the markdown text only",
            1: "Remove the file safely",
            2: "Remove the file forcefully",
          })
          .setValue(this.selectedDeleteType.toString())
          .onChange((value) => {
            this.selectedDeleteType = Number(value) as DeleteType;
          });
      });
  }
}
