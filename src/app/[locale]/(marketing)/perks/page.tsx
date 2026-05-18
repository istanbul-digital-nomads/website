import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getPerksPublic } from "@/lib/supabase/queries";
import { socialLinks } from "@/lib/constants";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Tag } from "@/components/ui/tag";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "perksV2" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/perks"),
  };
}

export default async function PerksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getCachedTranslations(locale, "perksV2");
  const { data: perks } = await getPerksPublic();

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} kicker={t("kicker")} />
        <h1 className="mt-8 max-w-3xl font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
          {t("lede")}
        </p>

        <div className="mt-14 pb-24">
          {perks.length > 0 ? (
            <div className="grid gap-px border border-ink-4 bg-ink-4 sm:grid-cols-2 lg:grid-cols-3">
              {perks.map((perk) => (
                <div key={perk.id} className="flex flex-col bg-ink-2 p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-h4 text-paper">
                      {perk.brand}
                    </span>
                    <Tag>{perk.kind}</Tag>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-paper-dim">
                    {perk.offer}
                  </p>
                  {perk.cap || perk.city ? (
                    <p className="mt-4 border-t border-ink-3 pt-3 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                      {[perk.cap, perk.city].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-ink-3 bg-ink-2 px-7 py-12">
              <p className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                {t("emptyEyebrow")}
              </p>
              <p className="mt-4 max-w-2xl font-display text-h3 leading-snug text-paper">
                {t("emptyTitle")}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-paper-dim">
                {t("emptyBody")}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-terracotta px-6 py-3.5 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
                >
                  {t("joinTelegram")}{" "}
                  <span className="inline-dir-arrow" aria-hidden />
                </a>
                <Link
                  href="/circles"
                  className="border border-ink-4 px-6 py-3.5 text-sm text-paper transition-colors duration-fast hover:border-ink-5"
                >
                  {t("seeCircles")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
