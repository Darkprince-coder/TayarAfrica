// Converts assets-src/logo-original.jpg (photo of the logo on white) into transparent brand assets.
// Run: node scripts/make-logo.mjs
//
// The logo is a sand map of Africa with a green acacia tree, the gold "Tayari" wordmark and a
// green "AFRICA TOURS" line drawn over the map. Outputs:
//   logo-full(-light)   the whole logo
//   logo-emblem(-light) map + tree only (the lettering is painted out so the mark works small)
//   icons               favicon, apple touch icon, 512 icon from the emblem
import sharp from "sharp";

const SRC = "assets-src/logo-original.jpg";
const OUT = "public/brand";
const SAND = [219, 196, 165];
const CREAM = [244, 238, 227];
const GOLD_LIGHT = [227, 196, 122];
/** Small icons need more contrast than the logo's pale sand: a deeper map and a dark tree. */
const ICON_MAP = [190, 152, 98];
const ICON_TREE = [24, 52, 38];
/** Solid mark for large use over photography: a cream map with a deep green tree. */
const SOLID_MAP = [244, 238, 227];
const SOLID_TREE = [20, 38, 30];
/** The light variants show the map as a faint shape so it reads on photography without a blob. */
const LIGHT_MAP_ALPHA = 0.18;
/** Rows below this belong to the lettering (the tree ends well above it). */
const TEXT_TOP = 540;

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const rgb = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];

// JPEG bleed tints the white next to the gold lettering slightly yellow (e.g. 255,251,242), so
// judge "white" mostly on red/green. The map's lightest pixels stay well below this.
const isWhite = (i) => { const [r, g, b] = rgb(i); return r >= 246 && g >= 243 && b >= 222; };
const isGold = (i) => { const [r, , b] = rgb(i); return r - b > 75 && r > 120; };
const isGreen = (i) => { const [r, g, b] = rgb(i); return g - r > 20 && g >= b; };

// Lettering mask (gold wordmark + green line under it), grown by 2px to catch soft edges.
const ink = new Uint8Array(N);
for (let i = 0; i < N; i++) if (isGold(i) || (isGreen(i) && Math.floor(i / W) >= TEXT_TOP)) ink[i] = 1;
const text = new Uint8Array(N);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!ink[y * W + x]) continue;
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const yy = y + dy, xx = x + dx;
    if (yy >= TEXT_TOP - 2 && yy >= 0 && yy < H && xx >= 0 && xx < W) text[yy * W + xx] = 1;
  }
}

// Outside = white reachable from the image edge, allowed to pass through lettering (so the
// counters of letters that sit off the map count as outside too).
const outside = new Uint8Array(N);
const stack = [];
const push = (i) => { if (!outside[i] && (isWhite(i) || text[i])) { outside[i] = 1; stack.push(i); } };
for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
while (stack.length) {
  const i = stack.pop(), x = i % W, y = (i / W) | 0;
  if (x > 0) push(i - 1);
  if (x < W - 1) push(i + 1);
  if (y > 0) push(i - W);
  if (y < H - 1) push(i + W);
}

// A lettering pixel is "on the map" when, looking left/right/up/down past the lettering,
// at least three directions land on the map rather than on outside white.
function letterOnMap(i) {
  const x0 = i % W, y0 = (i / W) | 0;
  let hits = 0;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    let x = x0, y = y0;
    while (x >= 0 && x < W && y >= 0 && y < H && text[y * W + x]) { x += dx; y += dy; }
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const j = y * W + x;
    if (!(outside[j] && isWhite(j))) hits++;
  }
  return hits >= 3;
}

const onMap = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  if (text[i]) onMap[i] = letterOnMap(i) ? 1 : 0;
  else onMap[i] = outside[i] ? 0 : 1;
}

// Pixels within 2px of outside white form the soft coastline; their alpha comes from how white they are.
const nearEdge = new Uint8Array(N);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (!onMap[i]) continue;
  outer: for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const yy = y + dy, xx = x + dx;
    if (yy < 0 || yy >= H || xx < 0 || xx >= W || !onMap[yy * W + xx]) { nearEdge[i] = 1; break outer; }
  }
}

