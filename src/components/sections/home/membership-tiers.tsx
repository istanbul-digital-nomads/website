import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { getMemberCount } from "@/lib/ambient";
import { socialLinks } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * Design System v2 - "Two ways to belong". The Free tier is real today
 * (the Telegram community); the Nomad+ tier is marked "Coming soon"
 * because Stripe + the perks vault haven't been wired up yet. No
 * fabricated price is shown - the CTA points at the Telegram waitlist.
 */
export async function MembershipTiers({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.membership");
  const memberCount = await getMemberCount();
  const memberCountLabel =
    memberCount !== null
      ? memberCount.toLocaleString("en-US") + " " + t("members")
      : null;

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <Container>
        <SectionEyebrow num="N° 07" label={t("eyebrow")} />

        <div className="mt-12 grid border border-ink-3 lg:grid-cols-[1fr_1.4fr_1.4fr]">
          {/* Statement */}
          <div className="border-b border-ink-3 p-10 lg:border-b-0 lg:border-e">
            <h2 className="font-display text-h2 leading-tight text-paper">
              {t("title")}{" "}
              <span className="italic text-terracotta">{t("titleItalic")}</span>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-paper-dim">
              {t("body")}
            </p>
            <ul className="mt-8 space-y-2 font-mono text-[10.5px] uppercase tracking-wider text-paper-faint">
              <li>{t("rule1")}</li>
              <li>{t("rule2")}</li>
              <li>{t("rule3")}</li>
            </ul>
          </div>

          {/* Free tier */}
          <div className="flex flex-col border-b border-ink-3 p-10 lg:border-b-0 lg:border-e">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-h2 text-paper">
                {t("free.title")}
              </h3>
              {memberCountLabel ? (
                <span
                  className="font-mono text-[10.5px] uppercase tracking-wider text-paper-faint"
                  dir="ltr"
                >
                  {memberCountLabel}
                </span>
              ) : null}
            </div>
            <p
              className="mt-3 font-mono text-3xl tabular-nums text-paper"
              dir="ltr"
            >
              ₺0
            </p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-paper-mute">
              {t("free.priceLabel")}
            </p>
            <ul className="mt-8 flex-1 space-y-3 text-sm leading-relaxed text-paper-dim">
              {(["b1", "b2", "b3", "b4", "b5"] as const).map((key) => (
                <li key={key} className="flex gap-3">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-moss" />
                  {t(`free.bullets.${key}`)}
                </li>
              ))}
            </ul>
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-1.5 self-start border border-ink-4 px-5 py-3 text-sm text-paper transition-colors duration-fast hover:border-ink-5"
            >
              {t("free.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </a>
          </div>

          {/* Nomad+ tier - coming soon */}
          <div className="relative flex flex-col bg-terracotta/[0.05] p-10">
            <span className="absolute inset-x-0 top-0 h-0.5 bg-terracotta" />
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-h2 text-paper">
                Nomad<span className="text-terracotta">+</span>
              </h3>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-terracotta">
                {t("plus.tag")}
              </span>
            </div>
            <p className="mt-3 font-mono text-3xl tabular-nums text-paper-mute">
              {t("plus.priceTbd")}
            </p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-paper-mute">
              {t("plus.priceLabel")}
            </p>
            <ul className="mt-8 flex-1 space-y-3 text-sm leading-relaxed text-paper">
              {(["b1", "b2", "b3", "b4", "b5", "b6"] as const).map((key) => (
                <li key={key} className="flex gap-3">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                  {t(`plus.bullets.${key}`)}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 bg-terracotta px-5 py-3 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
              >
                {t("plus.waitlistCta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </a>
              <Link
                href="/perks"
                className="border border-ink-4 px-5 py-3 text-sm text-paper transition-colors duration-fast hover:border-ink-5"
              >
                {t("plus.previewCta")}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
