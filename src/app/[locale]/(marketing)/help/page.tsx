import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, faqPageSchema, jsonLdGraph } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { FAQ_CATEGORIES, faqItems } from "@/lib/faq";
import { helpDocs } from "@/lib/help-docs";
import { getHelpSearchItems } from "@/lib/help-search";
import {
  HelpExplorer,
  type FaqGroup,
  type DocCard,
} from "@/components/sections/help/help-explorer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "helpPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/help"),
  };
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  return <HelpContent locale={locale} />;
}

async function HelpContent({ locale }: { locale: Locale }) {
  "use cache";
  const t = getCachedTranslations(locale, "helpPage");
  const tFaq = getCachedTranslations(locale, "faqItems");
  const tCat = getCachedTranslations(locale, "faqCategories");

  const searchItems = getHelpSearchItems(locale);

  const docCards: DocCard[] = helpDocs.map((doc) => ({
    slug: doc.slug,
    title: t(`docs.${doc.slug}.title`),
    description: t(`docs.${doc.slug}.description`),
    href: `/help/${doc.slug}`,
    icon: doc.icon,
  }));

  const faqGroups: FaqGroup[] = FAQ_CATEGORIES.map((category) => ({
    category,
    label: tCat(category),
    items: faqItems
      .filter((i) => i.category === category)
      .map((i) => ({
        id: i.id,
        question: tFaq(`${i.id}.question`),
        answer: tFaq(`${i.id}.answer`),
        href: i.href,
      })),
  })).filter((g) => g.items.length > 0);

  const faqSchema = faqPageSchema(
    faqItems.map((i) => ({
      question: tFaq(`${i.id}.question`),
      answer: tFaq(`${i.id}.answer`),
    })),
  );
  const jsonLd = jsonLdGraph(faqSchema);

  const labels = {
    searchPlaceholder: t("searchPlaceholder"),
    docsTitle: t("docsTitle"),
    faqTitle: t("faqTitle"),
    learnMore: t("learnMore"),
    noResults: t("noResults"),
    resultsTitle: t("resultsTitle"),
    kindFaq: t("kind.faq"),
    kindDoc: t("kind.doc"),
    kindGuide: t("kind.guide"),
    cityNote: t("cityNote"),
    cityCta: t("cityCta"),
  };

  return (
    <section className="bg-ink-1 py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionEyebrow num="N° 01" label={t("eyebrow")} />
          <h1 className="mt-6 font-display text-h1 leading-tight text-paper">
            {t("title")}
          </h1>
          <p className="mt-4 text-lede leading-relaxed text-paper-dim">
            {t("intro")}
          </p>

          <div className="mt-10">
            <HelpExplorer
              searchItems={searchItems}
              docCards={docCards}
              faqGroups={faqGroups}
              labels={labels}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
