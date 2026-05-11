import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
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

export const metadata: Metadata = {
  title: "Local Guides",
  description:
    "Meet experienced locals and nomads who know Istanbul inside out. Get help with neighborhoods, housing, visa, coworking, and more.",
};

export default async function LocalGuidesPage() {
  const { data: guides } = await getLocalGuides();
  const guideList = guides ?? [];

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>Local Guides</SectionTitle>
          <SectionDescription>
            These folks know Istanbul inside out and they&apos;re here to help
            you skip the learning curve. Whether you need neighborhood advice,
            visa help, or just a good cafe recommendation - they&apos;ve got
            you.
          </SectionDescription>
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
                We&apos;re building our guide network
              </h3>
              <p className="mt-3 text-neutral-600 dark:text-[#99a3ad]">
                Know Istanbul well enough to help newcomers find their feet?
                We&apos;d love to have you as one of our first local guides.
              </p>
              <Link href="/local-guides/join" className="mt-6 inline-block">
                <Button size="lg" className="rounded-full">
                  Apply to be a guide
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
                  Want to become a local guide?
                </h2>
                <p className="mt-3 text-base leading-8 text-white/72">
                  If you know Istanbul well and want to help newcomers settle in
                  faster, we&apos;d love to hear from you.
                </p>
                <Link href="/local-guides/join" className="mt-6 inline-block">
                  <Button
                    size="lg"
                    className="rounded-full bg-white px-8 text-neutral-950 hover:bg-primary-50"
                  >
                    Apply now
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
