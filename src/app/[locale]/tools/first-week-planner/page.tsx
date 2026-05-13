import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FirstWeekPlanner } from "./first-week-planner";
import { parsePlannerInput } from "@/lib/first-week-planner";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: "firstWeekPlanner.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/tools/first-week-planner"),
  };
}

interface Props {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function FirstWeekPlannerPage({ searchParams = {} }: Props) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.set(key, value);
    }
  });

  return <FirstWeekPlanner initialInput={parsePlannerInput(params)} />;
}
