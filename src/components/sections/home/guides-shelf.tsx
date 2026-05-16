import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { guides } from "@/lib/data";
import { homeGuidePhotos } from "@/lib/editorial-photos";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PhotoSlot, type PhotoKind } from "@/components/ui/photo-slot";

/**
 * Design System v2 - "Guides, on the shelf". An editorial three-up of the
 * long-form guides: written, edited, dated, signed. Real guide data from
 * src/lib/data.ts; the lead guide gets a taller photo.
 */
const FEATURED: { slug: string; photo: PhotoKind }[] = [
  { slug: "neighborhoods", photo: "bosphorus" },
  { slug: "housing", photo: "street" },
  { slug: "cost-of-living", photo: "mono" },
];

export function GuidesShelf({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.guidesShelf");
  const tGuides = getCachedTranslations(locale, "guides");

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <Container>
        <SectionEyebrow num="N° 04" label={t("eyebrow")} />

        <h2 className="mt-8 max-w-4xl font-display text-display-lg leading-tight text-paper">
          {t("title")}{" "}
          <span className="italic text-paper-mute">{t("titleItalic")}</span>
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3 md:items-start">
          {FEATURED.map((item, i) => {
            const guide = guides.find((g) => g.slug === item.slug);
            if (!guide) return null;
            const photo = homeGuidePhotos[guide.slug];
            return (
              <article key={item.slug} className="flex flex-col gap-4">
                <Link href={`/guides/${guide.slug}`} className="group">
                  <PhotoSlot
                    kind={item.photo}
                    src={photo?.src}
                    alt={photo?.alt}
                    credit={photo?.credit}
                    objectPosition={photo?.objectPosition}
                    corner={guide.category.replace("-", " ")}
                    className={i === 0 ? "h-80" : "h-52"}
                  />
                </Link>
                <div className="flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-wider">
                  <span className="text-terracotta">
                    {guide.category.replace("-", " ")}
                  </span>
                  <span className="text-paper-faint">
                    {t("readLabel", { num: String(i + 1).padStart(2, "0") })}
                  </span>
                </div>
                <Link href={`/guides/${guide.slug}`} className="group">
                  <h3
                    className={`font-display leading-tight text-paper transition-colors group-hover:text-terracotta ${
                      i === 0 ? "text-h2" : "text-h3"
                    }`}
                  >
                    {tGuides(`${guide.slug}.title`)}
                  </h3>
                </Link>
                <p className="text-sm leading-relaxed text-paper-dim">
                  {tGuides(`${guide.slug}.description`)}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 border-t border-ink-3 pt-6">
          <Link
            href="/guides"
            className="group inline-flex items-center gap-1.5 border-b border-terracotta pb-0.5 text-sm text-terracotta"
          >
            {t("allGuides")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
