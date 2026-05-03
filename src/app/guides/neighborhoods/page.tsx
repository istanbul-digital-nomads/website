import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { guides } from "@/lib/data";
import { getGuideContent } from "@/lib/guides";
import { mdxComponents } from "@/components/ui/mdx-components";
import { IstanbulTodayWidget } from "@/components/sections/istanbul-today-widget";
import { NeighborhoodDecisionNotes } from "@/components/sections/neighborhood-decision-notes";
import { NeighborhoodRhythmMatcher } from "@/components/sections/neighborhood-rhythm-matcher";
import { formatDate } from "@/lib/utils";
import { mdxOptions } from "@/lib/mdx-options";
import {
  neighborhoods,
  formatRentRange,
  getSpacesInNeighborhood,
} from "@/lib/neighborhoods";

const SLUG = "neighborhoods";

export async function generateMetadata(): Promise<Metadata> {
  const guide = guides.find((g) => g.slug === SLUG);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
  };
}

export default function NeighborhoodsOverviewPage() {
  const guide = guides.find((g) => g.slug === SLUG);
  if (!guide) notFound();

  const guideContent = getGuideContent(SLUG);

  return (
    <>
      <section className="border-b border-black/5 py-12 dark:border-white/10">
        <Container>
          <div className="mx-auto max-w-3xl">
            <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
              <Link
                href="/"
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/guides"
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                Guides
              </Link>
              <span>/</span>
              <span className="text-[#1a1a2e] dark:text-[#f2f3f4]">
                {guide.title}
              </span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              {guideContent?.frontmatter.description || guide.description}
            </p>

            {guideContent?.frontmatter.lastUpdated && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                <Calendar className="h-4 w-4" />
                Last updated {formatDate(guideContent.frontmatter.lastUpdated)}
              </div>
            )}
          </div>
        </Container>
      </section>

      <IstanbulTodayWidget compact />

      <NeighborhoodRhythmMatcher compact />

      <section className="py-14">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((n) => {
              const count = getSpacesInNeighborhood(n.slug).length;
              return (
                <Link
                  key={n.slug}
                  href={`/guides/neighborhoods/${n.slug}`}
                  prefetch
                  className="group block overflow-hidden rounded-[2rem] border border-black/10 bg-white/55 transition-all hover:-translate-y-1 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-primary-50/30 dark:bg-primary-950/20">
                    <Image
                      src={n.hero.src}
                      alt={n.hero.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-[#1a1a2e] backdrop-blur dark:bg-[#1a1d27]/85 dark:text-[#f2f3f4]">
                      <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                      {n.side} side
                    </div>
                    <div className="absolute bottom-4 right-4 rounded-full bg-[#1a1a2e]/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur">
                      {formatRentRange(n)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {n.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5d6d7e] dark:text-[#99a3ad]">
                      {n.oneLiner}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {n.badges.slice(0, 3).map((badge) => (
                        <span
                          key={badge}
                          className="rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-950/30 dark:text-primary-200"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                        {count > 0
                          ? `${count} ${count === 1 ? "space" : "spaces"} tracked`
                          : "Coworking nearby"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 transition-colors group-hover:text-primary-600 dark:text-primary-300 dark:group-hover:text-primary-200">
                        Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <NeighborhoodDecisionNotes />

      <Section>
        <div className="mx-auto max-w-3xl">
          {guideContent ? (
            <article>
              <MDXRemote
                source={guideContent.content}
                components={mdxComponents}
                options={mdxOptions}
              />
            </article>
          ) : null}
        </div>
      </Section>
    </>
  );
}
