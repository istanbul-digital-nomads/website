import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountrySelector } from "./country-selector";
import { FeaturedGuides } from "./featured-guides";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pathToIstanbulPage.meta");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/path-to-istanbul" },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "/path-to-istanbul",
      type: "website",
    },
  };
}

export default async function PathToIstanbulPage() {
  const t = await getTranslations("pathToIstanbulPage");
  return (
    <>
      <Section>
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p className="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400 sm:text-sm">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-base leading-6 text-[#5d6d7e] dark:text-[#99a3ad] sm:mt-5 sm:text-lg sm:leading-8">
            {t("hero.description")}
          </p>
        </div>

        <CountrySelector />

        <div className="mx-auto mt-12 max-w-3xl space-y-6 text-base leading-7 text-[#5d6d7e] dark:text-[#99a3ad] sm:mt-16">
          <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-3xl">
            {t("why.title")}
          </h2>
          <p>{t("why.p1")}</p>
          <p>{t("why.p2")}</p>

          <h2 className="pt-4 text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-3xl">
            {t("what.title")}
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                {t("what.items.visa.label")}
              </span>{" "}
              - {t("what.items.visa.body")}
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                {t("what.items.flights.label")}
              </span>{" "}
              - {t("what.items.flights.body")}
            </li>
            <li>
              <span className="font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                {t("what.items.housing.label")}
              </span>{" "}
              - {t("what.items.housing.body")}
            </li>
          </ul>

          <h2 className="pt-4 text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-3xl">
            {t("who.title")}
          </h2>
          <p>{t("who.body")}</p>
        </div>
      </Section>

      <Section className="border-t border-black/5 dark:border-white/10">
        <Reveal>
          <FeaturedGuides />
        </Reveal>
      </Section>

      <Section className="border-t border-black/5 dark:border-white/10">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(135deg,#8a2a1a_0%,#5c1a12_50%,#3d1410_100%)] px-6 py-10 text-center text-white dark:bg-[linear-gradient(135deg,#5c1a12_0%,#3d1410_50%,#1e2130_100%)] sm:px-10">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                {t("missingCountry.title")}
              </h2>
              <p className="mt-3 text-base leading-8 text-white/72">
                {t("missingCountry.body")}
              </p>
              <Link href="/local-guides/join" className="mt-6 inline-block">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-8 text-neutral-950 hover:bg-primary-50"
                >
                  {t("missingCountry.cta")} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
