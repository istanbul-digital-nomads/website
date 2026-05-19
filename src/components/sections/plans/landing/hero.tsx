import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { socialLinks } from "@/lib/constants";
import { ArrowRight, Plus } from "lucide-react";
import { PlansTodayCounter } from "../plans-today-counter";

export async function PlansLandingHero({ isAuthed }: { isAuthed: boolean }) {
  const t = await getTranslations("plans.landing");

  return (
    <section className="relative overflow-hidden bg-deep-water font-grotesk text-cream">
      {/* Subtle map-grid bg matching the cinematic hero's water feel. */}
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

      <div className="relative mx-auto max-w-[1320px] px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
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
              {t("eyebrowLabel")}
            </span>

            <h1
              className="font-editorial text-cream"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                margin: "1.5rem 0 0",
                fontWeight: 400,
                maxWidth: 820,
              }}
            >
              {t("headline")}
            </h1>

            <p className="mt-7 max-w-[520px] text-[15.5px] leading-[1.6] text-cream/70">
              {t("lede")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {isAuthed ? (
                <Link
                  href="/plans/new"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep-water transition-colors hover:bg-gold/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("ctaShare")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <Link
                  href="/login?next=/plans"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep-water transition-colors hover:bg-gold/90"
                >
                  {t("ctaSignIn")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-cream/25 px-5 py-3 text-sm font-medium text-cream/85 transition-colors hover:border-cream/50 hover:text-cream"
              >
                {t("ctaTelegram")}
              </a>
            </div>
          </div>

          <div className="md:pb-1">
            <PlansTodayCounter />
          </div>
        </div>
      </div>
    </section>
  );
}
