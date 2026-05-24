import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n/config";
import { ogSize } from "@/lib/og-image";
import { ogLogoDataUri } from "@/lib/og-logo";
import { isRtlOgLocale, renderMemberOgImageRtl } from "@/lib/og-member-rtl";

// Member share card. Distinct from the generic text card in og-image.tsx:
// this one leads with the member's avatar + name, then role / verification /
// location. fa/ar dispatch to the resvg-js renderer (satori can't shape
// Arabic script) - see og-member-rtl.tsx for the mirrored layout.

const BRAND = "#c0392b";
const BG = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";
const CHIP_BG = "rgba(246,243,244,0.08)";
const CHIP_BORDER = "rgba(246,243,244,0.16)";

export interface MemberOgProps {
  displayName: string;
  roleLabel?: string; // localized member-type label, omitted when unset
  location?: string;
  verifiedLabel?: string; // localized verification label, only when verified/trusted
  avatarUrl?: string | null;
  category: string; // small eyebrow, e.g. "Member"
  tagline?: string;
  locale?: Locale;
}

// satori needs raster bytes inlined - a bare remote <img src> is unreliable
// at render time. Fetch the avatar and return a data URI. Any failure (404,
// non-image, webp that won't decode) returns null so the card draws initials.
export async function avatarToDataUri(
  url: string | null | undefined,
): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    // satori/resvg decode png + jpeg reliably; webp/avif may not.
    if (!/png|jpe?g/i.test(contentType)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function initialOf(name: string): string {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

export async function renderMemberOgImage(props: MemberOgProps) {
  const {
    displayName,
    roleLabel,
    location,
    verifiedLabel,
    avatarUrl,
    category,
    tagline = "Remote life, local rhythm",
    locale,
  } = props;

  const dataUri = await avatarToDataUri(avatarUrl);

  // Arabic-script locales -> resvg-js renderer (handles shaping + RTL mirror).
  if (isRtlOgLocale(locale)) {
    return renderMemberOgImageRtl({
      displayName,
      roleLabel,
      location,
      verifiedLabel,
      avatarDataUri: dataUri,
      category,
      tagline,
      locale,
    });
  }

  const AVATAR = 300;

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

      {/* Main row: avatar + identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        {dataUri ? (
          // eslint-disable-next-line @next/next/no-img-element -- satori (next/og) renders raw <img>; next/image is unsupported here
          <img
            src={dataUri}
            alt=""
            width={AVATAR}
            height={AVATAR}
            style={{
              width: AVATAR,
              height: AVATAR,
              borderRadius: 9999,
              objectFit: "cover",
              border: `4px solid ${CHIP_BORDER}`,
            }}
          />
        ) : (
          <div
            style={{
              width: AVATAR,
              height: AVATAR,
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#1a1f2b",
              border: `4px solid ${CHIP_BORDER}`,
              color: MUTED,
              fontSize: 140,
              fontWeight: 700,
            }}
          >
            {initialOf(displayName)}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            flex: 1,
          }}
        >
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
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {displayName}
          </div>
          {/* Chips: role + verification */}
          {roleLabel || verifiedLabel ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {roleLabel ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 18px",
                    borderRadius: 9999,
                    background: CHIP_BG,
                    border: `1px solid ${CHIP_BORDER}`,
                    color: FG,
                    fontSize: 24,
                    fontWeight: 600,
                  }}
                >
                  {roleLabel}
                </div>
              ) : null}
              {verifiedLabel ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 18px",
                    borderRadius: 9999,
                    background: "rgba(134,239,172,0.12)",
                    border: "1px solid rgba(134,239,172,0.3)",
                    color: "#86efac",
                    fontSize: 24,
                    fontWeight: 600,
                  }}
                >
                  {verifiedLabel}
                </div>
              ) : null}
            </div>
          ) : null}
          {location ? (
            <div style={{ color: MUTED, fontSize: 28 }}>{location}</div>
          ) : null}
        </div>
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
