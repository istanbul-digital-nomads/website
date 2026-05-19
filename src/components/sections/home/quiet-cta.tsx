import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { socialLinks } from "@/lib/constants";
import { Container } from "@/components/ui/container";

/**
 * Design System v2 - the closing quiet CTA. One last editorial line, two
 * honest buttons, nothing loud.
 */
export function QuietCta({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.cta");

  return (
    <section className="bg-ink-1 py-32 text-center lg:py-44">
      <Container>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
          ↳ {t("kicker")}
        </p>
        <h2 className="mx-auto mt-8 max-w-4xl font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("line1")}{" "}
          <span className="italic text-terracotta">{t("line2")}</span>{" "}
          <span className="text-paper-mute">{t("line3")}</span>
        </h2>
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link
            href="/plans"
            className="group inline-flex items-center gap-1.5 bg-terracotta px-8 py-4 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
          >
            {t("primary")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink-4 px-8 py-4 text-sm text-paper transition-colors duration-fast hover:border-ink-5"
          >
            {t("secondary")}
          </a>
        </div>
      </Container>
    </section>
  );
}
