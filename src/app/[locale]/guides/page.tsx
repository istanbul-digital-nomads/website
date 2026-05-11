import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { guides } from "@/lib/data";
import { hasGuideContent } from "@/lib/guides";
import { GuidesListing } from "./guides-listing";

export const metadata: Metadata = {
  title: "City Guides",
  description:
    "Practical guides for living and working in Istanbul as a digital nomad.",
};

export default function GuidesPage() {
  const guidesWithContent = guides
    .filter((g) => hasGuideContent(g.slug))
    .map((g) => g.slug);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              City Guides
            </h1>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              Practical guides for living and working in Istanbul. Written and
              maintained by the community.
            </p>
          </div>

          <GuidesListing guidesWithContent={guidesWithContent} />
        </Reveal>
      </Container>
    </section>
  );
}
