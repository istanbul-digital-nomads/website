import { Resvg } from "@resvg/resvg-js";
import { ogLogoDataUri } from "@/lib/og-logo";
import {
  FONT_FILES,
  resolveFontPath,
  escapeXml,
  splitTitle,
} from "@/lib/og-image-rtl";

// Localized story image (1080x1920) for Arabic-script locales (fa/ar), where
// satori crashes on Arabic shaping. Rendered via resvg-js (HarfBuzz) so the
// Persian/Arabic chrome - eyebrow, date, neighbourhoods, CTA, tagline - shapes
// correctly. Right-aligned to match RTL reading; the title and times may be
// Latin (plan content) and render LTR within the RTL block (HarfBuzz bidi).

const WIDTH = 1080;
const HEIGHT = 1920;
const BRAND = "#c0392b";
const BG_TOP = "#161b26";
const BG_BOTTOM = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";

export interface PlanStoryRtlProps {
  locale: "fa" | "ar";
  title: string;
  dateLabel: string;
  neighborhoods: string[];
  stops: Array<{ name: string; time: string }>;
  shortUrl: string;
  category: string;
  storyCta: string;
  tagline: string;
}

function buildSvg(p: PlanStoryRtlProps): string {
  const family = FONT_FILES[p.locale].family;
  const fallback = "Inter, system-ui, sans-serif";
  const ff = `${family}, ${fallback}`;

  const PAD = 80;
  const RIGHT = WIDTH - PAD; // content right edge (RTL anchor)
  const LEFT = PAD;
  const MID = WIDTH / 2;

  // Brand wordmark, top-right.
  const BADGE = 56;
  const brandY = 320;

  // Content block (right-aligned), starts below the brand.
  let y = 560;
  const eyebrow = [p.category, p.dateLabel].filter(Boolean).join("  ·  ");
  const eyebrowY = y;

  const titleLines = splitTitle(p.title, 22, 3);
  const TITLE_LH = 82;
  const titleStartY = eyebrowY + 96;

  const hoods = p.neighborhoods.slice(0, 4).join("  ·  ");
  const hoodsY = titleStartY + (titleLines.length - 1) * TITLE_LH + 84;

  const shown = p.stops.slice(0, 4);
  const stopsStartY = hoodsY + (hoods ? 80 : 20);
  const STOP_LH = 64;

  // Link block, anchored near the bottom safe line (~1560).
  const ctaY = 1430;
  const pillY = 1470; // pill top
  const PILL_H = 84;
  const PILL_W = 760;
  const taglineY = 1610;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="${RIGHT}" y="${titleStartY + i * TITLE_LH}" text-anchor="end">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const stopRows = shown
    .map((s, i) => {
      const ry = stopsStartY + i * STOP_LH;
      const name = escapeXml(s.name);
      const time = escapeXml(s.time);
      // Name right-anchored, time left-anchored on the same row.
      return `<text x="${RIGHT}" y="${ry}" text-anchor="end" font-family="${ff}" font-size="32" font-weight="600" fill="${FG}">${name}</text>${
        time
          ? `<text x="${LEFT}" y="${ry}" text-anchor="start" font-family="${ff}" font-size="28" fill="${MUTED}">${time}</text>`
          : ""
      }`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" direction="rtl">
  <defs>
    <linearGradient id="canvas" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${BG_TOP}" />
      <stop offset="70%" stop-color="${BG_BOTTOM}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="18%" r="60%">
      <stop offset="0%" stop-color="rgba(192,57,43,0.30)" />
      <stop offset="45%" stop-color="rgba(192,57,43,0.08)" />
      <stop offset="70%" stop-color="rgba(15,17,23,0)" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#canvas)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  <!-- Brand wordmark (top right) -->
  <g font-family="${ff}">
    <image href="${ogLogoDataUri()}" x="${RIGHT - BADGE}" y="${brandY}" width="${BADGE}" height="${BADGE}" />
    <text x="${RIGHT - BADGE - 16}" y="${brandY + BADGE / 2 + 10}" text-anchor="end" font-size="30" font-weight="700" fill="${FG}" letter-spacing="0.5">${escapeXml("Istanbul Nomads".toUpperCase())}</text>
  </g>

  <!-- Eyebrow: category · date -->
  <text x="${RIGHT}" y="${eyebrowY}" text-anchor="end" font-family="${ff}" font-size="28" font-weight="600" letter-spacing="2" fill="${BRAND}">${escapeXml(eyebrow.toUpperCase())}</text>

  <!-- Title -->
  <text font-family="${ff}" font-size="64" font-weight="800" fill="${FG}">${titleTspans}</text>

  ${hoods ? `<text x="${RIGHT}" y="${hoodsY}" text-anchor="end" font-family="${ff}" font-size="30" fill="${MUTED}">${escapeXml(hoods)}</text>` : ""}

  <!-- Stops -->
  ${stopRows}

  <!-- Link block -->
  <text x="${MID}" y="${ctaY}" text-anchor="middle" font-family="${ff}" font-size="28" fill="${MUTED}">${escapeXml(p.storyCta)}</text>
  <rect x="${MID - PILL_W / 2}" y="${pillY}" width="${PILL_W}" height="${PILL_H}" rx="${PILL_H / 2}" fill="${BRAND}" />
  <text x="${MID}" y="${pillY + PILL_H / 2 + 14}" text-anchor="middle" font-family="${ff}" font-size="40" font-weight="800" fill="#ffffff" direction="ltr">${escapeXml(p.shortUrl)}</text>
  <text x="${MID}" y="${taglineY}" text-anchor="middle" font-family="${ff}" font-size="24" fill="${MUTED}">${escapeXml(p.tagline)}</text>
</svg>`;
}

export function renderPlanStoryImageRtl(props: PlanStoryRtlProps): Response {
  const svg = buildSvg(props);
  const fontInfo = FONT_FILES[props.locale];
  const fontFiles = [
    resolveFontPath(fontInfo.primary),
    ...(fontInfo.secondary ?? []).map(resolveFontPath),
  ];
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
    background: BG_BOTTOM,
    font: {
      fontFiles,
      defaultFontFamily: fontInfo.family,
      loadSystemFonts: false,
    },
  });
  const png = resvg.render().asPng();
  const body = png.buffer.slice(
    png.byteOffset,
    png.byteOffset + png.byteLength,
  ) as ArrayBuffer;
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
