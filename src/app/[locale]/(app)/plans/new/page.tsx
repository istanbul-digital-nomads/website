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

  // Phase 3: verification level gates the entry-fee field. Unverified
  // host-role members see a "Verify to charge" CTA instead of an
  // enabled ticketed-mode toggle.
  const verificationLevel = (member.verification_level ?? "basic") as
    | "basic"
    | "verified"
    | "trusted";

  return (
    <PlanCreateFlow hostRole={hostRole} verificationLevel={verificationLevel} />
  );
}
