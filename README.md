# obsidian-enhanced-image

> ⚠️ Disclaimer: This plugin is still in active development and may have bugs or incomplete features. Report any issues you encounter.

## Introduction

This plugin is designed to *seamlessly* enhance the image experience in Obsidian. It provides a series of features to make the image management more convenient and efficient. The plugin aims at solving some problems for the image in Obsidian, for example,

1. The operations in context menu for the remote image is not enough for daily usage and there is even no context menu support for local image.
2. It is hard to directly copy/rename/delete image from currently working Markdown file.
3. The process of transforming an image between local/remote is not convenient and should do manually.

Thus, it provides these feature:

- Context menu with some utility functions for not only local image, but also the remote image.
- [WIP] Some out-of-box features to improve the image experience.
- [WIP] Some commands to do some batch operations for images.

## How to Use

The plugin is easy to use. No need to learn any new syntax or knowledge. Just install it and use Obsidian as usual.

- For context menu, just right click on the image and you will see the options.
- [WIP] For some batch operations(e.g. Delete/Convert all images in current md file, Preview/Remove unused images in workspace, Download/Upload the images), you can use the command palette.
- [WIP] For some out-of-box features(e.g. image preview for HEIF/HEIC), you don't need to do anything.
- [WIP] If you want to tweak the plugin(e.g. enabling/disabling some feature), you can go to the settings page.

## Features and TODOs

- [x] Out-of-box Feature: Context Menu for Local Image
  - [x] Copy Image
  - [x] Save as
  - [x] Show in Finder
  - [x] Rename
  - [x] Delete
  - [x] Copy as Markdown Link
  - [x] Reveal in file tree/Finder
  - [ ] Move to another folder
  - [ ] Upload to remote and Replace
  - [ ] Convert Format
- [x] Out-of-box Feature: Context Menu for Remote Image
  - [x] Copy Image
  - [x] Copy Link
  - [x] Save as
  - [x] Download Image and Replace
- [ ] Command: Preview & Remove unused image in workspace
- [ ] Command: Download/Upload for images in current md file
- [ ] Command: Delete/Rename/Convert all images in current md file
- [ ] Out-of-box Feature: Image Preview for HEIF/HEIC
- [ ] Link plugins: Expose an image contextmenu event for other plugins to listen to
- [ ] Automatic: automatic the operations of the feature mentioned above
