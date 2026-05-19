import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PlanCreateFlow } from "@/components/sections/plans/plan-create-flow";
import { getCurrentMember } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Share a plan",
  robots: { index: false, follow: false },
};

export default function NewPlanPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <NewPlanContent {...props} />
    </Suspense>
  );
}

async function NewPlanContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const { data: member } = await getCurrentMember();
  if (!member) redirect("/login?next=/plans/new");

  // Phase 2: pass host role so the form knows whether to expose the
  // ticketed-mode option. local_guide + tour_guide can charge entry
  // fees (UI present, server-side gate enforces); other roles only
  // see the budget mode.
  const hostRole = (member.member_type ?? null) as
    | "nomad"
    | "remote_worker"
    | "local_guide"
    | "tour_guide"
    | null;

  return <PlanCreateFlow hostRole={hostRole} />;
}
