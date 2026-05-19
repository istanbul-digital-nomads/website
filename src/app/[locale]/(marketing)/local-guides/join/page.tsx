import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { GuideApplicationForm } from "./guide-application-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "localGuidesJoinPage.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/local-guides/join"),
  };
}

export default async function JoinAsGuidePage() {
  const t = await getTranslations("localGuidesJoinPage.hero");
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{t("title")}</SectionTitle>
        <SectionDescription>{t("description")}</SectionDescription>
      </SectionHeader>

      <div className="mx-auto max-w-2xl">
        <GuideApplicationForm />
      </div>
    </Section>
  );
}
