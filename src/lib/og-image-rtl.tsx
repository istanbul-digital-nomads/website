import fs from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";
import type { Locale } from "@/lib/i18n/config";

// Mirror of @vercel/og's OG card design, rasterized via resvg-js for
// Arabic-script locales (fa/ar) where satori crashes on GSUB lookupType 5.
// resvg-js uses HarfBuzz under the hood, which handles Arabic shaping
// correctly. The layout is mirrored (brand top-right, content right-
// aligned, footer right-anchored) to match the locale's reading direction.

const WIDTH = 1200;
const HEIGHT = 630;

const BRAND = "#c0392b";
const BG_TOP = "#141822";
const BG_BOTTOM = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";

interface RtlProps {
  category: string;
  title: string;
  description?: string;
  tagline?: string;
  locale: "fa" | "ar";
}

// Vazirmatn for Persian (covers Persian-specific glyphs like ی and ک in
// modern style; also ships full Latin glyphs, so the brand wordmark in
// the same image renders correctly without a separate Latin font).
// Noto Sans Arabic for Arabic - but Noto Sans Arabic has NO Latin glyphs,
// so we also load Vazirmatn as the Latin fallback font in the Arabic
// renderer. resvg-js picks per-glyph: Arabic chars → Noto Sans Arabic,
// Latin chars → Vazirmatn.
const VAZIRMATN_REG = "public/fonts/og/Vazirmatn-Regular.ttf";
const VAZIRMATN_BOLD = "public/fonts/og/Vazirmatn-Bold.ttf";

const FONT_FILES: Record<
  "fa" | "ar",
  { primary: string; secondary?: string[]; family: string }
> = {
  fa: {
    primary: VAZIRMATN_REG,
    secondary: [VAZIRMATN_BOLD],
    family: "Vazirmatn",
  },
  ar: {
    primary: "public/fonts/og/NotoSansArabic-Regular.ttf",
    secondary: [
      "public/fonts/og/NotoSansArabic-Bold.ttf",
      VAZIRMATN_REG,
      VAZIRMATN_BOLD,
    ],
    family: "Noto Sans Arabic",
  },
};

