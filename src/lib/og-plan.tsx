import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n/config";
import { ogSize } from "@/lib/og-image";
import { isRtlOgLocale } from "@/lib/og-image-rtl";
import { renderPlanOgImageRtl } from "@/lib/og-plan-rtl";
import { ogLogoDataUri } from "@/lib/og-logo";
import { avatarToDataUri } from "@/lib/og-member";

// Plan share card (1200x630) for link previews on X/FB/WhatsApp/Slack/iMessage.
// Leads with the host avatar + plan title, then date, neighborhoods, and a
// stops/going meta line. satori can't shape Arabic, so fa/ar render the same
// card via resvg-js (og-plan-rtl.tsx) - host avatar + name included, RTL.

const BRAND = "#c0392b";
const BG = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";
const CHIP_BG = "rgba(246,243,244,0.08)";
const CHIP_BORDER = "rgba(246,243,244,0.16)";

export interface PlanOgProps {
  locale?: Locale;
  title: string;
  hostName: string;
  avatarUrl?: string | null;
  dateLabel: string;
  neighborhoods: string[];
  stopsLabel: string;
  goingLabel: string;
  category: string;
  tagline?: string;
}

function initialOf(name: string): string {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

export async function renderPlanOgImage(props: PlanOgProps) {
  const {
    locale,
    title,
    hostName,
    avatarUrl,
    dateLabel,
    neighborhoods,
    stopsLabel,
    goingLabel,
    category,
  } = props;

  // satori can't shape Arabic-script glyphs - hand fa/ar to the resvg RTL card,
  // which mirrors this layout (host avatar + name + footer) right-aligned.
  if (isRtlOgLocale(locale)) {
    return await renderPlanOgImageRtl({
      locale,
      title,
      hostName,
      avatarUrl,
      dateLabel,
      neighborhoods,
      stopsLabel,
      goingLabel,
      category,
    });
  }

  const dataUri = await avatarToDataUri(avatarUrl);
  const AVATAR = 84;
  const eyebrow = [category, dateLabel].filter(Boolean).join("  ·  ");

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
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
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            color: BRAND,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            color: FG,
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </div>

        {/* Host + neighborhoods */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {dataUri ? (
            // eslint-disable-next-line @next/next/no-img-element
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
                border: `3px solid ${CHIP_BORDER}`,
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
                border: `3px solid ${CHIP_BORDER}`,
                color: MUTED,
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              {initialOf(hostName)}
            </div>
          )}
          <div style={{ color: FG, fontSize: 30, fontWeight: 600 }}>
            {hostName}
          </div>
        </div>

        {neighborhoods.length > 0 ? (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {neighborhoods.slice(0, 4).map((n) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  borderRadius: 9999,
                  background: CHIP_BG,
                  border: `1px solid ${CHIP_BORDER}`,
                  color: FG,
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                {n}
              </div>
            ))}
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
          fontSize: 22,
        }}
      >
        <div style={{ color: BRAND, fontWeight: 600 }}>
          {[stopsLabel, goingLabel].filter(Boolean).join("  ·  ")}
        </div>
        <div>istanbulnomads.com</div>
      </div>
    </div>,
    { ...ogSize },
  );
}
