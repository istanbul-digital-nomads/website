import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import {
  getCirclesGroupedByCategory,
  type Circle,
  type CircleAccent,
} from "@/lib/circles";
import { socialLinks } from "@/lib/constants";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  CircleCategorySection,
  type CircleCardCopy,
} from "@/components/sections/circles/circle-category-section";

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

  // Resolve a circle's display name/blurb: translations for circles that have
  // keys (the original six), static fields from src/lib/circles.ts otherwise.
  // Keeps newly added circles working before their translations land.
  const copyFor = (circle: Circle): CircleCardCopy => ({
    name: t.has(`names.${circle.slug}`) ? t(`names.${circle.slug}`) : circle.name,
    blurb: t.has(`blurbs.${circle.slug}`)
      ? t(`blurbs.${circle.slug}`)
      : circle.blurb,
  });

  const groups = getCirclesGroupedByCategory();

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 max-w-3xl font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
          {t("lede")}
        </p>

        <div className="pb-8">
          {groups.map((group, i) => (
            <CircleCategorySection
              key={group.category.slug}
              num={`N° ${String(i + 2).padStart(2, "0")}`}
              categoryName={group.category.name}
              categoryBlurb={group.category.blurb}
              circles={group.circles}
              copyFor={copyFor}
              openLabel={t("open")}
            />
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
            className="mt-4 inline-flex items-center gap-1.5 border-b border-terracotta pb-0.5 text-sm text-terracotta"
          >
            {t("joinTelegram")}{" "}
            <span className="inline-dir-arrow" aria-hidden />
          </a>
        </div>
      </Container>
    </section>
  );
}
