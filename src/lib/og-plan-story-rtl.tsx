import { Resvg } from "@resvg/resvg-js";
import { ogLogoDataUri } from "@/lib/og-logo";
import { avatarToDataUri } from "@/lib/og-member";
import {
  FONT_FILES,
  resolveFontPath,
  escapeXml,
  splitTitle,
} from "@/lib/og-image-rtl";

// Localized story image (1080x1920) for Arabic-script locales (fa/ar), where
// satori crashes on Arabic shaping. Rendered via resvg-js (HarfBuzz). Mirrors
// the EN satori card: brand header, a bordered card with host avatar + name +
// eyebrow, title, neighbourhood chips, and the numbered stop timeline - just
// right-aligned for RTL. Persian/Arabic chrome shapes correctly; Latin plan
// content (title/stops/times) renders LTR within the RTL layout (HarfBuzz bidi).

const WIDTH = 1080;
const HEIGHT = 1920;
const BRAND = "#c0392b";
const BG_TOP = "#161b26";
const BG_BOTTOM = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";
const CARD_BG = "#141822";
const CARD_BORDER = "rgba(246,243,244,0.12)";
const CHIP_BG = "rgba(246,243,244,0.08)";
const CHIP_BORDER = "rgba(246,243,244,0.16)";

export interface PlanStoryRtlProps {
  locale: "fa" | "ar";
  title: string;
  hostName: string;
  avatarUrl?: string | null;
  dateLabel: string;
  neighborhoods: string[];
  stops: Array<{ name: string; time: string }>;
  shortUrl: string;
  category: string;
  storyCta: string;
  tagline: string;
}

