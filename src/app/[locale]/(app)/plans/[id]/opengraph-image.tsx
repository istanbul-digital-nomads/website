import { getTranslations } from "next-intl/server";
import { ogSize, ogContentType, renderOgImage } from "@/lib/og-image";
import { renderPlanOgImage } from "@/lib/og-plan";
import { getPlanById } from "@/lib/plans/queries";
import { planNeighborhoods, planDateLabel } from "@/lib/plans/share";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Nomads Plan";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function Image({ params }: Props) {
  const { locale: rawLocale, id } = await params;
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
