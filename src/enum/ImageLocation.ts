export enum ImageLocation {
  /**
   * The image is located on the local file system.
   * 
   * In Markdown text, for example, it would be `![[img.png]]` or `![Assets/img.png](Assets/img.png)`.
   */
  LOCAL,
  /**
   * The image is located on a remote server.
   * 
   * In Markdown text, for example, it would be `![https://example.com/img.png](https://example.com/img.png)`.
   */
  REMOTE
}
