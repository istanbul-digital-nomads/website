import Link from "next/link";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { getEventsPublic } from "@/lib/supabase/queries";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * Design System v2 - "Upcoming". A tight editorial row-list of the next
 * events, pulled live from Supabase. Each row is the unit, not a card.
 * Falls back to a calm "nothing scheduled" state when the table is empty.
 */
export async function EventsStrip({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.events");
  const { data } = await getEventsPublic({ past: false, limit: 6 });
  const events = data ?? [];

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "2-digit",
    timeZone: "Europe/Istanbul",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Istanbul",
  });

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <Container>
        <SectionEyebrow num="N° 06" label={t("eyebrow")} />

        <h2 className="mt-8 font-display text-display-lg leading-tight text-paper">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h2>

        <div className="mt-12 border border-ink-3">
          {events.length > 0 ? (
            events.map((event, i) => (
              <Link
                key={event.id}
                href="/events"
                className="grid grid-cols-[5rem_4rem_auto_1fr_auto] items-center gap-4 px-6 py-5 transition-colors hover:bg-ink-2 sm:gap-8"
                style={{
                  borderTop: i === 0 ? undefined : "1px solid rgb(var(--ink-3))",
                }}
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                  {dateFmt.format(new Date(event.date))}
                </span>
                <span className="font-mono text-base tabular-nums text-paper">
                  {timeFmt.format(new Date(event.date))}
                </span>
                <span className="hidden border border-ink-4 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wider text-paper-mute sm:inline-block">
                  {event.type}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-h4 text-paper">
                    {event.title}
                  </span>
                  {event.location_name ? (
                    <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                      {event.location_name}
                    </span>
                  ) : null}
                </span>
                <span className="text-sm text-terracotta">
                  {t("rsvp")} →
                </span>
              </Link>
            ))
          ) : (
            <div className="px-6 py-10">
              <p className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                {t("emptyEyebrow")}
              </p>
              <p className="mt-3 max-w-xl font-display text-h3 text-paper">
                {t("emptyTitle")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-paper-faint">
            {t("note")}
          </span>
          <Link
            href="/events"
            className="text-sm text-terracotta border-b border-terracotta pb-0.5"
          >
            {t("allEvents")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
