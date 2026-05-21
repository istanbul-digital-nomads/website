import { Resvg } from "@resvg/resvg-js";
import type { Locale } from "@/lib/i18n/config";
import {
  FONT_FILES,
  resolveFontPath,
  escapeXml,
  splitTitle,
} from "@/lib/og-image-rtl";

// RTL (fa/ar) mirror of the member share card. resvg-js + HarfBuzz shapes
// Arabic-script glyphs that satori can't. Layout is mirrored: avatar circle
// anchored to the RIGHT, identity text right-aligned to its left, brand
// wordmark top-right - matching the locale's reading direction.

const WIDTH = 1200;
const HEIGHT = 630;

const BRAND = "#c0392b";
const BG_TOP = "#141822";
const BG_BOTTOM = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";
const MOSS = "#86efac";
const RING = "rgba(246,243,244,0.16)";

export interface MemberRtlProps {
  displayName: string;
  roleLabel?: string;
  location?: string;
  verifiedLabel?: string;
  avatarDataUri?: string | null;
  category: string;
  tagline?: string;
  locale: "fa" | "ar";
}

export function isRtlOgLocale(
  locale: Locale | undefined,
): locale is "fa" | "ar" {
  return locale === "fa" || locale === "ar";
}

function buildSvg(props: MemberRtlProps): string {
  const {
    displayName,
    roleLabel,
    location,
    verifiedLabel,
    avatarDataUri,
    category,
    tagline,
    locale,
  } = props;
  const family = FONT_FILES[locale].family;
  const fallbackFamily = "Inter, system-ui, sans-serif";

  const PADDING_X = 80;
  const PADDING_Y = 72;
  const CONTENT_RIGHT = WIDTH - PADDING_X;
  const CONTENT_LEFT = PADDING_X;
  const BADGE_SIZE = 40;
  const BADGE_GAP = 16;
  const BRAND_TEXT = "Istanbul Nomads";

  // Avatar anchored right, vertically centered.
  const AVATAR = 300;
  const AVATAR_R = AVATAR / 2;
  const AVATAR_CX = CONTENT_RIGHT - AVATAR_R;
  const AVATAR_CY = HEIGHT / 2 + 10;
  const initial = (displayName || "?").trim().charAt(0).toUpperCase() || "?";

  // Identity text right-anchored to the left of the avatar.
  const TEXT_RIGHT = CONTENT_RIGHT - AVATAR - 56;

  const NAME_FONT = 56;
  const NAME_LH = 64;
  const nameLines = splitTitle(displayName, 14, 2);

  // Build a vertically centered text block.
  const EYEBROW_FONT = 22;
  const META_FONT = 30;
  const LOC_FONT = 28;
  const metaText = [roleLabel, verifiedLabel].filter(Boolean).join("  •  ");

  const nameBlockH = nameLines.length * NAME_LH;
  let totalH = EYEBROW_FONT + 26 + nameBlockH;
  if (metaText) totalH += 22 + META_FONT;
  if (location) totalH += 14 + LOC_FONT;

  let cursor = AVATAR_CY - totalH / 2;
  const eyebrowY = cursor + EYEBROW_FONT;
  cursor = eyebrowY + 26;
  const nameStartY = cursor + NAME_FONT * 0.82;
  cursor += nameBlockH;
  let metaY = 0;
  if (metaText) {
    metaY = cursor + 22 + META_FONT * 0.8;
    cursor += 22 + META_FONT;
  }
  let locY = 0;
  if (location) {
    locY = cursor + 14 + LOC_FONT * 0.8;
  }

  const BRAND_BADGE_X = CONTENT_RIGHT - BADGE_SIZE;
  const BRAND_TEXT_X = CONTENT_RIGHT - BADGE_SIZE - BADGE_GAP;
  const BRAND_BASELINE = PADDING_Y + BADGE_SIZE / 2 + 8;
  const FOOTER_Y = HEIGHT - PADDING_Y;

  const nameTspans = nameLines
    .map(
      (line, i) =>
        `<tspan x="${TEXT_RIGHT}" y="${nameStartY + i * NAME_LH}" text-anchor="end">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const avatarSvg = avatarDataUri
    ? `
  <defs><clipPath id="avclip"><circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR_R}" /></clipPath></defs>
  <image href="${avatarDataUri}" x="${AVATAR_CX - AVATAR_R}" y="${AVATAR_CY - AVATAR_R}" width="${AVATAR}" height="${AVATAR}" clip-path="url(#avclip)" preserveAspectRatio="xMidYMid slice" />
  <circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR_R}" fill="none" stroke="${RING}" stroke-width="4" />`
    : `
  <circle cx="${AVATAR_CX}" cy="${AVATAR_CY}" r="${AVATAR_R}" fill="#1a1f2b" stroke="${RING}" stroke-width="4" />
  <text x="${AVATAR_CX}" y="${AVATAR_CY + 48}" text-anchor="middle" font-family="${family}, ${fallbackFamily}" font-size="140" font-weight="700" fill="${MUTED}">${escapeXml(initial)}</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" direction="rtl">
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

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#canvas)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#corner)" />

  <!-- Brand wordmark (top right in RTL) -->
  <g font-family="${family}, ${fallbackFamily}">
    <rect x="${BRAND_BADGE_X}" y="${PADDING_Y}" width="${BADGE_SIZE}" height="${BADGE_SIZE}" rx="12" fill="${BRAND}" />
    <text x="${BRAND_BADGE_X + BADGE_SIZE / 2}" y="${BRAND_BASELINE}" text-anchor="middle" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="-0.5">IN</text>
    <text x="${BRAND_TEXT_X}" y="${BRAND_BASELINE}" text-anchor="end" font-size="22" font-weight="700" fill="${FG}" letter-spacing="0.5">${escapeXml(BRAND_TEXT.toUpperCase())}</text>
  </g>

  <!-- Avatar -->
  ${avatarSvg}

  <!-- Eyebrow -->
  <text x="${TEXT_RIGHT}" y="${eyebrowY}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${EYEBROW_FONT}" font-weight="600" letter-spacing="2" fill="${BRAND}">${escapeXml(category.toUpperCase())}</text>

  <!-- Name -->
  <text x="${TEXT_RIGHT}" y="${nameStartY}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${NAME_FONT}" font-weight="800" fill="${FG}">
    ${nameTspans}
  </text>

  ${
    metaText
      ? `<text x="${TEXT_RIGHT}" y="${metaY}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${META_FONT}" font-weight="600" fill="${verifiedLabel ? MOSS : FG}">${escapeXml(metaText)}</text>`
      : ""
  }
  ${
    location
      ? `<text x="${TEXT_RIGHT}" y="${locY}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="${LOC_FONT}" font-weight="400" fill="${MUTED}">${escapeXml(location)}</text>`
      : ""
  }

  <!-- Footer -->
  <text x="${CONTENT_LEFT}" y="${FOOTER_Y}" text-anchor="start" font-family="${family}, ${fallbackFamily}" font-size="20" fill="${MUTED}">istanbulnomads.com</text>
  ${tagline ? `<text x="${CONTENT_RIGHT}" y="${FOOTER_Y}" text-anchor="end" font-family="${family}, ${fallbackFamily}" font-size="20" font-weight="600" fill="${BRAND}">${escapeXml(tagline)}</text>` : ""}
</svg>`;
}

export function renderMemberOgImageRtl(props: MemberRtlProps): Response {
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
