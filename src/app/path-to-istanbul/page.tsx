import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountrySelector } from "./country-selector";
import { FeaturedGuides } from "./featured-guides";

export const metadata: Metadata = {
  title: "Path to Istanbul - Relocation Guides by Country",
  description:
    "Country-specific relocation guides for moving to Istanbul. Visa, flights, housing, banking, and community - everything you need to land well.",
};

export default function PathToIstanbulPage() {
  return (
    <>
      <Section>
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p className="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400 sm:text-sm">
            Path to Istanbul
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-5xl">
            Find your path to Istanbul
          </h1>
          <p className="mt-4 text-base leading-6 text-[#5d6d7e] dark:text-[#99a3ad] sm:mt-5 sm:text-lg sm:leading-8">
            Pick your starting country for an end-to-end relocation playbook -
            visa, flights, housing, banking, and the community waiting here.
          </p>
        </div>

        <CountrySelector />
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
                Don&apos;t see your country?
              </h2>
              <p className="mt-3 text-base leading-8 text-white/72">
                We&apos;re adding more paths. If you&apos;ve made this move
                yourself, apply to be a local guide and help the next person
                from your country land well.
              </p>
              <Link href="/local-guides/join" className="mt-6 inline-block">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-8 text-neutral-950 hover:bg-primary-50"
                >
                  Apply to be a guide <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
