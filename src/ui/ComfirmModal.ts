import { App, Modal, Setting } from "obsidian";

export default class ConfirmModal extends Modal {
  protected title: string;
  protected content: string;
  protected onConfirm: () => void;

  static defaultOptions = {
    title: "Confirm",
    content: "Are you sure?",
    onConfirm: () => { },
  };

  constructor(app: App, opt: Partial<typeof ConfirmModal.defaultOptions>) {
    super(app);

    this.title = opt.title ?? ConfirmModal.defaultOptions.title;
    this.content = opt.content ?? ConfirmModal.defaultOptions.content;
    this.onConfirm = opt.onConfirm ?? ConfirmModal.defaultOptions.onConfirm;
  }

  onOpen(): void {
    this.titleEl.setText(this.title);

    this.contentEl.createEl("p", {
      text: this.content,
    });

    new Setting(this.contentEl)
      .addButton((button) => {
        button.setButtonText("Confirm")
          .setWarning()
          .onClick(() => {
            this.onConfirm();
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
}
