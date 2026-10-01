// One-off: converts assets-src/logo-original.jpeg (white background) into transparent brand assets.
// Source moved to assets-src/. Run: node scripts/make-logo.mjs
import sharp from "sharp";

const SRC = "assets-src/logo-original.jpeg";
const OUT = "public/brand";
const RED = [168, 0, 0];
const CHARCOAL = [30, 30, 30];

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

// Turn "ink on white" into "ink with alpha": alpha = how far from white, colour un-blended from white.
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const a = 255 - Math.min(r, g, b);
  if (a < 6) { data[i + 3] = 0; continue; }
  // The logo is two-colour ink (red + charcoal): snap to the nearest so JPEG noise leaves no coloured fringes.
  const isRed = r - Math.max(g, b) > 40 * (a / 255);
  const [cr, cg, cb] = isRed ? RED : CHARCOAL;
  data[i] = cr; data[i + 1] = cg; data[i + 2] = cb;
  data[i + 3] = a < 24 ? 0 : a;
}

const full = sharp(data, { raw: { width, height, channels: 4 } });
// Bounding box of real ink (alpha > 60) so stray JPEG noise does not defeat trimming.
let x0 = width, y0 = height, x1 = 0, y1 = 0;
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  if (data[(y * width + x) * 4 + 3] > 60) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
}
const pad = 8;
const box = { left: Math.max(0, x0 - pad), top: Math.max(0, y0 - pad), width: Math.min(width, x1 + pad) - Math.max(0, x0 - pad), height: Math.min(height, y1 + pad) - Math.max(0, y0 - pad) };
const trimmed = { data: await full.clone().extract(box).png().toBuffer(), info: { width: box.width, height: box.height } };
console.log("trimmed size", box);

await sharp(trimmed.data).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-full.png`);
await sharp(trimmed.data).resize({ width: 1200 }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/logo-full.webp`);

// Emblem only: the circle occupies the top part; wordmark sits below it.
const tw = trimmed.info.width, th = trimmed.info.height;
// Ring spans ~3%-98% of the trimmed width and ends ~76% down (measured from the artwork).
const ring = { left: Math.round(tw * 0.025), top: 0, width: Math.round(tw * 0.96), height: Math.round(th * 0.768) };
const emblem = await sharp(trimmed.data).extract(ring).png().toBuffer();
await sharp(emblem).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-emblem.png`);
await sharp(emblem).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/icon-512.png`);
await sharp(emblem).resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(`${OUT}/apple-touch-icon.png`);
await sharp(emblem).resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/favicon-32.png`);
console.log("done");

// Light (cream) variants for dark photography / overlay navigation.
const light = Buffer.from(data);
for (let i = 0; i < light.length; i += 4) { light[i] = 244; light[i + 1] = 238; light[i + 2] = 227; }
const lf = sharp(light, { raw: { width, height, channels: 4 } }).extract(box);
const lightBuf = await lf.png().toBuffer();
await sharp(lightBuf).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-full-light.png`);
await sharp(lightBuf).extract(ring).resize({ width: 800 }).png().toFile(`${OUT}/logo-emblem-light.png`);
console.log("light variants done");
