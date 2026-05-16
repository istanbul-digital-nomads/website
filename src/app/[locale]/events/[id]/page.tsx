import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getEventByIdPublic } from "@/lib/supabase/queries";
import { isStripeConfigured } from "@/lib/stripe";
import { getEventPhoto } from "@/lib/editorial-photos";
import { socialLinks } from "@/lib/constants";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { Tag } from "@/components/ui/tag";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

// No generateStaticParams: events live in Supabase and the table may be
// empty at build time. The route renders on-demand - `getEventByIdPublic`
// is a `use cache` function, so the data is still cached per id and the
// page content is wrapped in <Suspense>.

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: rawLocale, id } = await props.params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: event } = await getEventByIdPublic(id);
  if (!event) return {};
  const tDetail = await getTranslations({
    locale,
    namespace: "eventsV2.detail",
  });
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: tDetail("metaPrefix", { title: event.title }),
      description: event.description.slice(0, 160),
      type: "website",
    },
  };
}

export default async function EventDetailPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <EventDetailContent {...props} />
    </Suspense>
  );
}

async function EventDetailContent(props: Props) {
  const { locale: rawLocale, id } = await props.params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: event } = await getEventByIdPublic(id);
  if (!event) notFound();

  const t = getCachedTranslations(locale, "eventsV2");
  const tList = getCachedTranslations(locale, "eventsPage.list");

  const start = new Date(event.date);
  const dateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Istanbul",
  });

  const isPaid = typeof event.price_try === "number" && event.price_try > 0;
  const isPast = start.getTime() < Date.now();
  const photo = getEventPhoto(event);
  // Paid events route through Stripe Checkout once it's provisioned; until
  // then they fall back to the free Telegram RSVP path (see lib/stripe.ts).
  const paidCheckoutLive = isPaid && isStripeConfigured();

  const facts: [string, string][] = [
    [t("detail.date"), dateFmt.format(start)],
    [t("detail.time"), timeFmt.format(start)],
    [t("detail.location"), event.location_name],
    [
      t("detail.price"),
      isPaid ? `₺${event.price_try!.toLocaleString("en-US")}` : t("free"),
    ],
    [
      t("detail.seats"),
      event.capacity
        ? tList("spots", { count: event.capacity })
        : t("detail.openSeats"),
    ],
  ];

  return (
    <section className="bg-ink-1 pt-12 lg:pt-16">
      <Container>
        <nav className="flex flex-wrap gap-2.5 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          <Link href="/events" className="hover:text-paper">
            {t("eyebrow")}
          </Link>
          <span>/</span>
          <span className="text-paper">{event.title}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* Main */}
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag>{tList(`types.${event.type}`)}</Tag>
              {event.kind ? <Tag>{event.kind}</Tag> : null}
              {isPast ? <Tag>{t("detail.pastTag")}</Tag> : null}
            </div>
            <h1 className="mt-6 font-display text-display-lg leading-none text-paper">
              {event.title}
            </h1>
            <p className="mt-6 font-mono text-[12px] uppercase tracking-wider text-paper-mute">
              {dateFmt.format(start)} · {timeFmt.format(start)} ·{" "}
              {event.location_name}
            </p>

            <PhotoSlot
              kind="street"
              src={photo.src}
              alt={photo.alt}
              credit={photo.credit}
              objectPosition={photo.objectPosition}
              corner={tList(`types.${event.type}`)}
              caption={event.location_name}
              className="mt-10 h-72 lg:h-96"
            />

            <div className="mt-10 border-t border-ink-3 pt-10">
              <SectionEyebrow num="N° 01" label={t("detail.aboutEyebrow")} />
              <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-paper-dim">
                {event.description}
              </p>
              {event.location_address ? (
                <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
                  ↳ {event.location_address}
                </p>
              ) : null}
            </div>
          </div>

          {/* Booking panel */}
          <aside className="border border-ink-3 bg-ink-2 p-7 lg:sticky lg:top-24">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-paper-mute">
              {isPaid ? t("detail.bookEyebrow") : t("detail.rsvpEyebrow")}
            </div>
            <div className="mt-3 font-display text-h2 text-paper">
              {isPaid
                ? `₺${event.price_try!.toLocaleString("en-US")}`
                : t("free")}
            </div>

            <dl className="mt-6 border-t border-ink-3">
              {facts.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-ink-3 py-2.5"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                    {label}
                  </dt>
                  <dd className="text-right font-mono text-[12px] tabular-nums text-paper">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {isPast ? (
              <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                {t("detail.pastNote")}
              </p>
            ) : (
              <>
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block bg-terracotta px-6 py-4 text-center text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
                >
                  {paidCheckoutLive
                    ? t("detail.book")
                    : t("detail.rsvpTelegram")}{" "}
                  →
                </a>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                  {isPaid && !paidCheckoutLive
                    ? t("detail.paidFallbackNote")
                    : t("detail.rsvpNote")}
                </p>
              </>
            )}
          </aside>
        </div>

        <div className="mt-20 border-t border-ink-3 py-10">
          <Link
            href="/events"
            className="border-b border-terracotta pb-0.5 text-sm text-terracotta"
          >
            {t("detail.allEvents")} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
