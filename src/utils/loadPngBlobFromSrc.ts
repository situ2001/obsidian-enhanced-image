/**
 * use canvas to create png blob from image src
 * @param imgSrc 
 * @returns 
 */
export async function loadPngFrom(imgSrc: string): Promise<Blob | null> {
  return new Promise<Blob | null>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(image, 0, 0);
      canvas.toBlob(blob => { resolve(blob); });
    };
    image.onerror = async () => {
      reject(new Error());
    };
    image.src = imgSrc;
  });
}
