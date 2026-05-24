import fs from "fs";
import path from "path";

// The new seagull brand mark, read once from disk and cached as a base64 data
// URI so it can be embedded directly into both satori (<img>) and Resvg (<image
// href>) OG renderers without a network fetch. The asset is the circular badge
// in public/images/logo-light.png (transparent corners read fine on the dark OG
// canvas).
let cached: string | null = null;

export function ogLogoDataUri(): string {
  if (cached) return cached;
  const file = path.join(process.cwd(), "public", "images", "logo-light.png");
  const base64 = fs.readFileSync(file).toString("base64");
  cached = `data:image/png;base64,${base64}`;
  return cached;
}
