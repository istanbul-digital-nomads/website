import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { RelocationAgentShell } from "./relocation-agent-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "relocationAgentPage.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/relocation-agent"),
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      url: localeUrl(locale, "/relocation-agent"),
      siteName: "Istanbul Nomads",
      type: "website",
    },
  };
}

export default async function RelocationAgentPage() {
  const t = await getTranslations("relocationAgentPage.intro");
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{t("title")}</SectionTitle>
        <SectionDescription>{t("description")}</SectionDescription>
      </SectionHeader>

      <div className="mx-auto max-w-3xl">
        <RelocationAgentShell />
      </div>
    </Section>
  );
}
