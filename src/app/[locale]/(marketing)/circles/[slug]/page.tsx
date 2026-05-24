import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { circles, getCircleBySlug } from "@/lib/circles";
import { socialLinks } from "@/lib/constants";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { ACCENT_RING } from "../page";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return circles.map((circle) => ({ slug: circle.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await props.params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const circle = getCircleBySlug(slug);
  if (!circle) return {};
  const t = await getTranslations({ locale, namespace: "circlesV2" });
  return {
    title: t("names." + slug),
    description: t("blurbs." + slug),
    alternates: alternatesFor(locale, `/circles/${slug}`),
  };
}

export default async function CircleDetailPage(props: Props) {
  const { locale: rawLocale, slug } = await props.params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const circle = getCircleBySlug(slug);
  if (!circle) notFound();

  const t = getCachedTranslations(locale, "circlesV2");
  const others = circles.filter((c) => c.slug !== slug);

  return (
    <section className="bg-ink-1 pt-12 lg:pt-16">
      <Container>
        <nav className="flex flex-wrap gap-2.5 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          <Link href="/circles" className="hover:text-paper">
            {t("eyebrow")}
          </Link>
          <span>/</span>
          <span className="text-paper">{t("names." + slug)}</span>
        </nav>

        <div className="mt-10 flex items-center gap-4">
          <span
            className={`h-5 w-5 rounded-full border-2 ${ACCENT_RING[circle.accent]}`}
          />
          <SectionEyebrow num="N° 01" label={t("circleEyebrow")} />
        </div>
        <h1 className="mt-6 font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("names." + slug)}
        </h1>

        <div className="mt-10 grid gap-12 border-t border-ink-3 py-14 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="max-w-2xl text-lede leading-relaxed text-paper-dim">
              {t("descriptions." + slug)}
            </p>
            <div className="mt-8 border-t border-ink-3 pt-6">
              <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                {t("rhythmEyebrow")}
              </h2>
              <p className="mt-3 text-base text-paper">
                {t("rhythms." + slug)}
              </p>
            </div>
          </div>

          <aside className="border border-ink-3 bg-ink-2 p-7">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-paper-mute">
              {t("joinEyebrow")}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim">
              {t("joinBody")}
            </p>
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-1.5 bg-terracotta px-6 py-4 text-center text-sm font-medium text-[#06101f] transition-colors duration-fast hover:bg-terracotta-dim"
            >
              {t("joinTelegram")}{" "}
              <span className="inline-dir-arrow" aria-hidden />
            </a>
          </aside>
        </div>

        {/* Other circles */}
        <div className="border-t border-ink-3 py-14 pb-24">
          <SectionEyebrow num="N° 02" label={t("otherEyebrow")} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/circles/${other.slug}`}
                className="group border border-ink-3 bg-ink-2 p-4 transition-colors hover:border-ink-5"
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full border-2 ${ACCENT_RING[other.accent]}`}
                />
                <span className="mt-3 block font-display text-h4 text-paper transition-colors group-hover:text-terracotta">
                  {t("names." + other.slug)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
