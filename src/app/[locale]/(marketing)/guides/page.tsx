import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { guides } from "@/lib/data";
import { hasGuideContent } from "@/lib/guides";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { GuidesListing } from "./guides-listing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "guidesIndexPage.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/guides"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale, "/guides"),
      type: "website",
    },
  };
}

export default async function GuidesPage() {
  const t = await getTranslations("guidesIndexPage.hero");
  const guidesWithContent = guides
    .filter((g) => hasGuideContent(g.slug))
    .map((g) => g.slug);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              {t("description")}
            </p>
          </div>

          <GuidesListing guidesWithContent={guidesWithContent} />
        </Reveal>
      </Container>
    </section>
  );
}
