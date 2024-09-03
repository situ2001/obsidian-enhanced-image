/**
 * load blob from url
 * @param url 
 * @returns 
 */
export async function loadBlobFromUrl(url: string): Promise<Blob | null> {
  return new Promise<Blob | null>((resolve, reject) => {
    fetch(url)
      .then((resp) => resp.blob())
      .then((blob) => resolve(blob))
      .catch((e) => {
        console.error("Failed to load blob from url", e);
        reject(e);
      });
  });
}
