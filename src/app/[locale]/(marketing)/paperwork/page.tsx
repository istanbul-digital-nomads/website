import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import {
  getPaperworkServicesPublic,
  type PaperworkServicePublic,
} from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import {
  SERVICE_TYPES,
  SERVICE_ICONS,
  isServiceType,
  type ServiceType,
} from "@/lib/paperwork";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; host?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "paperworkPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/paperwork"),
  };
}

export default function PaperworkIndexPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <PaperworkIndex {...props} />
    </Suspense>
  );
}

async function PaperworkIndex({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  const { type: typeParam, host: hostParam } = await searchParams;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const activeType: ServiceType | null = isServiceType(typeParam)
    ? typeParam
    : null;

  const { data: services } = await getPaperworkServicesPublic({
    service_type: activeType ?? undefined,
    host_id: hostParam,
  });

  const t = await getTranslations({ locale, namespace: "paperworkPage" });
  const tType = await getTranslations({
    locale,
    namespace: "paperworkPage.serviceTypes",
  });

  // Group by service_type for the directory grid.
  const grouped = SERVICE_TYPES.map((st) => ({
    type: st,
    items: services.filter((s) => s.service_type === st),
  })).filter(({ items }) => items.length > 0 || !activeType);

  return (
    <section className="bg-deep-water text-cream">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
          {t("eyebrow")}
        </span>
        <h1
          className="mt-3 font-editorial text-cream"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
          }}
        >
          {t("headlineA")}{" "}
          <em className="italic text-gold">{t("headlineB")}</em>
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.6] text-cream/70">
          {t("lede")}
        </p>

        {/* Type filter chips */}
        <nav
          aria-label={t("filterAria")}
          className="mt-10 flex flex-wrap items-center gap-2"
        >
          <Link
            href="/paperwork"
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
              activeType === null
                ? "border-moss bg-moss/15 text-moss"
                : "border-cream/15 text-cream/55 hover:border-cream/30 hover:text-cream"
            }`}
          >
            {t("filterAll")}
          </Link>
          {SERVICE_TYPES.map((st) => {
            const Icon = SERVICE_ICONS[st];
            const isActive = activeType === st;
            return (
              <Link
                key={st}
                href={`/paperwork?type=${st}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? "border-moss bg-moss/15 text-moss"
                    : "border-cream/15 text-cream/55 hover:border-cream/30 hover:text-cream"
                }`}
              >
                <Icon className="h-3 w-3" aria-hidden />
                {tType(st)}
              </Link>
            );
          })}
        </nav>

        {services.length === 0 ? (
          <div className="mt-16 rounded-xl border border-cream/15 bg-ink-1/40 p-8 text-center">
            <h2 className="font-editorial text-2xl text-cream">
              {t("emptyTitle")}
            </h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-cream/65">
              {t("emptyBody")}
            </p>
          </div>
        ) : (
          <div className="mt-14 flex flex-col gap-12">
            {grouped.map(({ type, items }) => {
              if (items.length === 0) return null;
              return (
                <section key={type}>
                  <h2 className="font-editorial text-2xl text-cream">
                    {tType(type)}
                  </h2>
                  <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((s) => (
                      <li key={s.id}>
                        <ServiceCard service={s} locale={locale} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  locale,
}: {
  service: PaperworkServicePublic;
  locale: Locale;
}) {
  const lira = (service.price_cents / 100).toLocaleString(locale);
  return (
    <Link
      href={`/paperwork/${service.id}`}
      className="block rounded-xl border border-cream/10 bg-ink-1/40 p-4 transition-colors hover:border-moss/40 hover:bg-ink-1/70"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-editorial text-[19px] leading-tight text-cream">
          {service.title}
        </h3>
        <span className="shrink-0 font-mono text-[13px] tracking-[0.04em] text-gold">
          {lira} TL
        </span>
      </div>
      {service.description ? (
        <p className="mt-2 text-[13px] leading-[1.55] text-cream/65 line-clamp-3">
          {service.description}
        </p>
      ) : null}
      <div className="mt-4 flex items-center gap-2">
        {service.host?.avatar_url ? (
          <Image
            src={service.host.avatar_url}
            alt=""
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <span className="inline-block h-6 w-6 rounded-full bg-cream/10" />
        )}
        <span className="text-[12px] text-cream/65">
          {service.host?.display_name ?? "-"}
        </span>
      </div>
    </Link>
  );
}
