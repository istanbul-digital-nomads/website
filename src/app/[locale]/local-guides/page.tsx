import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";
import { getLocalGuides } from "@/lib/supabase/queries";
import { LocalGuidesDirectory } from "./local-guides-directory";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("localGuidesPage.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocalGuidesPage() {
  const t = await getTranslations("localGuidesPage");
  const { data: guides } = await getLocalGuides();
  const guideList = guides ?? [];

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>{t("hero.title")}</SectionTitle>
          <SectionDescription>{t("hero.description")}</SectionDescription>
        </SectionHeader>

        {guideList.length > 0 ? (
          <LocalGuidesDirectory guides={guideList} />
        ) : (
          <Reveal>
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900 dark:text-[#f2f3f4]">
                {t("empty.title")}
              </h3>
              <p className="mt-3 text-neutral-600 dark:text-[#99a3ad]">
                {t("empty.body")}
              </p>
              <Link href="/local-guides/join" className="mt-6 inline-block">
                <Button size="lg" className="rounded-full">
                  {t("empty.cta")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Reveal>
        )}
      </Section>

      {/* CTA for becoming a guide */}
      {guideList.length > 0 && (
        <Section className="border-t border-black/5 dark:border-white/10">
          <Container>
            <Reveal>
              <div className="mx-auto max-w-2xl rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(135deg,#8a2a1a_0%,#5c1a12_50%,#3d1410_100%)] px-6 py-10 text-center text-white dark:bg-[linear-gradient(135deg,#5c1a12_0%,#3d1410_50%,#1e2130_100%)] sm:px-10">
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  {t("becomeGuide.title")}
                </h2>
                <p className="mt-3 text-base leading-8 text-white/72">
                  {t("becomeGuide.body")}
                </p>
                <Link href="/local-guides/join" className="mt-6 inline-block">
                  <Button
                    size="lg"
                    className="rounded-full bg-white px-8 text-neutral-950 hover:bg-primary-50"
                  >
                    {t("becomeGuide.cta")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Reveal>
          </Container>
        </Section>
      )}
    </>
  );
}
