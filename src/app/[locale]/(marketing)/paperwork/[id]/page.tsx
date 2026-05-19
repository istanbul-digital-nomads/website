import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Clock, Languages, MapPin } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { getPaperworkServiceById } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { SERVICE_ICONS, isServiceType } from "@/lib/paperwork";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { isVerificationLevel } from "@/lib/verification";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: service } = await getPaperworkServiceById(id);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description?.slice(0, 160) ?? service.title,
  };
}

export default function PaperworkDetailPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <Detail {...props} />
    </Suspense>
  );
}

async function Detail({ params }: Props) {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: service } = await getPaperworkServiceById(id);
  if (!service) notFound();

  const t = await getTranslations({ locale, namespace: "paperworkPage" });
  const tType = await getTranslations({
    locale,
    namespace: "paperworkPage.serviceTypes",
  });
  const tVerifyLevels = await getTranslations({
    locale,
    namespace: "verification.levels",
  });
  const tVerifyTooltips = await getTranslations({
    locale,
    namespace: "verification.tooltips",
  });
  const hostLevel = isVerificationLevel(service.host?.verification_level)
    ? service.host.verification_level
    : "basic";

  const Icon = isServiceType(service.service_type)
    ? SERVICE_ICONS[service.service_type]
    : SERVICE_ICONS.other;
  const lira = (service.price_cents / 100).toLocaleString(locale);

  return (
    <section className="bg-deep-water text-cream">
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cream/55">
          <Link href="/paperwork" className="hover:text-cream">
            {t("eyebrow")}
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/paperwork?type=${service.service_type}`}
            className="hover:text-cream"
          >
            {tType(service.service_type)}
          </Link>
        </nav>

        <div className="mt-8 flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-moss/15 text-moss">
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="font-editorial text-3xl leading-tight text-cream md:text-5xl">
              {service.title}
            </h1>
            <div className="mt-2 font-mono text-[13px] tracking-[0.04em] text-gold">
              {lira} TL{" "}
              {service.duration_estimate_minutes ? (
                <span className="text-cream/55">
                  · ~{service.duration_estimate_minutes}m
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {service.description ? (
          <p className="mt-8 whitespace-pre-line text-[15px] leading-[1.7] text-cream/85">
            {service.description}
          </p>
        ) : null}

        <dl className="mt-10 grid gap-4 md:grid-cols-2">
          {service.languages.length > 0 ? (
            <div className="rounded-xl border border-cream/10 bg-ink-1/40 p-4">
              <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cream/55">
                <Languages className="h-3.5 w-3.5" aria-hidden />
                {t("languagesLabel")}
              </dt>
              <dd className="mt-2 text-[14px] text-cream/85">
                {service.languages.join(" · ")}
              </dd>
            </div>
          ) : null}
          {service.neighborhoods.length > 0 ? (
            <div className="rounded-xl border border-cream/10 bg-ink-1/40 p-4">
              <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cream/55">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {t("neighborhoodsLabel")}
              </dt>
              <dd className="mt-2 text-[14px] text-cream/85">
                {service.neighborhoods.join(" · ")}
              </dd>
            </div>
          ) : null}
          {service.duration_estimate_minutes ? (
            <div className="rounded-xl border border-cream/10 bg-ink-1/40 p-4">
              <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cream/55">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {t("durationLabel")}
              </dt>
              <dd className="mt-2 text-[14px] text-cream/85">
                ~{service.duration_estimate_minutes} {t("minutesShort")}
              </dd>
            </div>
          ) : null}
        </dl>

        {service.host ? (
          <div className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-ink-1/40 p-5">
            <div className="flex items-center gap-3">
              {service.host.avatar_url ? (
                <Image
                  src={service.host.avatar_url}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <span className="inline-block h-12 w-12 rounded-full bg-cream/10" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] text-cream">
                    {service.host.display_name}
                  </p>
                  <VerificationBadge
                    level={hostLevel}
                    label={tVerifyLevels(hostLevel)}
                    tooltip={tVerifyTooltips(hostLevel)}
                  />
                </div>
                <Link
                  href={`/members/${service.host.id}`}
                  className="text-[12px] text-cream/55 hover:text-cream"
                >
                  {t("viewProfile")}
                </Link>
              </div>
            </div>
            {service.host.telegram_handle ? (
              <a
                href={`https://t.me/${service.host.telegram_handle.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-ink-0 transition-colors hover:bg-terracotta-dim"
              >
                {t("contactCta")} <span aria-hidden>→</span>
              </a>
            ) : null}
          </div>
        ) : null}

        <p className="mt-6 text-[12px] leading-[1.55] text-cream/50">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
