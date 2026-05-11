import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FirstWeekPlanner } from "./first-week-planner";
import { parsePlannerInput } from "@/lib/first-week-planner";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("firstWeekPlanner.meta");
  return {
    title: t("title"),
    description: t("description"),
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
