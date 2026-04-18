import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, MoveUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { NeighborhoodStatCard } from "@/components/ui/neighborhood-stat-card";
import { NeighborhoodPhotoImage } from "@/components/ui/neighborhood-photo";
import {
  neighborhoods,
  getNeighborhoodBySlug,
  getSpacesInNeighborhood,
} from "@/lib/neighborhoods";
import { socialLinks } from "@/lib/constants";

interface Props {
  params: { neighborhood: string };
}

export async function generateStaticParams() {
  return neighborhoods.map((n) => ({ neighborhood: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = getNeighborhoodBySlug(params.neighborhood);
  if (!n) return {};
  const title = `${n.name} - Istanbul neighborhood guide`;
  return {
    title,
    description: n.oneLiner,
    openGraph: {
      title,
      description: n.oneLiner,
      images: [{ url: n.hero.src, alt: n.hero.alt }],
    },
  };
}

export default function NeighborhoodDetailPage({ params }: Props) {
  const n = getNeighborhoodBySlug(params.neighborhood);
  if (!n) notFound();

  const spacesHere = getSpacesInNeighborhood(n.slug);
  const coworking = spacesHere.filter((s) => s.type === "coworking");
  const cafes = spacesHere.filter((s) => s.type === "cafe");

  const others = neighborhoods.filter((o) => o.slug !== n.slug).slice(0, 2);

  return (
    <>
      <section className="relative isolate border-b border-black/5 dark:border-white/10">
        <div className="absolute inset-0 -z-10">
          <Image
            src={n.hero.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.85)_100%)]" />
        </div>

        <Container className="relative pb-16 pt-24 sm:pb-20 sm:pt-32">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/guides/neighborhoods" className="hover:text-white">
              Neighborhoods
            </Link>
            <span>/</span>
            <span className="text-white">{n.name}</span>
          </nav>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium text-white backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              {n.side} side
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1.5 font-mono uppercase tracking-[0.24em] text-white/80">
              {n.noise} noise
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-6xl">
            {n.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            {n.oneLiner}
          </p>

          <p className="mt-8 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            Photo:{" "}
            <a
              href={n.hero.credit.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-white"
            >
              {n.hero.credit.author}
            </a>{" "}
            / {n.hero.credit.source} ({n.hero.credit.license})
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">The feel</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
              {n.vibe}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5d6d7e] dark:text-[#99a3ad]">
              {n.description}
            </p>
          </div>
          <NeighborhoodStatCard neighborhood={n} />
        </div>
      </Section>

      {n.gallery.length > 0 && (
        <section className="pb-16">
          <Container>
            <p className="eyebrow mb-6">More of {n.name}</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {n.gallery.map((g) => (
                <NeighborhoodPhotoImage
                  key={g.src}
                  photo={g}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {spacesHere.length > 0 && (
        <section className="border-y border-black/5 py-16 dark:border-white/10">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Work here</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                  Coworking and cafes in {n.name}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#5d6d7e] dark:text-[#99a3ad]">
                  {spacesHere.length} spaces we track here, scored on wifi,
                  power, comfort, noise, value, and vibe.
                </p>
              </div>
              <Link
                href="/spaces"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-[#f2f3f4] dark:hover:text-primary-400"
              >
                All spaces
                <MoveUpRight className="h-4 w-4" />
              </Link>
            </div>

            {coworking.length > 0 && (
              <>
                <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
                  Coworking
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {coworking.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-[1.5rem] border border-black/10 bg-white/55 p-5 dark:border-white/10 dark:bg-white/5"
                    >
                      <h4 className="text-lg font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {s.name}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-[#5d6d7e] dark:text-[#99a3ad]">
                        {s.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {cafes.length > 0 && (
              <>
                <h3 className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
                  Cafes
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cafes.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-[1.5rem] border border-black/10 bg-white/55 p-5 dark:border-white/10 dark:bg-white/5"
                    >
                      <h4 className="font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {s.name}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-[#5d6d7e] dark:text-[#99a3ad]">
                        {s.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Container>
        </section>
      )}

      <section className="py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(135deg,#c0392b_0%,#922b21_50%,#641e16_100%)] p-8 text-white dark:bg-[linear-gradient(135deg,#922b21_0%,#641e16_50%,#15212c_100%)]">
              <p className="eyebrow text-white/70">Next step</p>
              <h2 className="mt-3 max-w-md text-3xl font-semibold sm:text-4xl">
                Coming to {n.name}? Say hi before you land.
              </h2>
              <p className="mt-4 max-w-md text-base leading-8 text-white/75">
                Join the Telegram group and we&apos;ll point you to this
                week&apos;s meetup, a reliable cafe, and anything else you need
                to settle in.
              </p>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1a1a2e] transition-colors hover:bg-primary-50"
              >
                Join on Telegram
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div>
              <p className="eyebrow">Compare</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                Other neighborhoods nomads pick
              </h3>
              <div className="mt-5 space-y-3">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/guides/neighborhoods/${o.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/55 p-4 transition-colors hover:border-primary-500/30 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div>
                      <p className="text-lg font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {o.name}
                      </p>
                      <p className="mt-1 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                        {o.oneLiner}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </Link>
                ))}
              </div>
              <Link
                href="/guides/neighborhoods"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-950 hover:text-primary-600 dark:text-[#f2f3f4] dark:hover:text-primary-400"
              >
                See all five
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
