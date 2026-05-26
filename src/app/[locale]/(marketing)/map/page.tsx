import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { MapExplorer } from "@/components/sections/map/map-explorer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "mapPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/map"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale, "/map"),
      type: "website",
    },
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("mapPage");

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 max-w-4xl font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
          {t("lede")}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/plans/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-deep-water transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1"
          >
            {t("ctaPlan")}
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/spaces"
            className="inline-flex items-center gap-2 rounded-full border border-ink-3 px-6 py-3 text-sm text-paper transition-colors hover:border-paper-mute"
          >
            {t("ctaSpaces")}
          </Link>
        </div>
      </Container>

      <Container className="mt-12 pb-20 lg:mt-16 lg:pb-28">
        <MapExplorer
          labels={{
            brands: t("filters.brands"),
            neighborhoods: t("filters.neighborhoods"),
          }}
        />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper-mute">
          {t("details")}
        </p>
      </Container>
    </section>
  );
}