function initialOf(name: string): string {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

function buildSvg(p: PlanStoryRtlProps, avatarDataUri: string | null): string {
  const family = FONT_FILES[p.locale].family;
  const ff = `${family}, Inter, system-ui, sans-serif`;

  const PAD = 72;
  const CARD_X = PAD;
  const CARD_W = WIDTH - PAD * 2;
  const CARD_PAD = 48;
  const RIN = CARD_X + CARD_W - CARD_PAD; // inner right edge (RTL anchor)
  const LIN = CARD_X + CARD_PAD; // inner left edge
  const MID = WIDTH / 2;

  // Brand header (centered, Latin LTR).
  const LOGO = 52;
  const brandTextW = 300; // approx "ISTANBUL NOMADS" @30px
  const groupW = LOGO + 18 + brandTextW;
  const brandX = (WIDTH - groupW) / 2;
  const brandTop = 312;

  // --- Card content laid out top-down with a y cursor ---
  const cardTop = 420;
  let y = cardTop + CARD_PAD;

  // Host row
  const AV_R = 36;
  const avCx = RIN - AV_R;
  const avCy = y + AV_R;
  const nameRight = avCx - AV_R - 20;
  const nameBaseline = y + 30;
  const eyebrowBaseline = y + 66;
  y += AV_R * 2 + 30;

  // Title
  const titleLines = splitTitle(p.title, 22, 3);
  const TITLE_F = 58;
  const TITLE_LH = 68;
  const titleTop = y;
  y += titleLines.length * TITLE_LH + 18;

  // Neighbourhood chips (right-to-left)
  const hoods = p.neighborhoods.slice(0, 4);
  const CHIP_H = 46;
  const chipTop = y;
  let chipCursor = RIN;
  const chipSvg = hoods
    .map((n) => {
      const label = escapeXml(n);
      const w = Math.min(360, n.length * 16 + 44);
      const x = chipCursor - w;
      chipCursor = x - 12;
      return `<rect x="${x}" y="${chipTop}" width="${w}" height="${CHIP_H}" rx="${CHIP_H / 2}" fill="${CHIP_BG}" stroke="${CHIP_BORDER}" />
<text x="${x + w / 2}" y="${chipTop + CHIP_H / 2 + 9}" text-anchor="middle" font-family="${ff}" font-size="24" font-weight="600" fill="${FG}">${label}</text>`;
    })
    .join("\n");
  if (hoods.length) y += CHIP_H + 28;

  // Stops timeline
  const shown = p.stops.slice(0, 4);
  const STOP_H = 58;
  const stopTop = y;
  const stopSvg = shown
    .map((s, i) => {
      const cy = stopTop + i * STOP_H + STOP_H / 2;
      const dotCx = RIN - 22;
      const nameRightX = dotCx - 22 - 16;
      return `<circle cx="${dotCx}" cy="${cy}" r="22" fill="${BRAND}" />
<text x="${dotCx}" y="${cy + 9}" text-anchor="middle" font-family="${ff}" font-size="24" font-weight="800" fill="#06101f">${i + 1}</text>
<text x="${nameRightX}" y="${cy + 10}" text-anchor="end" font-family="${ff}" font-size="30" font-weight="600" fill="${FG}">${escapeXml(s.name)}</text>${
        s.time
          ? `<text x="${LIN}" y="${cy + 10}" text-anchor="start" font-family="${ff}" font-size="26" fill="${MUTED}">${escapeXml(s.time)}</text>`
          : ""
      }`;
    })
    .join("\n");
  y += shown.length * STOP_H;

  const cardBottom = y + CARD_PAD;
  const cardH = cardBottom - cardTop;

  // Link block, below the card.
  const ctaY = cardBottom + 70;
  const PILL_W = 720;
  const PILL_H = 80;
  const pillTop = ctaY + 24;
  const taglineY = pillTop + PILL_H + 48;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="${RIN}" y="${titleTop + TITLE_F * 0.82 + i * TITLE_LH}" text-anchor="end">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const avatar = avatarDataUri
    ? `<clipPath id="avclip"><circle cx="${avCx}" cy="${avCy}" r="${AV_R}" /></clipPath>
<image href="${avatarDataUri}" x="${avCx - AV_R}" y="${avCy - AV_R}" width="${AV_R * 2}" height="${AV_R * 2}" clip-path="url(#avclip)" preserveAspectRatio="xMidYMid slice" />
<circle cx="${avCx}" cy="${avCy}" r="${AV_R}" fill="none" stroke="${CHIP_BORDER}" stroke-width="3" />`
    : `<circle cx="${avCx}" cy="${avCy}" r="${AV_R}" fill="#1a1f2b" stroke="${CHIP_BORDER}" stroke-width="3" />
<text x="${avCx}" y="${avCy + 12}" text-anchor="middle" font-family="${ff}" font-size="34" font-weight="700" fill="${MUTED}">${escapeXml(initialOf(p.hostName))}</text>`;

  const eyebrow = [p.category, p.dateLabel].filter(Boolean).join("  ·  ");

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

  <!-- Brand header (centered, LTR) -->
  <image href="${ogLogoDataUri()}" x="${brandX}" y="${brandTop}" width="${LOGO}" height="${LOGO}" />
  <text x="${brandX + LOGO + 18}" y="${brandTop + LOGO / 2 + 10}" text-anchor="start" direction="ltr" font-family="${ff}" font-size="30" font-weight="700" fill="${FG}" letter-spacing="0.5">${escapeXml("Istanbul Nomads".toUpperCase())}</text>

  <!-- Card -->
  <rect x="${CARD_X}" y="${cardTop}" width="${CARD_W}" height="${cardH}" rx="40" fill="${CARD_BG}" stroke="${CARD_BORDER}" />

  <!-- Host -->
  ${avatar}
  <text x="${nameRight}" y="${nameBaseline}" text-anchor="end" font-family="${ff}" font-size="32" font-weight="700" fill="${FG}">${escapeXml(p.hostName)}</text>
  <text x="${nameRight}" y="${eyebrowBaseline}" text-anchor="end" font-family="${ff}" font-size="22" font-weight="600" letter-spacing="1.2" fill="${BRAND}">${escapeXml(eyebrow.toUpperCase())}</text>

  <!-- Title -->
  <text font-family="${ff}" font-size="${TITLE_F}" font-weight="800" fill="${FG}">${titleTspans}</text>

  <!-- Neighbourhood chips -->
  ${chipSvg}

  <!-- Stops -->
  ${stopSvg}

  <!-- Link block -->
  <text x="${MID}" y="${ctaY}" text-anchor="middle" font-family="${ff}" font-size="28" fill="${MUTED}">${escapeXml(p.storyCta)}</text>
  <rect x="${MID - PILL_W / 2}" y="${pillTop}" width="${PILL_W}" height="${PILL_H}" rx="${PILL_H / 2}" fill="${BRAND}" />
  <text x="${MID}" y="${pillTop + PILL_H / 2 + 14}" text-anchor="middle" direction="ltr" font-family="${ff}" font-size="38" font-weight="800" fill="#ffffff">${escapeXml(p.shortUrl)}</text>
  <text x="${MID}" y="${taglineY}" text-anchor="middle" font-family="${ff}" font-size="24" fill="${MUTED}">${escapeXml(p.tagline)}</text>
</svg>`;
}

export async function renderPlanStoryImageRtl(
  props: PlanStoryRtlProps,
): Promise<Response> {
  const avatarDataUri = await avatarToDataUri(props.avatarUrl);
  const svg = buildSvg(props, avatarDataUri);
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
