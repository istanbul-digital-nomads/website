// One-off PWA icon generator. Run manually after changing the master icon:
//   node scripts/gen-pwa-icons.mjs
// Outputs to public/icons/. Not part of the build. Uses the already-installed
// `sharp`. Master = src/app/icon.png (512x512).
//
// - icon-192 / icon-512: straight resize, purpose "any".
// - maskable-192 / maskable-512: logo at ~80% on deep-water (#06101f) padding
//   so Android's circle/squircle mask doesn't clip the mark (safe zone).

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "src/app/icon.png";
const OUT = "public/icons";
const BG = { r: 6, g: 16, b: 31, alpha: 1 }; // deep-water

await mkdir(OUT, { recursive: true });

for (const size of [192, 512]) {
  await sharp(SRC).resize(size, size).png().toFile(`${OUT}/icon-${size}.png`);

  // ~10% padding each side => logo at ~80% (Android maskable safe zone).
  // Derive inner from pad so inner + 2*pad === size exactly (no trailing resize).
  const pad = Math.round(size * 0.1);
  const inner = size - pad * 2;
  await sharp(SRC)
    .resize(inner, inner)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: BG })
    .png()
    .toFile(`${OUT}/maskable-${size}.png`);
}

console.log("PWA icons written to", OUT);
