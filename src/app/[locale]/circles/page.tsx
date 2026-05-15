import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { circles, type CircleAccent } from "@/lib/circles";
import { socialLinks } from "@/lib/constants";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

// Static accent -> Tailwind class maps so the content scanner sees literals.
export const ACCENT_RING: Record<CircleAccent, string> = {
  terracotta: "border-terracotta",
  bosphorus: "border-bosphorus",
  "ferry-yellow": "border-ferry-yellow",
  moss: "border-moss",
  "terracotta-dim": "border-terracotta-dim",
  "bosphorus-dim": "border-bosphorus-dim",
};
export const ACCENT_TEXT: Record<CircleAccent, string> = {
  terracotta: "text-terracotta",
  bosphorus: "text-bosphorus",
  "ferry-yellow": "text-ferry-yellow",
  moss: "text-moss",
  "terracotta-dim": "text-terracotta-dim",
  "bosphorus-dim": "text-bosphorus-dim",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "circlesV2" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/circles"),
  };
}

export default async function CirclesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getCachedTranslations(locale, "circlesV2");

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 max-w-3xl font-display text-display-lg leading-none text-paper lg:text-display-xl">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
          {t("lede")}
        </p>

        <div className="mt-14 grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {circles.map((circle) => (
            <Link
              key={circle.slug}
              href={`/circles/${circle.slug}`}
              className="group flex min-h-[13rem] flex-col border border-ink-3 bg-ink-2 p-6 transition-colors duration-fast hover:border-ink-5"
            >
              <span
                className={`h-3.5 w-3.5 rounded-full border-2 ${ACCENT_RING[circle.accent]}`}
              />
              <h2 className="mt-6 font-display text-h3 text-paper">
                {t(`names.${circle.slug}`)}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-dim">
                {t(`blurbs.${circle.slug}`)}
              </p>
              <span
                className={`mt-4 text-sm ${ACCENT_TEXT[circle.accent]}`}
              >
                {t("open")} →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 border-t border-ink-3 py-10 pb-24">
          <p className="max-w-2xl text-sm leading-relaxed text-paper-mute">
            {t("footnote")}
          </p>
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block border-b border-terracotta pb-0.5 text-sm text-terracotta"
          >
            {t("joinTelegram")} →
          </a>
        </div>
      </Container>
    </section>
  );
}
