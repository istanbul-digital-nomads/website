import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { renderPlanStoryImage } from "@/lib/og-plan-story";
import { getPlanById } from "@/lib/plans/queries";
import {
  planNeighborhoods,
  planDateLabel,
  planStopName,
  planStopTime,
} from "@/lib/plans/share";
import { getOrCreateShortLink } from "@/lib/short-links";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

const SITE_HOST = "istanbulnomads.com";

// Portrait story image (1080x1920) for Instagram/TikTok stories. Fetched by the
// share sheet, then handed to navigator.share({ files }) or downloaded.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const rawLocale = url.searchParams.get("locale") ?? defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const { data: plan } = await getPlanById(id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const tOg = await getTranslations({ locale, namespace: "og" });
  const tPlans = await getTranslations({ locale, namespace: "plans" });

  // Same short link the share sheet copies, so the printed URL matches.
  const link = await getOrCreateShortLink({
    kind: "plan",
    entityId: id,
    targetPath: `/plans/${id}`,
  });
  const shortUrl =
    "code" in link ? `${SITE_HOST}/s/${link.code}` : `${SITE_HOST}/plans`;

  const stops = plan.stops.map((s) => ({
    name: planStopName(s),
    time: planStopTime(s.start_time, s.end_time),
  }));
  const remaining = Math.max(0, plan.stops.length - 4);

  return renderPlanStoryImage({
    locale,
    title: plan.title,
    hostName: plan.host?.display_name ?? "Istanbul Nomads",
    avatarUrl: plan.host?.avatar_url,
    dateLabel: planDateLabel(plan.scheduled_date, locale),
    neighborhoods: planNeighborhoods(plan),
    stops,
    stopsTotal: plan.stops.length,
    shortUrl,
    category: tOg("plan.category"),
    storyCta: tOg("plan.storyCta"),
    moreLabel: remaining > 0 ? `+${remaining}` : undefined,
    tagline: tOg("tagline"),
  });
}
