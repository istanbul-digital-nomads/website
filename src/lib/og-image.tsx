import { ImageResponse } from "next/og";
import { ogLogoDataUri } from "@/lib/og-logo";
import type { Locale } from "@/lib/i18n/config";
import { isRtlOgLocale, renderOgImageRtl } from "@/lib/og-image-rtl";

// Shared size/contentType for every route's opengraph-image.tsx.
export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png" as const;

// Why two renderers:
// - `@vercel/og` (satori) crashes on Arabic-script glyphs with
//   "lookupType: 5 - substFormat: 3 is not yet supported"
//   (vercel/satori#74 - RTL languages are not on the roadmap as of 2026).
// - resvg-js + HarfBuzz handles Arabic shaping correctly.
// So fa/ar routes go through resvg-js (Node runtime); everything else
// continues to use satori. The visual design is replicated in
// og-image-rtl.tsx so brand parity holds across locales.

interface OgImageProps {
  category: string; // small uppercase label, e.g. "Blog", "Path to Istanbul"
  title: string; // large headline
  description?: string; // truncated subtitle (optional)
  tagline?: string; // localized footer tagline, defaults to English brand line
  locale?: Locale; // when fa/ar, dispatches to the resvg-js renderer
}

// Renders a branded OpenGraph card inspired by the Claude Code Docs style:
// dark canvas, brand wordmark top-left, category label, large title, muted description.
export function renderOgImage({
  category,
  title,
  description,
  tagline = "Remote life, local rhythm",
  locale,
}: OgImageProps) {
  // Dispatch Arabic-script locales to the resvg-js renderer (which can
  // actually shape Arabic glyphs). LTR locales continue with satori.
  if (isRtlOgLocale(locale)) {
    return renderOgImageRtl({
      category,
      title,
      description,
      tagline,
      locale,
    });
  }

  const BRAND = "#c0392b";
  const BG = "#0f1117";
  const FG = "#f2f3f4";
  const MUTED = "#99a3ad";

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        // Two stacked linear-gradients give a smooth corner glow without
        // satori's low-res blur rasterization. Top layer fades the brand red
        // from the top-left corner; bottom layer is the dark canvas.
        backgroundImage: `linear-gradient(135deg, rgba(192,57,43,0.35) 0%, rgba(192,57,43,0.10) 35%, rgba(15,17,23,0) 60%), linear-gradient(180deg, #141822 0%, ${BG} 100%)`,
        backgroundColor: BG,
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Brand wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogLogoDataUri()}
          width={48}
          height={48}
          alt=""
          style={{ display: "block" }}
        />
        <div
          style={{
            color: FG,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Istanbul Nomads
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            color: BRAND,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {category}
        </div>
        <div
          style={{
            color: FG,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            // Hard-clamp long titles to keep card readable.
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              color: MUTED,
              fontSize: 28,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: MUTED,
          fontSize: 20,
        }}
      >
        <div>istanbulnomads.com</div>
        <div style={{ color: BRAND, fontWeight: 600 }}>{tagline}</div>
      </div>
    </div>,
    { ...ogSize },
  );
}
