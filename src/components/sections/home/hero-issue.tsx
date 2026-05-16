import Link from "next/link";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { isRtl, type Locale } from "@/lib/i18n/config";
import { getMemberCount } from "@/lib/ambient";
import { socialLinks } from "@/lib/constants";
import { homeHeroPhoto } from "@/lib/editorial-photos";
import { Container } from "@/components/ui/container";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { FerryMark } from "@/components/ui/mark";

/**
 * Design System v2 homepage hero - "N° 01 · Arrival". A full-bleed
 * atmospheric photo slot carrying the Bosphorus ferry header strip (the one
 * moving signal on the page), then the masthead rule and the editorial
 * serif headline + lede below it.
 */
export async function HeroIssue({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.hero");
  const members = await getMemberCount();
  const rtl = isRtl(locale);

  return (
    <section className="border-b border-ink-3 bg-ink-1">
      {/* Full-bleed photo slot with the moving ferry header */}
      <div className="relative">
        <PhotoSlot
          kind="dawn"
          src={homeHeroPhoto.src}
          alt={homeHeroPhoto.alt}
          credit={homeHeroPhoto.credit}
          priority
          sizes="100vw"
          objectPosition={homeHeroPhoto.objectPosition}
          caption={t("photoCaption")}
          className="h-[44vw] max-h-[620px] min-h-[320px] w-full border-x-0 border-t-0"
        />

        {/* Bosphorus ferry strip - the single animated signal */}
        <div className="absolute start-4 top-4 hidden w-[min(620px,70vw)] border border-paper/20 bg-ink-0/55 px-4 py-2.5 backdrop-blur-sm sm:block">
          <div className="flex items-center gap-3.5" dir="ltr">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              Bosphorus · 07:00 → 22:40
            </span>
            <div className="relative h-6 flex-1">
              <span className="absolute left-0 top-1.5 font-mono text-[9px] uppercase text-paper-faint">
                Europe
              </span>
              <span className="absolute right-0 top-1.5 font-mono text-[9px] uppercase text-paper-faint">
                Asia
              </span>
              <div className="absolute inset-x-14 top-3 border-t border-dashed border-bosphorus/60" />
              <span className="absolute left-[52px] top-2 h-2 w-2 rounded-full bg-ferry-yellow" />
              <span className="absolute right-[52px] top-2 h-2 w-2 rounded-full bg-terracotta" />
              {/* Ferry centered on each dock dot. Dock dots are 8px wide,
                outer edge 52px from each side of the strait, so each
                dock's center is at 56px. The 30px ferry has half-width
                15px, so it centers at 56-15=41px on the yellow side and
                calc(100% - 56px - 15px) = calc(100% - 71px) on the red
                side. */}
              <span
                className="ferry-cross absolute -top-1 text-paper"
                style={
                  {
                    "--ferry-start": "41px",
                    "--ferry-end": "calc(100% - 71px)",
                    "--ferry-width": "30px",
                  } as React.CSSProperties
                }
              >
                <FerryMark />
              </span>
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-paper">
              22 min · ₺37
            </span>
          </div>
        </div>

        {/* Masthead label */}
        <div
          className="absolute end-4 top-4 min-w-[230px] border border-white/20 px-4 py-3 text-end shadow-[0_16px_48px_rgba(0,0,0,0.36)] backdrop-blur-md sm:min-w-[270px]"
          style={{ backgroundColor: "rgba(17, 16, 13, 0.88)" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#d8c5a5]">
            {t("masthead")}
          </div>
          {members !== null ? (
            <div className="mt-2 flex items-center justify-end gap-2 border-t border-white/15 pt-2 font-mono text-[13px] uppercase tracking-[0.12em] text-[#fff7e8]">
              <span className="tabular-nums" dir="ltr">
                {members.toLocaleString("en-US")}
              </span>
              <span>{t("membersLabel")}</span>
            </div>
          ) : null}
        </div>

        <div
          className="absolute bottom-4 end-4 font-mono text-[10px] uppercase tracking-wider text-paper-dim"
          dir="ltr"
        >
          41°00′N · 28°58′E
        </div>
      </div>

      {/* Masthead rule + headline + lede */}
      <Container className="pt-12 lg:pt-20">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <span className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {t("eyebrowNum")} · {t("eyebrowLabel")}
          </span>
          <span className="h-px bg-ink-4" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {t("eyebrowMeta")}
          </span>
        </div>

        <h1 className="mt-8 max-w-[16ch] font-display text-h1 text-paper sm:text-display-lg lg:text-display-xl">
          {t("headline")}
        </h1>

        <div className="mt-10 grid gap-10 pb-20 lg:grid-cols-[1fr_320px] lg:items-end">
          <p className="max-w-2xl font-display text-lede leading-relaxed text-paper-dim">
            {t("lede")}
          </p>
          <div className="flex flex-wrap gap-3 lg:justify-end rtl:lg:justify-start">
            <Link
              href="/tools/first-week-planner"
              className="bg-terracotta px-6 py-3.5 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
            >
              {t("ctaPrimary")} <span dir="ltr">{rtl ? "←" : "→"}</span>
            </Link>
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-ink-4 px-6 py-3.5 text-sm text-paper transition-colors duration-fast hover:border-ink-5"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
