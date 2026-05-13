import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n/config";

// Shared size/contentType for every route's opengraph-image.tsx.
export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png" as const;

// `@vercel/og` (the satori-based renderer behind ImageResponse) crashes on
// Arabic-script glyphs with "lookupType: 5 - substFormat: 3 is not yet
// supported". The crash happens inside satori's GSUB lookup parser
// regardless of which Arabic font (Vazirmatn, Noto Sans Arabic, Amiri) is
// loaded, because all modern Arabic-script fonts rely on Contextual
// Substitution Format 3 for shaping. Tracked at vercel/satori issue 523.
//
// Workaround: fall back to English content for fa/ar OG renders so the
// route returns a valid PNG instead of a 500. When satori adds support,
// remove this and pass the real locale through.
export function ogLocale(locale: Locale): Locale {
  return locale === "fa" || locale === "ar" ? "en" : locale;
}

interface OgImageProps {
  category: string; // small uppercase label, e.g. "Blog", "Path to Istanbul"
  title: string; // large headline
  description?: string; // truncated subtitle (optional)
  tagline?: string; // localized footer tagline, defaults to English brand line
  locale?: Locale; // reserved for future font wiring; currently unused
}

// Renders a branded OpenGraph card inspired by the Claude Code Docs style:
// dark canvas, brand wordmark top-left, category label, large title, muted description.
export function renderOgImage({
  category,
  title,
  description,
  tagline = "Remote life, local rhythm",
}: OgImageProps) {
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
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: BRAND,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          IN
        </div>
        <div
          style={{
            color: FG,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Istanbul Digital Nomads
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
