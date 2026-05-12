import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { GuideApplicationForm } from "./guide-application-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("localGuidesJoinPage.meta");
  return {
    title: t("title"),
    description: t("description"),
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