/** Alpha and colour un-blended from white (for soft edges against the white background). */
function unblend(i) {
  const c = rgb(i);
  const a = Math.min(1, Math.max(0, (255 - Math.min(...c)) / 90));
  if (a === 0) return { a: 0, c };
  return { a, c: c.map((v) => Math.round(Math.max(0, Math.min(255, 255 - (255 - v) / a)))) };
}

function render(kind) {
  const out = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) {
    let a = 0, c = [0, 0, 0], cls = "map";
    const y = (i / W) | 0;
    const tree = y < TEXT_TOP && isGreen(i);
    if (kind.startsWith("emblem") || kind === "icon") {
      if (!onMap[i] && !tree) { a = 0; }
      else if (text[i]) { a = 1; c = SAND; }
      else {
        ({ a, c } = nearEdge[i] ? unblend(i) : { a: 1, c: rgb(i) });
        if (tree) cls = "tree";
      }
    } else {
      ({ a, c } = onMap[i] && !nearEdge[i] ? { a: 1, c: rgb(i) } : unblend(i));
      if (isGold(i)) cls = "gold";
      else if (isGreen(i)) cls = "tree";
    }
    if (kind === "icon" && a > 0) c = cls === "tree" ? ICON_TREE : ICON_MAP;
    if (kind === "emblem-solid" && a > 0) c = cls === "tree" ? SOLID_TREE : SOLID_MAP;
    if (kind.endsWith("light") && a > 0) {
      if (cls === "gold") c = GOLD_LIGHT;
      else if (cls === "tree") c = CREAM;
      else { c = CREAM; a *= LIGHT_MAP_ALPHA; }
    }
    out[i * 4] = c[0]; out[i * 4 + 1] = c[1]; out[i * 4 + 2] = c[2]; out[i * 4 + 3] = Math.round(a * 255);
  }
  return out;
}

/** Bounding box of clearly visible pixels, padded. */
function bbox(buf, min = 60) {
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (buf[(y * W + x) * 4 + 3] > min) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const pad = 6;
  const left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
  return { left, top, width: Math.min(W, x1 + pad + 1) - left, height: Math.min(H, y1 + pad + 1) - top };
}

const raw = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } });

const full = render("full");
const fullBox = bbox(full);
await raw(full).extract(fullBox).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-full.png`);
await raw(full).extract(fullBox).resize({ width: 1200 }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/logo-full.webp`);
// Light variant uses the same box as the colour one so both share an aspect ratio.
await raw(render("full-light")).extract(fullBox).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-full-light.png`);

const emblem = render("emblem");
const emblemBox = bbox(emblem);
const emblemPng = await raw(emblem).extract(emblemBox).png().toBuffer();
await sharp(emblemPng).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-emblem.png`);
await raw(render("emblem-light")).extract(emblemBox).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-emblem-light.png`);
await raw(render("emblem-solid")).extract(emblemBox).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(`${OUT}/logo-emblem-solid.png`);

const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const iconPng = await raw(render("icon")).extract(emblemBox).png().toBuffer();
await sharp(iconPng).resize(512, 512, { fit: "contain", background: clear }).png().toFile(`${OUT}/icon-512.png`);
await sharp(emblemPng).flatten({ background: "#faf6ee" }).resize(144, 144, { fit: "contain", background: "#faf6ee" })
  .extend({ top: 18, bottom: 18, left: 18, right: 18, background: "#faf6ee" }).png().toFile(`${OUT}/apple-touch-icon.png`);
await sharp(iconPng).resize(32, 32, { fit: "contain", background: clear }).png().toFile(`${OUT}/favicon-32.png`);

const ratio = (b) => (b.height / b.width).toFixed(4);
console.log("full box", fullBox, "h/w", ratio(fullBox));
console.log("emblem box", emblemBox, "h/w", ratio(emblemBox));
