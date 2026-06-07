export async function resizeAndCompress(
  file: File,
  maxPx = 1536,
): Promise<{ base64: string; mimeType: "image/jpeg" }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const scale = Math.min(1, maxPx / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not available"));
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Failed to compress image"));
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(",")[1];
            resolve({ base64, mimeType: "image/jpeg" });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.9,
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}
