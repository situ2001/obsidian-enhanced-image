import { App, Modal, Notice, Setting, TFile } from "obsidian";
import { render } from "solid-js/web";
import path from "path";

/**
 * Modal to rename a file,
 * noted that the name we are changing is the basename of the file
 */
export default class RenameModal extends Modal {
  private file: TFile;

  private originalName: string;
  private newName: string;

  private solidView = (props: {
    onNewNameChange: (newName: string) => void;
  }) => {
    return <div>
      <p>Original name: {this.file.basename}</p>
      <div style={{
        display: "flex",
        "flex-direction": "row",
        "align-items": "center",
        gap: "10px",
      }}>
        <p>New name: </p>
        <input style={{ flex: 1 }} type="text" onChange={(e) => {
          this.newName = e.target.value;
        }} />
      </div>
    </div>;
  };

  constructor(app: App, file: TFile) {
    super(app);

    this.file = file;
  }

  onOpen(): void {
    // init modal
    this.titleEl.setText("Rename Image");

    const el = this.contentEl.createDiv();
    render(() => <this.solidView onNewNameChange={(newName) => {
      this.newName = newName;
    }}></this.solidView>, el);

    new Setting(this.contentEl)
      .addButton((button) => {
        button.setButtonText("Rename")
          .setWarning()
          .onClick(async () => {
            if (!this.newName) {
              new Notice("New name cannot be empty");
              return;
            }

            if (this.file.basename === this.newName) {
              new Notice("New name is the same as the original name");
              return;
            }

            // try-catch block to handle renaming logic
            try {
              const parentPath = this.file.parent?.path ?? "";
              const pathWithNewName = path.join(parentPath, this.newName + "." + this.file.extension);
              console.warn("Renaming file from", this.file.path, "to", pathWithNewName);
              await this.app.fileManager.renameFile(this.file, pathWithNewName);
            } catch (e) {
              console.error(e);
              new Notice("Failed to rename file:", e.message);
            }

            this.close();
          });
      })
      .addButton((button) => {
        button.setButtonText("Cancel")
          .onClick(() => {
            this.close();
          });
      });
  }

  onClose(): void {

  }
}
