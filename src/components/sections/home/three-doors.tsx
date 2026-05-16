import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { socialLinks } from "@/lib/constants";
import { homeDoorPhotos } from "@/lib/editorial-photos";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PhotoSlot, type PhotoKind } from "@/components/ui/photo-slot";

/**
 * Design System v2 - "Three doors. Pick one." The page's whole job in one
 * grid: the First Week Planner, the Neighborhood Matcher, the Telegram
 * community. Honest CTAs to surfaces that actually exist.
 */
const DOORS: {
  id: "planner" | "matcher" | "community";
  num: string;
  href: string;
  external?: boolean;
  photo: PhotoKind;
  tone: string;
}[] = [
  {
    id: "planner",
    num: "01",
    href: "/tools/first-week-planner",
    photo: "interior",
    tone: "text-terracotta",
  },
  {
    id: "matcher",
    num: "02",
    href: "/guides/neighborhoods",
    photo: "dusk",
    tone: "text-bosphorus",
  },
  {
    id: "community",
    num: "03",
    href: socialLinks.telegram,
    external: true,
    photo: "street",
    tone: "text-ferry-yellow",
  },
];

export function ThreeDoors({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.doors");

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <Container>
        <SectionEyebrow num="N° 02" label={t("eyebrow")} />

        <div className="mt-12 grid gap-px bg-ink-4 border border-ink-4 md:grid-cols-3">
          {DOORS.map((door) => {
            const photo = homeDoorPhotos[door.id];
            const Body = (
              <>
                <div className="flex items-baseline justify-between">
                  <span
                    className={`font-mono text-5xl leading-none ${door.tone}`}
                  >
                    {door.num}
                  </span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${door.tone.replace("text-", "bg-")}`}
                  />
                </div>
                <h3 className="mt-8 font-display text-h3 leading-tight text-paper">
                  {t(`${door.id}.title`)}
                  <br />
                  <span className="italic text-paper-mute">
                    {t(`${door.id}.italic`)}
                  </span>
                </h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-paper-dim">
                  {t(`${door.id}.body`)}
                </p>
                <PhotoSlot
                  kind={door.photo}
                  src={photo.src}
                  alt={photo.alt}
                  credit={photo.credit}
                  objectPosition={photo.objectPosition}
                  corner={door.num}
                  caption={t(`${door.id}.photoCaption`)}
                  className="mt-7 h-32"
                />
                <div className="mt-6 border-t border-ink-3 pt-5">
                  <span
                    className={`inline-flex items-center gap-1.5 border-b border-current pb-0.5 text-sm ${door.tone}`}
                  >
                    {t(`${door.id}.cta`)}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </>
            );
            return door.external ? (
              <a
                key={door.id}
                href={door.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[30rem] flex-col bg-ink-1 p-9 transition-colors duration-fast hover:bg-ink-2"
              >
                {Body}
              </a>
            ) : (
              <Link
                key={door.id}
                href={door.href}
                className="group flex min-h-[30rem] flex-col bg-ink-1 p-9 transition-colors duration-fast hover:bg-ink-2"
              >
                {Body}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