// Resolve relative paths to absolute once, so resvg-js can stream the
// fonts off disk. Resolving per-request is fine - resvg's own pipeline
// memoizes the parsed font tables.
function resolveFontPath(p: string): string {
  return path.join(process.cwd(), p);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// SVG `<text>` doesn't auto-wrap. Split a long title into manual `<tspan>`
// lines, breaking at the nearest space (or just by character count if the
// run has no spaces - common in long Persian titles). Cap at 3 lines.
function splitTitle(
  text: string,
  maxCharsPerLine: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (candidate.length <= maxCharsPerLine) {
      cur = candidate;
    } else {
      if (cur) lines.push(cur);
      // Word itself longer than the line: hard-break it.
      if (w.length > maxCharsPerLine) {
        for (let i = 0; i < w.length; i += maxCharsPerLine) {
          lines.push(w.slice(i, i + maxCharsPerLine));
        }
        cur = "";
      } else {
        cur = w;
      }
    }
    if (lines.length >= maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (
    lines.length === maxLines &&
    lines[maxLines - 1].length === maxCharsPerLine
  ) {
    // Likely truncated; add an ellipsis.
    lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + "…";
  }
  return lines.slice(0, maxLines);
}

function buildSvg(props: RtlProps): string {
  const { category, title, description, tagline, locale } = props;
  const family = FONT_FILES[locale].family;
  const fallbackFamily = "Inter, system-ui, sans-serif";

  // RTL design: anchor block to the right edge, mirror brand wordmark.
  const PADDING_X = 80;
  const PADDING_Y = 72;
  const CONTENT_RIGHT = WIDTH - PADDING_X;
  const CONTENT_LEFT = PADDING_X;
  const BADGE_SIZE = 40;
  const BADGE_GAP = 16;
  const BRAND_TEXT = "Istanbul Nomads";

  // Type scale tuned so a 2-line title + 2-line description + footer all
  // sit between the brand wordmark and the footer with breathing room.
  const TITLE_FONT = 60;
  const TITLE_LH = 70;
  const CATEGORY_FONT = 22;
  const DESC_FONT = 26;
  const DESC_LH = 34;
  const FOOTER_FONT = 20;

  // Persian/Arabic glyphs are denser than Latin. ~22 chars fits a 1040px
  // line at fontSize 60 once shaped.
  const titleLines = splitTitle(title, 22, 2);
  const descLines = description ? splitTitle(description, 50, 2) : [];

  // Brand wordmark - top RIGHT for RTL design.
  const BRAND_BADGE_X = CONTENT_RIGHT - BADGE_SIZE;
  const BRAND_TEXT_X = CONTENT_RIGHT - BADGE_SIZE - BADGE_GAP;
  const BRAND_BASELINE = PADDING_Y + BADGE_SIZE / 2 + 8;

  // Footer baseline (URL on LEFT, tagline on RIGHT). Anchored to the
  // bottom padding line.
  const FOOTER_Y = HEIGHT - PADDING_Y;

  // Content block: position bottom-up from the footer so even a 1-line
  // title doesn't drift into the center void.
  const DESC_BLOCK_HEIGHT = descLines.length * DESC_LH;
  const TITLE_BLOCK_HEIGHT = titleLines.length * TITLE_LH;
  const DESC_BOTTOM_Y = FOOTER_Y - 50; // leave 50px above footer
  const DESC_START_Y = DESC_BOTTOM_Y - DESC_BLOCK_HEIGHT + DESC_FONT * 0.8;
  const TITLE_BOTTOM_Y = description
    ? DESC_BOTTOM_Y - DESC_BLOCK_HEIGHT - 30
    : DESC_BOTTOM_Y;
  const TITLE_START_Y = TITLE_BOTTOM_Y - TITLE_BLOCK_HEIGHT + TITLE_FONT * 0.85;
  // Arabic-script ascenders/diacritics extend well above the baseline;
  // give the eyebrow extra room so it doesn't collide with the title.
  const CATEGORY_Y = TITLE_START_Y - TITLE_FONT * 1.05;

  // resvg's dy handling inside a parent <text> can mis-align with
  // direction="rtl" + text-anchor="end"; use absolute y per tspan instead.
  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="${CONTENT_RIGHT}" y="${TITLE_START_Y + i * TITLE_LH}" text-anchor="end">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const descTspans = descLines
    .map(
      (line, i) =>
        `<tspan x="${CONTENT_RIGHT}" y="${DESC_START_Y + i * DESC_LH}" text-anchor="end">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" direction="rtl">
  <defs>
    <linearGradient id="canvas" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${BG_TOP}" />
      <stop offset="100%" stop-color="${BG_BOTTOM}" />
    </linearGradient>
    <linearGradient id="corner" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(192,57,43,0.35)" />
      <stop offset="35%" stop-color="rgba(192,57,43,0.10)" />
      <stop offset="60%" stop-color="rgba(15,17,23,0)" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#canvas)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#corner)" />

  <!-- Brand wordmark (top right in RTL) -->
  <g font-family="${family}, ${fallbackFamily}">
    <rect x="${BRAND_BADGE_X}" y="${PADDING_Y}" width="${BADGE_SIZE}" height="${BADGE_SIZE}" rx="12" fill="${BRAND}" />
    <text x="${BRAND_BADGE_X + BADGE_SIZE / 2}" y="${BRAND_BASELINE}" text-anchor="middle" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="-0.5">IN</text>
    <text x="${BRAND_TEXT_X}" y="${BRAND_BASELINE}" text-anchor="end" font-size="22" font-weight="700" fill="${FG}" letter-spacing="0.5">${escapeXml(BRAND_TEXT.toUpperCase())}</text>
  </g>

  <!-- Category eyebrow -->
  <text x="${CONTENT_RIGHT}" y="${CATEGORY_Y}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${CATEGORY_FONT}" font-weight="600" letter-spacing="2" fill="${BRAND}">${escapeXml(category.toUpperCase())}</text>

  <!-- Title (up to 2 lines) -->
  <text x="${CONTENT_RIGHT}" y="${TITLE_START_Y}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${TITLE_FONT}" font-weight="800" fill="${FG}">
    ${titleTspans}
  </text>

  ${
    description
      ? `
  <!-- Description -->
  <text x="${CONTENT_RIGHT}" y="${DESC_START_Y}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${DESC_FONT}" font-weight="400" fill="${MUTED}">
    ${descTspans}
  </text>`
      : ""
  }

  <!-- Footer -->
  <text x="${CONTENT_LEFT}" y="${FOOTER_Y}" text-anchor="start" font-family="${family}, ${fallbackFamily}" font-size="${FOOTER_FONT}" fill="${MUTED}">istanbulnomads.com</text>
  ${tagline ? `<text x="${CONTENT_RIGHT}" y="${FOOTER_Y}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${FOOTER_FONT}" font-weight="600" fill="${BRAND}">${escapeXml(tagline)}</text>` : ""}
</svg>`;
}

export function renderOgImageRtl(props: RtlProps): Response {
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
    // Render at native resolution; resvg's text rasterizer is HarfBuzz-
    // backed so Arabic-script glyphs come out crisp without supersampling.
  });
  const png = resvg.render().asPng();

  // Buffer → ArrayBuffer slice so Response accepts it across both Node and
  // DOM type definitions. The Node runtime serves the bytes verbatim.
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

// Type guard for the dispatcher in og-image.tsx so callers don't have to
// narrow the locale themselves.
export function isRtlOgLocale(
  locale: Locale | undefined,
): locale is "fa" | "ar" {
  return locale === "fa" || locale === "ar";
}
