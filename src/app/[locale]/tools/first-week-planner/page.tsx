import type { Metadata } from "next";
import { FirstWeekPlanner } from "./first-week-planner";
import { parsePlannerInput } from "@/lib/first-week-planner";

export const metadata: Metadata = {
  title: "First Week Planner - Istanbul Digital Nomads",
  description:
    "Build a practical seven-day Istanbul landing plan based on your arrival profile, base neighborhood, work rhythm, social appetite, and budget comfort.",
};

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
