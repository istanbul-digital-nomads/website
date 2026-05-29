import { Resvg } from "@resvg/resvg-js";
import { ogLogoDataUri } from "@/lib/og-logo";
import { avatarToDataUri } from "@/lib/og-member";
import {
  FONT_FILES,
  resolveFontPath,
  escapeXml,
  splitTitle,
} from "@/lib/og-image-rtl";

// Localized plan share card (1200x630) for Arabic-script locales (fa/ar), where
// satori crashes on Arabic shaping. Rendered via resvg-js (HarfBuzz). Mirrors
// the EN satori card (og-plan.tsx): brand wordmark, eyebrow (category · date),
// title, host avatar + name, neighbourhood chips, and the stops/going footer -
// just right-aligned for RTL. Persian/Arabic chrome shapes correctly; Latin
// plan content (title/host/chips) renders LTR within the RTL layout.

const WIDTH = 1200;
const HEIGHT = 630;
const BRAND = "#c0392b";
const BG_TOP = "#141822";
const BG_BOTTOM = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";
const CHIP_BG = "rgba(246,243,244,0.08)";
const CHIP_BORDER = "rgba(246,243,244,0.16)";

export interface PlanOgRtlProps {
  locale: "fa" | "ar";
  title: string;
  hostName: string;
  avatarUrl?: string | null;
  dateLabel: string;
  neighborhoods: string[];
  stopsLabel: string;
  goingLabel: string;
  category: string;
}

function initialOf(name: string): string {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

function buildSvg(p: PlanOgRtlProps, avatarDataUri: string | null): string {
  const family = FONT_FILES[p.locale].family;
  const ff = `${family}, Inter, system-ui, sans-serif`;

  const PAD_X = 80;
  const PAD_Y = 56;
  const RIN = WIDTH - PAD_X; // right edge (RTL anchor)
  const LIN = PAD_X; // left edge

  // Brand wordmark (top-right for RTL, Latin LTR).
  const LOGO = 48;
  const logoX = RIN - LOGO;
  const logoY = PAD_Y;
  const brandBaseline = logoY + LOGO / 2 + 8;

  // --- Content laid out top-down with a y cursor ---
  let y = 178;

  // Eyebrow (category · date)
  const eyebrow = [p.category, p.dateLabel].filter(Boolean).join("  ·  ");
  const eyebrowY = y + 22;
  y += 44;

  // Title (up to 2 lines)
  const titleLines = splitTitle(p.title, 26, 2);
  const TITLE_F = 60;
  const TITLE_LH = 70;
  const titleTop = y;
  y += titleLines.length * TITLE_LH + 24;

  // Host row (avatar on the right, name to its left)
  const AV_R = 42;
  const avCx = RIN - AV_R;
  const avCy = y + AV_R;
  const nameRight = avCx - AV_R - 20;
  const nameBaseline = avCy + 11;
  y += AV_R * 2 + 26;

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
<text x="${avCx}" y="${avCy + 14}" text-anchor="middle" font-family="${ff}" font-size="40" font-weight="700" fill="${MUTED}">${escapeXml(initialOf(p.hostName))}</text>`;

  // Footer (stops · going on the right, domain on the left, LTR)
  const footerY = HEIGHT - PAD_Y;
  const footerMeta = [p.stopsLabel, p.goingLabel].filter(Boolean).join("  ·  ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" direction="rtl">
  <defs>
    <linearGradient id="canvas" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${BG_TOP}" />
      <stop offset="100%" stop-color="${BG_BOTTOM}" />
    </linearGradient>
    <radialGradient id="glow" cx="88%" cy="6%" r="70%">
      <stop offset="0%" stop-color="rgba(192,57,43,0.35)" />
      <stop offset="35%" stop-color="rgba(192,57,43,0.10)" />
      <stop offset="60%" stop-color="rgba(15,17,23,0)" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#canvas)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  <!-- Brand wordmark (top-right, LTR) -->
  <image href="${ogLogoDataUri()}" x="${logoX}" y="${logoY}" width="${LOGO}" height="${LOGO}" />
  <text x="${logoX - 16}" y="${brandBaseline}" text-anchor="end" direction="ltr" font-family="${ff}" font-size="24" font-weight="700" fill="${FG}" letter-spacing="0.5">${escapeXml("Istanbul Nomads".toUpperCase())}</text>

  <!-- Eyebrow -->
  <text x="${RIN}" y="${eyebrowY}" text-anchor="end" font-family="${ff}" font-size="24" font-weight="600" letter-spacing="1.5" fill="${BRAND}">${escapeXml(eyebrow.toUpperCase())}</text>

  <!-- Title -->
  <text font-family="${ff}" font-size="${TITLE_F}" font-weight="800" fill="${FG}">${titleTspans}</text>

  <!-- Host -->
  ${avatar}
  <text x="${nameRight}" y="${nameBaseline}" text-anchor="end" font-family="${ff}" font-size="30" font-weight="600" fill="${FG}">${escapeXml(p.hostName)}</text>

  <!-- Neighbourhood chips -->
  ${chipSvg}

  <!-- Footer -->
  <text x="${RIN}" y="${footerY}" text-anchor="end" font-family="${ff}" font-size="22" font-weight="600" fill="${BRAND}">${escapeXml(footerMeta)}</text>
  <text x="${LIN}" y="${footerY}" text-anchor="start" direction="ltr" font-family="${ff}" font-size="22" fill="${MUTED}">istanbulnomads.com</text>
</svg>`;
}

export async function renderPlanOgImageRtl(
  props: PlanOgRtlProps,
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
