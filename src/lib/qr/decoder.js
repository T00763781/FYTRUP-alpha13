import jsQR from "jsqr";

let canvas = null;
let ctx = null;

export function decodeFrame(video) {
  if (!canvas) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d", { willReadFrequently: true });
  }

  const w = video.videoWidth;
  const h = video.videoHeight;

  if (!w || !h) return null;

  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(video, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);

  const qr = jsQR(img.data, w, h, { inversionAttempts: "attemptBoth" });
  return qr ? qr.data.trim() : null;
}
