import { getTranslations } from "next-intl/server";
import { renderOgImage } from "@/lib/og-image";
import { renderPlanOgImage } from "@/lib/og-plan";
import { getPlanById } from "@/lib/plans/queries";
import { planNeighborhoods, planDateLabel } from "@/lib/plans/share";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

// Canonical, redirect-free OG card for a plan (1200x630). Lives under /api so
// the URL stays locale-less - the colocated [locale]/.../opengraph-image route
// emits a `/en/...` URL that 307-redirects (proxy strips the default locale),
// and strict social scrapers can fail to follow a redirecting og:image. The
// plan's generateMetadata points og:image / twitter:image straight here.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rawLocale =
    new URL(request.url).searchParams.get("locale") ?? defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const tOg = await getTranslations({ locale, namespace: "og" });
  const tPlans = await getTranslations({ locale, namespace: "plans" });
  const { data: plan } = await getPlanById(id);

  if (!plan) {
    return renderOgImage({
      locale,
      category: tOg("plan.category"),
      title: tPlans("meta.title"),
      tagline: tOg("tagline"),
    });
  }

  return renderPlanOgImage({
    locale,
    title: plan.title,
    hostName: plan.host?.display_name ?? "Istanbul Nomads",
    avatarUrl: plan.host?.avatar_url,
    dateLabel: planDateLabel(plan.scheduled_date, locale),
    neighborhoods: planNeighborhoods(plan),
    stopsLabel: tPlans("stops", { count: plan.stops.length }),
    goingLabel: `${plan.attendee_count} ${tPlans("capacity.going")}`,
    category: tOg("plan.category"),
    tagline: tOg("tagline"),
  });
}
