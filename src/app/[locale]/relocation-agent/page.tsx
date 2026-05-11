import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { RelocationAgentShell } from "./relocation-agent-shell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("relocationAgentPage.meta");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/relocation-agent" },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      url: "https://istanbulnomads.com/relocation-agent",
      siteName: "Istanbul Digital Nomads",
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
