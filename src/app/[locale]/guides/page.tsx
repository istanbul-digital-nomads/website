import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { guides } from "@/lib/data";
import { hasGuideContent } from "@/lib/guides";
import { GuidesListing } from "./guides-listing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guidesIndexPage.meta");
  return {
    title: t("title"),
    description: t("description"),
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
