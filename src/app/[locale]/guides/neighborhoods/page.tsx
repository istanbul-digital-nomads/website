import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { guides } from "@/lib/data";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { getGuideContent } from "@/lib/guides";
import { mdxComponents } from "@/components/ui/mdx-components";
import { mdxOptions } from "@/lib/mdx-options";
import { NeighborhoodRhythmMatcher } from "@/components/sections/neighborhood-rhythm-matcher";
import { BosphorusSchematic } from "@/components/sections/neighborhoods/bosphorus-schematic";
import { NeighborhoodListRow } from "@/components/sections/neighborhoods/neighborhood-list-row";
import { neighborhoods } from "@/lib/neighborhoods";

const SLUG = "neighborhoods";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = await getTranslations({ locale, namespace: "guides" });
  return {
    title: t(`${SLUG}.title`),
    description: t(`${SLUG}.description`),
    alternates: alternatesFor(locale, `/guides/${SLUG}`),
  };
}

export default async function NeighborhoodsOverviewPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = getCachedTranslations(locale, "neighborhoodsV2");
  const guideContent = getGuideContent(SLUG, locale);

  return (
    <>
      {/* Header + Bosphorus schematic */}
      <section className="border-b border-ink-3 bg-ink-1 pt-16 lg:pt-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_380px] lg:items-start">
            <div>
              <SectionEyebrow num="N° 01" label={t("index.eyebrow")} />
              <h1 className="mt-8 max-w-2xl font-display text-display-lg leading-none text-paper lg:text-display-xl">
                {t("index.title")}{" "}
                <span className="italic text-terracotta">
                  {t("index.titleItalic")}
                </span>
              </h1>
              <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
                {t("index.lede")}
              </p>
            </div>
            <BosphorusSchematic label={t("index.schematicLabel")} />
          </div>

          {/* Editorial list */}
          <div className="mt-16 border-t border-ink-3 pb-8">
            {neighborhoods.map((n, i) => (
              <NeighborhoodListRow
                key={n.slug}
                neighborhood={n}
                locale={locale}
                num={i + 1}
              />
            ))}
          </div>
        </Container>
      </section>

      <NeighborhoodRhythmMatcher compact eyebrowNum="N° 02" />

      {/* The existing long-form guide, wrapped in the new chrome */}
      {guideContent ? (
        <section className="bg-ink-1 py-24 lg:py-32">
          <Container>
            <SectionEyebrow num="N° 03" label={t("index.guideEyebrow")} />
            <article className="prose-nomad mx-auto mt-10 max-w-3xl text-paper-dim">
              <MDXRemote
                source={guideContent.content}
                components={mdxComponents}
                options={mdxOptions}
              />
            </article>
          </Container>
        </section>
      ) : null}
    </>
  );
}
