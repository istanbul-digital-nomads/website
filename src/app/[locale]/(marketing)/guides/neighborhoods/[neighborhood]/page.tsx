import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { Tag } from "@/components/ui/tag";
import { HoodAtAGlance } from "@/components/sections/neighborhoods/hood-at-a-glance";
import { WorkSpaces } from "@/components/sections/neighborhoods/work-spaces";
import { SimilarNeighborhoods } from "@/components/sections/neighborhoods/similar-neighborhoods";
import { neighborhoods, getNeighborhoodBySlug } from "@/lib/neighborhoods";
import { getNeighborhoodPhotoSet } from "@/lib/editorial-photos";
import { socialLinks } from "@/lib/constants";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string; neighborhood: string }>;
}

export async function generateStaticParams() {
  return neighborhoods.map((n) => ({ neighborhood: n.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const n = getNeighborhoodBySlug(params.neighborhood);
  if (!n) return {};
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const tList = await getTranslations("neighborhoodList");
  const tDetail = await getTranslations("neighborhoodDetailPage");
  const name = tList(`${n.slug}.name`);
  const oneLiner = tList(`${n.slug}.oneLiner`);
  const title = tDetail("metaTitleTemplate", { name });
  return {
    title,
    description: oneLiner,
    alternates: alternatesFor(locale, `/guides/neighborhoods/${n.slug}`),
    openGraph: { title, description: oneLiner },
  };
}

export default async function NeighborhoodDetailPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <NeighborhoodDetailContent {...props} />
    </Suspense>
  );
}

async function NeighborhoodDetailContent(props: Props) {
  const params = await props.params;
  const n = getNeighborhoodBySlug(params.neighborhood);
  if (!n) notFound();

  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const tList = getCachedTranslations(locale, "neighborhoodList");
  const tCommon = getCachedTranslations(locale, "common");
  const tDetail = getCachedTranslations(locale, "neighborhoodDetailPage");
  const tV2 = getCachedTranslations(locale, "neighborhoodsV2");

  const name = tList(`${n.slug}.name`);
  const sideLabel = tCommon(
    n.side === "European" ? "side.european" : "side.asian",
  );
  const vibe = tList.has(`${n.slug}.vibe`) ? tList(`${n.slug}.vibe`) : n.vibe;
  const description = tList.has(`${n.slug}.description`)
    ? tList(`${n.slug}.description`)
    : n.description;
  const photoKind = n.side === "Asian" ? "dawn" : "dusk";
  const photos = getNeighborhoodPhotoSet(n);
  const firstDetailPhoto = photos.details[0] ?? photos.hero;
  const secondDetailPhoto = photos.details[1] ?? photos.hero;

  return (
    <>
      {/* Hero - breadcrumb, giant serif name, photo cluster, lede */}
      <section className="border-b border-ink-3 bg-ink-1 pt-12 lg:pt-16">
        <Container>
          <nav className="flex flex-wrap gap-2.5 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            <Link href="/guides/neighborhoods" className="hover:text-paper">
              {tDetail("breadcrumb.neighborhoods")}
            </Link>
            <span>/</span>
            <span className="text-paper">{name}</span>
            <span className="ml-auto text-paper-faint">
              {sideLabel} · {n.coords[1].toFixed(2)}°N {n.coords[0].toFixed(2)}
              °E
            </span>
          </nav>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <h1 className="font-display text-[clamp(4rem,12vw,11rem)] leading-[0.85] text-paper">
              {name}
            </h1>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {n.badges.map((badgeKey) => (
                <Tag key={badgeKey}>
                  {tList(`${n.slug}.badges.${badgeKey}`)}
                </Tag>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <PhotoSlot
              kind={photoKind}
              src={photos.hero.src}
              alt={photos.hero.alt}
              credit={photos.hero.credit}
              objectPosition={photos.hero.objectPosition}
              corner={tV2("detail.leadPhoto")}
              caption={`${name} · ${sideLabel}`}
              className="h-80 lg:h-[32rem]"
            />
            <div className="grid grid-rows-2 gap-4">
              <PhotoSlot
                kind="interior"
                src={firstDetailPhoto.src}
                alt={firstDetailPhoto.alt}
                credit={firstDetailPhoto.credit}
                objectPosition={firstDetailPhoto.objectPosition}
                corner={tV2("detail.detailPhoto")}
                className="h-40 lg:h-auto"
              />
              <PhotoSlot
                kind="street"
                src={secondDetailPhoto.src}
                alt={secondDetailPhoto.alt}
                credit={secondDetailPhoto.credit}
                objectPosition={secondDetailPhoto.objectPosition}
                corner={tV2("detail.detailPhoto")}
                className="h-40 lg:h-auto"
              />
            </div>
          </div>

          {/* Lede */}
          <div className="mt-16 grid gap-12 border-t border-ink-3 py-16 lg:grid-cols-[1fr_1.6fr]">
            <SectionEyebrow num="N° 01" label={tV2("detail.ledeEyebrow")} />
            <div>
              <p className="font-display text-h3 leading-snug text-paper">
                {vibe}
              </p>
              <p className="mt-6 text-base leading-relaxed text-paper-dim">
                {description}
              </p>
              <p className="mt-6 text-base leading-relaxed text-paper-mute">
                {n.transport}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <HoodAtAGlance neighborhood={n} locale={locale} />

      <WorkSpaces neighborhood={n} locale={locale} />

      <SimilarNeighborhoods neighborhood={n} locale={locale} />

      {/* Closing CTA */}
      <section className="bg-ink-1 py-24 lg:py-32">
        <Container>
          <div className="border-y border-ink-3 py-16 text-center lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
              {tDetail("nextStepEyebrow")}
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-h1 leading-tight text-paper">
              {tDetail("comingTo", { name })}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper-dim">
              {tDetail("joinTelegramBody")}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href={`/plans?neighborhood=${n.slug}`}
                className="bg-terracotta px-7 py-4 text-sm font-medium text-[#06101f] transition-colors duration-fast hover:bg-terracotta-dim"
              >
                {tDetail("planWeekOne")}{" "}
                <span className="inline-dir-arrow" aria-hidden />
              </Link>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink-4 px-7 py-4 text-sm text-paper transition-colors duration-fast hover:border-ink-5"
              >
                {tDetail("joinOnTelegram")}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
