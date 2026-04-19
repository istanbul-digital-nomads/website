/**
 * Downloads neighborhood photos listed in src/lib/neighborhoods.ts from
 * Wikimedia Commons (via Special:FilePath redirect), resizes them to hero
 * and gallery dimensions, writes JPEG + WebP siblings under
 * public/images/neighborhoods/<slug>/, and writes an attribution manifest.
 *
 * Idempotent: skips photos whose destination .jpg already exists unless
 * --force is passed.
 *
 * Usage:
 *   pnpm tsx scripts/fetch-neighborhood-photos.ts
 *   pnpm tsx scripts/fetch-neighborhood-photos.ts --force
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  getAllPhotos,
  type NeighborhoodPhoto,
  type Neighborhood,
} from "../src/lib/neighborhoods";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const NEIGHBORHOODS_DIR = path.join(PUBLIC_DIR, "images", "neighborhoods");

type Role = "hero" | "gallery";

const TARGETS: Record<Role, { width: number; height: number }> = {
  hero: { width: 1600, height: 1000 },
  gallery: { width: 1200, height: 800 },
};

const FORCE = process.argv.includes("--force");

interface AttributionEntry {
  slug: string;
  neighborhood: string;
  role: Role;
  src: string;
  alt: string;
  author: string;
  source: string;
  sourceHref: string;
  license: string;
  licenseHref?: string;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      // Wikimedia blocks default bot UAs. Use a descriptive UA per their policy.
      "User-Agent":
        "IstanbulNomadsPhotoFetcher/1.0 (https://istanbulnomads.com; contact@istanbulnomads.com)",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function processPhoto(
  neighborhood: Neighborhood,
  photo: NeighborhoodPhoto,
  role: Role,
): Promise<{ ok: boolean; reason?: string }> {
  const slugDir = path.join(NEIGHBORHOODS_DIR, neighborhood.slug);
  await ensureDir(slugDir);

  const publicSrc = photo.src;
  const jpgPath = path.join(PUBLIC_DIR, publicSrc.replace(/^\//, ""));
  const webpPath = jpgPath.replace(/\.jpg$/, ".webp");

  if (!FORCE && (await exists(jpgPath))) {
    return { ok: true, reason: "cached" };
  }

  const { width, height } = TARGETS[role];
  try {
    const buf = await download(photo.sourceUrl);
    const img = sharp(buf).rotate().resize(width, height, {
      fit: "cover",
      position: "attention",
    });
    await img.jpeg({ quality: 85, mozjpeg: true }).toFile(jpgPath);
    await sharp(buf)
      .rotate()
      .resize(width, height, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toFile(webpPath);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  await ensureDir(NEIGHBORHOODS_DIR);

  const all = getAllPhotos();
  console.log(`Processing ${all.length} photos...`);

  const attributions: AttributionEntry[] = [];
  let downloaded = 0;
  let cached = 0;
  let failed = 0;

  for (const { neighborhood, photo, role } of all) {
    process.stdout.write(
      `  ${neighborhood.name.padEnd(20)} ${role.padEnd(7)} ${photo.sourceFilename}... `,
    );
    const result = await processPhoto(neighborhood, photo, role);
    if (result.ok) {
      if (result.reason === "cached") {
        console.log("cached");
        cached++;
      } else {
        console.log("ok");
        downloaded++;
      }
      attributions.push({
        slug: neighborhood.slug,
        neighborhood: neighborhood.name,
        role,
        src: photo.src,
        alt: photo.alt,
        author: photo.credit.author,
        source: photo.credit.source,
        sourceHref: photo.credit.sourceHref,
        license: photo.credit.license,
        licenseHref: photo.credit.licenseHref,
      });
    } else {
      console.log(`FAILED: ${result.reason}`);
      failed++;
    }
  }

  const manifestPath = path.join(NEIGHBORHOODS_DIR, "attributions.json");
  await fs.writeFile(manifestPath, JSON.stringify(attributions, null, 2));

  console.log(
    `\nDone. downloaded=${downloaded} cached=${cached} failed=${failed}`,
  );
  console.log(`Wrote attributions to ${path.relative(process.cwd(), manifestPath)}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
