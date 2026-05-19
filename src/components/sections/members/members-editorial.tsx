import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MemberPublic } from "@/types/models";

// Hue rotation for the avatar gradient fallback. Stable per-name so the
// same person always gets the same color.
const HUES = [
  "#f4b860", // gold
  "#e87a5d", // rose
  "#a78bfa", // violet
  "#7dd3fc", // sky
  "#86efac", // mint
  "#fde68a", // pale gold
  "#fb923c", // orange
];

function hueFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return HUES[h % HUES.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Group members by location (the "hood" in the design). Members without
// a location fall into a single "Elsewhere" bucket so the directory
// reads cleanly.
function groupByHood(members: MemberPublic[]) {
  const by: Record<string, MemberPublic[]> = {};
  for (const m of members) {
    const hood = (m.location ?? "").trim() || "Elsewhere";
    (by[hood] ||= []).push(m);
  }
  return by;
}

function AvatarCircle({
  member,
  size = 40,
}: {
  member: MemberPublic;
  size?: number;
}) {
  const hue = hueFor(member.display_name ?? "?");
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${hue}, ${hue}80)`,
        boxShadow: "0 4px 14px rgba(6, 16, 31, 0.4)",
      }}
    >
      {member.avatar_url ? (
        <Image
          src={member.avatar_url}
          alt={member.display_name ?? ""}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span
          className="font-editorial italic text-deep-water"
          style={{ fontSize: size * 0.42, letterSpacing: "-0.02em" }}
        >
          {initials(member.display_name ?? "?")}
        </span>
      )}
    </span>
  );
}

function MemberTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full border px-2 py-0.5 font-grotesk text-[11px] text-cream/70"
      style={{
        borderColor: "rgba(244, 184, 96, 0.22)",
        background: "rgba(244, 184, 96, 0.05)",
      }}
    >
      {children}
    </span>
  );
}

type Props = {
  locale: string;
  members: MemberPublic[];
  hoodOrder?: string[];
};

export function MembersEditorial({ locale, members, hoodOrder }: Props) {
  const t = useTranslations("membersV2");

  const byHood = groupByHood(members);
  // Order: preferred hoods first (in the order given), then any other hoods
  // present in the data sorted by count, with "Elsewhere" always last.
  const preferred = (hoodOrder ?? []).filter((h) => byHood[h]?.length);
  const extras = Object.keys(byHood)
    .filter((h) => h !== "Elsewhere" && !preferred.includes(h))
    .sort((a, b) => byHood[b].length - byHood[a].length);
  const orderedHoods = [
    ...preferred,
    ...extras,
    ...(byHood["Elsewhere"]?.length ? ["Elsewhere"] : []),
  ];

  // Sidebar: most-recently-joined (proxy for "fresh activity"). Caps at 6.
  // We don't have an "open to coffee" boolean yet, so the sidebar honestly
  // shows what we do have: who joined most recently.
  const recent = [...members].slice().reverse().slice(0, 6);

  const totalPublic = members.length;
  const totalHoods = orderedHoods.length;

  return (
    <section className="relative overflow-hidden bg-deep-water font-grotesk text-cream">
      {/* Subtle map-grid bg matching the hero's water feel. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(1200px 600px at 90% 0%, rgba(244,184,96,0.06), transparent 60%),
            radial-gradient(800px 500px at 0% 100%, rgba(232,122,93,0.05), transparent 60%),
            linear-gradient(180deg, #06101f, #0a1a2f 60%, #06101f)
          `,
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pt-16 md:px-10 md:pt-24">
        {/* Header: live pip + editorial headline + lede + counts strip */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-14">
          <div>
            <span
              className="hero-live-pip inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{
                borderColor: "rgba(134,239,172,0.35)",
                background: "rgba(134,239,172,0.10)",
                color: "rgb(134,239,172)",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-moss"
                style={{ boxShadow: "0 0 8px rgb(134, 239, 172)" }}
              />
              {t("livePip", { count: totalPublic })}
            </span>
            <h1
              className="font-editorial text-cream"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                margin: "1.5rem 0 0",
                fontWeight: 400,
                maxWidth: 780,
              }}
            >
              {t("headlineA")}{" "}
              <em className="italic text-gold">{t("headlineB")}</em>,
              <br />
              {t("headlineC")}
            </h1>
          </div>
          <div className="md:pb-3">
            <p className="max-w-[460px] text-[15px] leading-[1.6] text-cream/70">
              {t("lede")}
            </p>
            <div className="mt-6 flex gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/55">
              <span>
                <span className="text-gold">{totalPublic}</span>{" "}
                {t("publicLabel")}
              </span>
              <span>
                <span className="text-gold">{totalHoods}</span>{" "}
                {t("hoodsLabel")}
              </span>
            </div>
          </div>
        </div>

        {/* Main split: recent sidebar + grouped-by-hood right column */}
        <div className="mt-14 grid grid-cols-1 gap-12 pb-24 md:grid-cols-[340px_1fr] md:gap-11">
          {/* LEFT — recently joined */}
          <aside>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/55">
              {t("recentEyebrow")}
            </div>
            <p className="mt-3.5 text-[13px] leading-[1.55] text-cream/70">
              {t("recentLede")}
            </p>
            <div
              className="mt-5 overflow-hidden rounded-xl border"
              style={{
                background: "#0a1a2f",
                borderColor: "rgba(246,236,217,0.10)",
              }}
            >
              {recent.map((m, i) => (
                <Link
                  key={m.id}
                  href={`/members/${m.id}`}
                  className="grid grid-cols-[40px_1fr_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gold/[0.05]"
                  style={{
                    borderTop:
                      i === 0 ? "none" : "0.5px solid rgba(246,236,217,0.06)",
                  }}
                >
                  <AvatarCircle member={m} size={36} />
                  <div className="min-w-0">
                    <div className="truncate font-editorial text-[17px] leading-tight text-cream">
                      {m.display_name}
                    </div>
                    <div className="mt-1 truncate text-[11px] tracking-[0.04em] text-cream/55">
                      {m.location || t("noLocation")}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-gold" />
                </Link>
              ))}
            </div>

            <div
              className="mt-5 rounded-xl border border-dashed px-4 py-3.5"
              style={{ borderColor: "rgba(244,184,96,0.22)" }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/55">
                {t("howEyebrow")}
              </div>
              <p className="mt-2 text-[12.5px] leading-[1.55] text-cream/70">
                {t("howBody")}
              </p>
            </div>
          </aside>

          {/* RIGHT — by neighborhood */}
          <div className="flex flex-col gap-12">
            {orderedHoods.map((hood, hi) => (
              <div key={hood}>
                <div
                  className="flex items-baseline justify-between pb-3.5"
                  style={{ borderBottom: "0.5px solid rgba(246,236,217,0.10)" }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                      {String(hi + 1).padStart(2, "0")}
                    </span>
                    <h2
                      className="font-editorial text-cream"
                      style={{
                        fontSize: "clamp(1.75rem, 3.5vw, 2.375rem)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1,
                        margin: 0,
                        fontWeight: 400,
                      }}
                    >
                      {hood === "Elsewhere" ? t("elsewhereLabel") : hood}
                    </h2>
                    <span className="text-[11px] tracking-[0.06em] text-cream/40">
                      {byHood[hood].length === 1
                        ? t("singlePerson")
                        : t("personCount", { count: byHood[hood].length })}
                    </span>
                  </div>
                </div>

                <div>
                  {byHood[hood].map((m) => {
                    const tags = (m.skills ?? []).slice(0, 2);
                    return (
                      <Link
                        key={m.id}
                        href={`/members/${m.id}`}
                        className="grid items-center gap-4 px-1 py-4 transition-colors hover:bg-gold/[0.03]"
                        style={{
                          gridTemplateColumns: "48px 1.4fr 1.2fr 1fr 24px",
                          borderBottom: "0.5px solid rgba(246,236,217,0.06)",
                        }}
                      >
                        <AvatarCircle member={m} size={40} />
                        <div className="min-w-0">
                          <div className="truncate font-editorial text-[19px] leading-tight tracking-tight text-cream">
                            {m.display_name}
                          </div>
                          {m.bio && (
                            <div className="mt-1 line-clamp-1 text-[12px] text-cream/55">
                              {m.bio}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((t) => (
                            <MemberTag key={t}>{t}</MemberTag>
                          ))}
                        </div>
                        <div className="text-[11px] tracking-[0.04em] text-cream/40">
                          {m.location && (
                            <div className="truncate">{m.location}</div>
                          )}
                          {m.telegram_handle && (
                            <div className="mt-1 truncate text-cream/55">
                              @{m.telegram_handle.replace(/^@/, "")}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 justify-self-end text-gold" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {orderedHoods.length === 0 && (
              <div
                className="rounded-xl border px-6 py-12"
                style={{
                  borderColor: "rgba(246,236,217,0.10)",
                  background: "#0a1a2f",
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  {t("emptyEyebrow")}
                </p>
                <p className="mt-3 max-w-xl font-editorial text-h3 text-cream">
                  {t("emptyTitle")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div
          className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-20"
          style={{
            borderTop: "0.5px solid rgba(246,236,217,0.10)",
            borderBottom: "0.5px solid rgba(246,236,217,0.10)",
          }}
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/55">
              {t("ctaEyebrow")}
            </div>
            <h2
              className="font-editorial text-cream"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.02,
                margin: "1rem 0 0",
                fontWeight: 400,
              }}
            >
              {t("ctaHeadlineA")}
              <br />
              <em className="italic text-gold">{t("ctaHeadlineB")}</em>
            </h2>
          </div>
          <div>
            <p className="max-w-[520px] text-[15px] leading-[1.6] text-cream/70">
              {t("ctaLede")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep-water transition-colors hover:bg-gold/90"
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-cream/25 px-5 py-3 text-sm font-medium text-cream/85 hover:border-cream/50 hover:text-cream"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
