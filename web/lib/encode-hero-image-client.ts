/**
 * Resize + JPEG-compress in the browser so a data URL fits in one Sheets cell.
 * Import only from client components.
 */

import { MAX_HERO_IMAGE_CHARS } from "@/lib/hero-image-constants";

const MAX_FILE_BYTES = 12 * 1024 * 1024;

function loadImageFromObjectUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image file."));
    img.src = url;
  });
}

/**
 * Returns a `data:image/jpeg;base64,...` string under {@link MAX_HERO_IMAGE_CHARS}.
 */
export async function encodeImageFileToHeroDataUrl(file: File): Promise<string> {
  if (!file.size) {
    throw new Error("Empty file.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Image is too large (max 12 MB). Try a smaller file.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImageFromObjectUrl(objectUrl);
    let maxSide = Math.max(img.naturalWidth, img.naturalHeight, 1);
    maxSide = Math.min(maxSide, 1400);

    let quality = 0.88;

    for (let round = 0; round < 24; round++) {
      const ratio = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * ratio));
      const h = Math.max(1, Math.round(img.naturalHeight * ratio));

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Browser could not process image.");
      }
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.length <= MAX_HERO_IMAGE_CHARS) {
        return dataUrl;
      }

      if (maxSide > 400) {
        maxSide = Math.round(maxSide * 0.88);
      } else if (quality > 0.42) {
        quality -= 0.06;
      } else {
        break;
      }
    }

    throw new Error(
      "Image is still too large after compression. Try a smaller or simpler image."
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
