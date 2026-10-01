// Dev helper: builds the social-share image from hero-01 and contact sheets of every placed photo.
// Usage: node scripts/review-sheets.mjs <output-folder>
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = "public/images";
const out = process.argv[2] ?? "tmp-sheets";
fs.mkdirSync(out, { recursive: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

fs.mkdirSync(`${root}/og`, { recursive: true });
await sharp(`${root}/hero/hero-01.jpg`).resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(`${root}/og/default.jpg`);

const files = walk(root).filter((f) => /\.jpe?g$/i.test(f)).sort();
const W = 300, H = 200, cols = 5, per = 20;
const tiles = [];
for (const f of files) {
  const name = path.relative(root, f).replaceAll("\\", "/").replace(/&/g, "");
  const label = Buffer.from(`<svg width="${W}" height="26"><rect width="${W}" height="26" fill="#000" opacity=".72"/><text x="6" y="18" font-size="13" font-family="Arial" fill="#fff">${name}</text></svg>`);
  tiles.push(await sharp(f).resize(W, H, { fit: "cover" }).composite([{ input: label, gravity: "south" }]).jpeg().toBuffer());
}
for (let s = 0; s * per < tiles.length; s++) {
  const part = tiles.slice(s * per, s * per + per);
  const rows = Math.ceil(part.length / cols);
  await sharp({ create: { width: cols * (W + 4), height: rows * (H + 4), channels: 3, background: "#222" } })
    .composite(part.map((b, i) => ({ input: b, left: (i % cols) * (W + 4), top: Math.floor(i / cols) * (H + 4) })))
    .jpeg({ quality: 80 })
    .toFile(path.join(out, `placed-${s}.jpg`));
}
console.log(files.length, "files");
