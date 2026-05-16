import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PlanCreateFlow } from "@/components/plans/plan-create-flow";
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

  return <PlanCreateFlow />;
}
