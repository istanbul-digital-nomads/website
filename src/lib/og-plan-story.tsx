import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { isRtlOgLocale } from "@/lib/og-image-rtl";
import { renderPlanStoryImageRtl } from "@/lib/og-plan-story-rtl";
import { ogLogoDataUri } from "@/lib/og-logo";
import { avatarToDataUri } from "@/lib/og-member";

// Instagram/TikTok story image (1080x1920, 9:16) - the "share a tweet as an
// image with the link below" pattern. A centered plan card + the short link
// printed beneath it, all inside the story safe zone (clear of the top ~250px
// profile overlay and bottom ~350px reply bar).
//
// satori can't shape Arabic script, so fa/ar (or any Arabic-script title)
// render a Latin-only fallback card rather than crashing.

export const storySize = { width: 1080, height: 1920 } as const;
export const storyContentType = "image/png" as const;

const BRAND = "#c0392b";
const BG = "#0f1117";
const FG = "#f2f3f4";
const MUTED = "#99a3ad";
const CARD_BG = "rgba(20,24,34,0.92)";
const CARD_BORDER = "rgba(246,243,244,0.12)";
const CHIP_BG = "rgba(246,243,244,0.08)";
const CHIP_BORDER = "rgba(246,243,244,0.16)";

export interface PlanStoryStop {
  name: string;
  time: string;
}

export interface PlanStoryProps {
  locale?: Locale;
  title: string;
  hostName: string;
  avatarUrl?: string | null;
  dateLabel: string;
  neighborhoods: string[];
  stops: PlanStoryStop[];
  stopsTotal: number;
  shortUrl: string; // e.g. "istanbulnomads.com/s/ab12cd3"
  category: string;
  storyCta: string;
  moreLabel?: string; // "+N more" already formatted by caller (optional)
  tagline?: string;
}

const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

function initialOf(name: string): string {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

// Shared full-bleed frame for both the full card and the fallback.
function frame(children: ReactNode) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Safe zone: keep content clear of IG's top profile + bottom reply bar.
        padding: "300px 72px 360px",
        backgroundImage: `radial-gradient(1200px 900px at 50% 18%, rgba(192,57,43,0.30) 0%, rgba(192,57,43,0.08) 38%, rgba(15,17,23,0) 64%), linear-gradient(180deg, #161b26 0%, ${BG} 70%)`,
        backgroundColor: BG,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function brandHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        marginBottom: 44,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ogLogoDataUri()}
        width={56}
        height={56}
        alt=""
        style={{ display: "block" }}
      />
      <div
        style={{
          color: FG,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Istanbul Nomads
      </div>
    </div>
  );
}

function linkBlock(shortUrl: string, storyCta: string, tagline: string) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        marginTop: 48,
      }}
    >
      <div style={{ color: MUTED, fontSize: 28, letterSpacing: 1 }}>
        {storyCta}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 38px",
          borderRadius: 9999,
          background: BRAND,
          color: "#fff",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: 0.2,
        }}
      >
        {shortUrl}
      </div>
      <div style={{ color: MUTED, fontSize: 24, marginTop: 6 }}>{tagline}</div>
    </div>
  );
}

export async function renderPlanStoryImage(props: PlanStoryProps) {
  const {
    locale,
    title,
    hostName,
    avatarUrl,
    dateLabel,
    neighborhoods,
    stops,
    stopsTotal,
    shortUrl,
    category,
    storyCta,
    moreLabel,
    tagline = "Remote life, local rhythm",
  } = props;

  // fa/ar: render via resvg-js (HarfBuzz) so the Persian/Arabic chrome shapes
  // correctly - satori can't, and would crash. This is the localized story.
  if (isRtlOgLocale(locale)) {
    return renderPlanStoryImageRtl({
      locale,
      title,
      dateLabel,
      neighborhoods,
      stops,
      shortUrl,
      category,
      storyCta,
      tagline,
    });
  }

  // Non-RTL locale carrying Arabic-script content (rare): satori would still
  // crash on it, so fall back to a Latin-only card.
  const unsafe =
    ARABIC.test(title) ||
    ARABIC.test(dateLabel) ||
    neighborhoods.some((n) => ARABIC.test(n)) ||
    stops.some((s) => ARABIC.test(s.name));

  if (unsafe) {
    // satori can't shape Arabic, so render ONLY Latin-safe text: the title (if
    // it has no Arabic glyphs) or the neighbourhoods, plus the short link.
    // Localized chrome (category / cta / tagline) is skipped here because it's
    // Arabic for fa/ar - using it would crash the renderer (no image at all).
    const headline = !ARABIC.test(title)
      ? title
      : neighborhoods
          .filter((n) => !ARABIC.test(n))
          .slice(0, 3)
          .join(" · ") || "Istanbul";
    return new ImageResponse(
      frame(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {brandHeader()}
          <div
            style={{
              color: BRAND,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            PLAN
          </div>
          <div
            style={{
              color: FG,
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 860,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {headline}
          </div>
          {linkBlock(
            shortUrl,
            "See the full plan",
            "Remote life, local rhythm",
          )}
        </div>,
      ),
      { ...storySize },
    );
  }

  const dataUri = await avatarToDataUri(avatarUrl);
  const AVATAR = 72;
  const shown = stops.slice(0, 4);
  const remaining = stopsTotal - shown.length;

  return new ImageResponse(
    frame(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {brandHeader()}

        {/* Plan card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 28,
            padding: 56,
            borderRadius: 40,
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          }}
        >
          {/* Host */}
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
                  fontSize: 34,
                  fontWeight: 700,
                }}
              >
                {initialOf(hostName)}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ color: FG, fontSize: 32, fontWeight: 700 }}>
                {hostName}
              </div>
              <div
                style={{
                  color: BRAND,
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {[category, dateLabel].filter(Boolean).join("  ·  ")}
              </div>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: FG,
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          {/* Neighborhood chips */}
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

          {/* Stops timeline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginTop: 6,
            }}
          >
            {shown.map((s, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 18 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 9999,
                    background: BRAND,
                    color: "#06101f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    color: FG,
                    fontSize: 30,
                    fontWeight: 600,
                    flex: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.name}
                </div>
                {s.time ? (
                  <div style={{ color: MUTED, fontSize: 24 }}>{s.time}</div>
                ) : null}
              </div>
            ))}
            {remaining > 0 && moreLabel ? (
              <div style={{ color: MUTED, fontSize: 24, paddingLeft: 62 }}>
                {moreLabel}
              </div>
            ) : null}
          </div>
        </div>

        {linkBlock(shortUrl, storyCta, tagline)}
      </div>,
    ),
    { ...storySize },
  );
}
