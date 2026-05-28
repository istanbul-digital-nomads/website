import type { Metadata } from "next";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { AliWeekMapLazy } from "@/components/sections/plans/ali-week-map-lazy";
import { aliMember, aliWeek } from "@/lib/ali-week";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const title = `${aliMember.name}'s week in Istanbul`;
  const description =
    "Seven days, three neighborhoods: a nomad's week across Kadıköy, Şişli, and Beyoğlu - animated on the map.";
  return {
    title,
    description,
    alternates: alternatesFor(locale, "/plans/ali-week"),
    openGraph: {
      title,
      description,
      url: localeUrl(locale, "/plans/ali-week"),
      type: "article",
    },
  };
}

export default async function AliWeekPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const neighborhoods = [...new Set(aliWeek.map((d) => d.neighborhood))];
  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 02" label="A nomad's week" />
        <h1 className="mt-8 max-w-4xl font-display text-h1 leading-none text-paper lg:text-display-lg">
          {`${aliMember.name}’s week,`}{" "}
          <span className="italic text-terracotta">on the map.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
          Seven days, three neighborhoods, a different cafe to open each one.
          Tap a day to load its stops, hit play to walk through it.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {neighborhoods.map((n) => (
            <span
              key={n}
              className="rounded-full border border-ink-3 px-2.5 py-1"
            >
              {n}
            </span>
          ))}
          <span className="rounded-full border border-ink-3 px-2.5 py-1">
            {aliWeek.length} days
          </span>
          <span className="rounded-full border border-ink-3 px-2.5 py-1">
            {aliWeek.reduce((n, d) => n + d.stops.length, 0)} stops
          </span>
        </div>
      </Container>

      <Container className="mt-10 pb-20 lg:mt-12 lg:pb-28">
        <AliWeekMapLazy />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-paper-mute">
          Each day starts at a real cafe branch from our coffee-brand locator
          dataset. The other stops are well-known Istanbul spots - sahil walks,
          the opera, the park, a meyhane evening. Hit play and the camera flies
          through the day; click a numbered pin to jump straight to that stop.
        </p>
      </Container>
    </section>
  );
}
