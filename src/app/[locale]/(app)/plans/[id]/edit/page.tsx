import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { PlanCreateFlow } from "@/components/sections/plans/plan-create-flow";
import { getPlanById } from "@/lib/plans/queries";
import { getCurrentMember } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Edit plan",
  robots: { index: false, follow: false },
};

export default function EditPlanPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const [{ data: member }, { data: plan }] = await Promise.all([
    getCurrentMember(),
    getPlanById(id),
  ]);
  if (!member) redirect(`/login?next=/plans/${id}/edit`);
  if (!plan) notFound();
  // Not the host: bounce to the plan itself instead of faking a 404 -
  // the plan exists, this member just can't edit it.
  if (plan.creator_id !== member.id) redirect(`/plans/${id}`);

  return (
    <PlanCreateFlow
      initial={{
        id: plan.id,
        scheduled_date: plan.scheduled_date,
        title: plan.title,
        capacity: plan.capacity,
        stops: plan.stops.map((s) => ({
          space_id: s.space_id,
          custom_location: s.custom_location,
          neighborhood_slug: s.neighborhood_slug,
          lat: s.lat != null ? Number(s.lat) : null,
          lng: s.lng != null ? Number(s.lng) : null,
          start_time: s.start_time,
          end_time: s.end_time,
          vibe: s.vibe,
          notes: s.notes,
          transport_mode: s.transport_mode,
          transport_price_min: s.transport_price_min,
          transport_price_max: s.transport_price_max,
          cost_min_cents: s.cost_min_cents,
          cost_max_cents: s.cost_max_cents,
        })),
      }}
    />
  );
}
