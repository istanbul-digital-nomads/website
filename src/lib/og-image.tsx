import { ImageResponse } from "next/og";

// Shared size/contentType for every route's opengraph-image.tsx.
export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png" as const;

interface OgImageProps {
  category: string; // small uppercase label, e.g. "Blog", "Path to Istanbul"
  title: string; // large headline
  description?: string; // truncated subtitle (optional)
}

// Renders a branded OpenGraph card inspired by the Claude Code Docs style:
// dark canvas, brand wordmark top-left, category label, large title, muted description.
export function renderOgImage({ category, title, description }: OgImageProps) {
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
        background: BG,
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Accent blob - satori doesn't support radial-gradient, so fake it
            with a blurred colored circle in the top-left corner. */}
      <div
        style={{
          position: "absolute",
          top: -220,
          left: -220,
          width: 700,
          height: 700,
          borderRadius: 9999,
          background: BRAND,
          opacity: 0.22,
          filter: "blur(120px)",
          display: "flex",
        }}
      />
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
        <div style={{ color: BRAND, fontWeight: 600 }}>
          Remote life, local rhythm
        </div>
      </div>
    </div>,
    { ...ogSize },
  );
}
