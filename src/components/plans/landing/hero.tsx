import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { socialLinks } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { PlansTodayCounter } from "../plans-today-counter";

export async function PlansLandingHero({
  isAuthed,
}: {
  isAuthed: boolean;
}) {
  const t = await getTranslations("plans.landing");

  return (
    <section className="border-b border-ink-3 bg-ink-1 pb-16 pt-12 lg:pb-24 lg:pt-20">
      <Container>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
          <span className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            N° 06 · {t("eyebrowLabel")}
          </span>
          <span className="h-px bg-ink-4" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {t("eyebrowMeta")}
          </span>
        </div>

        <h1 className="mt-8 max-w-[18ch] font-display text-h1 text-paper lg:text-display-xl">
          {t("headline")}
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <p className="max-w-2xl font-display text-lede leading-relaxed text-paper-dim">
            {t("lede")}
          </p>
          <PlansTodayCounter />
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {isAuthed ? (
            <Link
              href="/plans/new"
              className="bg-terracotta px-6 py-3.5 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
            >
              {t("ctaShare")}
            </Link>
          ) : (
            <Link
              href="/login?next=/plans"
              className="bg-terracotta px-6 py-3.5 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
            >
              {t("ctaSignIn")}
            </Link>
          )}
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink-4 px-6 py-3.5 text-sm text-paper transition-colors duration-fast hover:border-ink-5"
          >
            {t("ctaTelegram")}
          </a>
        </div>
      </Container>
    </section>
  );
}
