import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SpotFinder } from "./spot-finder";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "spotFinder.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/tools/spot-finder"),
  };
}

export default function SpotFinderPage() {
  return <SpotFinder />;
}
