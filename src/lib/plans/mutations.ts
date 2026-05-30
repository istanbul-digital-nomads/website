import "server-only";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyMember, notifyMembers } from "@/lib/notifications/notify";
import type {
  PlanCreateInput,
  PlanStopInput,
  ReviewUpsertInput,
} from "./schema";
import { computeExpiresAt } from "./expiry";
import type { Database } from "@/types/database";

type PlanRow = Database["public"]["Tables"]["plans"]["Row"];

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbulnomads.com";

type AnySupabase = {
  from: (table: string) => any;
};

function asAny(client: Awaited<ReturnType<typeof createClient>>): AnySupabase {
  return client as unknown as AnySupabase;
}

function stopRow(stop: PlanStopInput, planId: string, ordinal: number) {
  return {
    plan_id: planId,
    ordinal,
    space_id: stop.space_id ?? null,
    custom_location: stop.custom_location ?? null,
    neighborhood_slug: stop.neighborhood_slug ?? null,
    lat: stop.lat ?? null,
    lng: stop.lng ?? null,
    start_time: stop.start_time ?? null,
    end_time: stop.end_time ?? null,
    vibe: stop.vibe,
    notes: stop.notes ?? null,
    // Transport applies to stops after the first.
    transport_mode: ordinal === 1 ? null : (stop.transport_mode ?? null),
    transport_price_min:
      ordinal === 1 ? null : (stop.transport_price_min ?? null),
    transport_price_max:
      ordinal === 1 ? null : (stop.transport_price_max ?? null),
    cost_min_cents: stop.cost_min_cents ?? null,
    cost_max_cents: stop.cost_max_cents ?? null,
  };
}

export async function createPlan(
  input: PlanCreateInput,
  userId: string,
): Promise<{ data: PlanRow | null; error: string | null }> {
  const supabase = await createClient();
  const sb = asAny(supabase);

  const expires_at = computeExpiresAt(
    input.scheduled_date,
    input.stops.map((s) => s.end_time ?? null),
  );

  // Phase 2/3 host snapshot. Lock in role + verification level at the
  // moment of creation so a downgraded guide's older plans still
  // display correctly.
  const { data: hostRow } = await sb
    .from("members")
    .select("member_type, verification_level")
    .eq("id", userId)
    .maybeSingle();
  const hostShape = hostRow as {
    member_type: string | null;
    verification_level: string | null;
  } | null;
  const host_role_at_creation = hostShape?.member_type ?? null;
  const host_badge_at_creation = hostShape?.verification_level ?? "basic";
  const canTicket =
    (host_role_at_creation === "local_guide" ||
      host_role_at_creation === "tour_guide") &&
    (host_badge_at_creation === "verified" ||
      host_badge_at_creation === "trusted");

  // Server-side guard: only a verified+ host role can post a ticketed
  // plan, regardless of what the client sends. The schema CHECK
  // constraint also catches mode/field combos.
  const isTicketed = Boolean(input.is_ticketed) && canTicket;

  const { data, error } = await sb
    .from("plans")
    .insert({
      creator_id: userId,
      scheduled_date: input.scheduled_date,
      title: input.title,
      capacity: input.capacity ?? null,
      language: input.language ?? "en",
      expires_at,
      is_ticketed: isTicketed,
      entry_fee_cents: isTicketed ? (input.entry_fee_cents ?? null) : null,
      budget_per_person_min_cents: isTicketed
        ? null
        : (input.budget_per_person_min_cents ?? null),
      budget_per_person_max_cents: isTicketed
        ? null
        : (input.budget_per_person_max_cents ?? null),
      currency: "TRY",
      host_role_at_creation,
      host_badge_at_creation,
    })
    .select("*")
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Failed to create plan" };
  }
  const plan = data as PlanRow;

  // Insert stops with 1-based ordinal.
  const stopRows = input.stops.map((stop, i) => stopRow(stop, plan.id, i + 1));
  const { error: stopsErr } = await sb.from("plan_stops").insert(stopRows);
  if (stopsErr) {
    // Roll back the plan row so we don't leave an orphan with zero stops.
    await sb.from("plans").delete().eq("id", plan.id);
    return { data: null, error: stopsErr.message };
  }

  // Auto-attend as host
  await sb
    .from("plan_attendees")
    .insert({ plan_id: plan.id, member_id: userId, status: "going" });

  revalidateTag("plans-today", "minutes");
  return { data: plan, error: null };
}

export async function updatePlanStops(
  planId: string,
  userId: string,
  stops: PlanStopInput[],
  scheduledDate: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const sb = asAny(supabase);

  // Verify ownership before deleting.
  const { data: plan } = await sb
    .from("plans")
    .select("id, scheduled_date")
    .eq("id", planId)
    .eq("creator_id", userId)
    .maybeSingle();
  if (!plan) return { error: "Plan not found" };

  const { error: delErr } = await sb
    .from("plan_stops")
    .delete()
    .eq("plan_id", planId);
  if (delErr) return { error: delErr.message };

  const stopRows = stops.map((stop, i) => stopRow(stop, planId, i + 1));
  const { error: insErr } = await sb.from("plan_stops").insert(stopRows);
  if (insErr) return { error: insErr.message };

  // Recompute expires_at.
  const expires_at = computeExpiresAt(
    scheduledDate,
    stops.map((s) => s.end_time ?? null),
  );
  await sb.from("plans").update({ expires_at }).eq("id", planId);

  revalidateTag("plans-today", "minutes");
  return { error: null };
}

export async function cancelPlan(planId: string, userId: string) {
  const supabase = await createClient();
  const sb = asAny(supabase);

  const { data: plan, error: readErr } = await sb
    .from("plans")
    .select("*")
    .eq("id", planId)
    .eq("creator_id", userId)
    .maybeSingle();

  if (readErr || !plan) {
    return { error: readErr?.message ?? "Plan not found" };
  }

  const { error } = await sb
    .from("plans")
    .update({ status: "cancelled" })
    .eq("id", planId)
    .eq("creator_id", userId);
  if (error) return { error: error.message };

  // Notify attendees (excluding host) that the plan was cancelled.
  const { data: attendees } = await sb
    .from("plan_attendees")
    .select("member_id")
    .eq("plan_id", planId)
    .eq("status", "going")
    .neq("member_id", userId);

  await notifyMembers(
    ((attendees ?? []) as Array<{ member_id: string }>).map((a) => a.member_id),
    {
      actorId: userId,
      category: "plan_activity",
      messageKey: "planCancelled",
      values: { title: (plan as PlanRow).title },
    },
  );

  revalidateTag("plans-today", "minutes");
  return { error: null };
}

export async function joinPlan(planId: string, userId: string) {
  const supabase = await createClient();
  const sb = asAny(supabase);

  const { data: plan, error: planErr } = await sb
    .from("plans")
    .select("id, creator_id, title, capacity")
    .eq("id", planId)
    .eq("status", "active")
    .maybeSingle();

  if (planErr || !plan) {
    return { error: planErr?.message ?? "Plan not found" };
  }

  if (plan.capacity != null) {
    const { count } = await sb
      .from("plan_attendees")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", planId)
      .eq("status", "going");
    if ((count ?? 0) >= plan.capacity) {
      return { error: "Plan is full" };
    }
  }

  const { error } = await sb
    .from("plan_attendees")
    .upsert(
      { plan_id: planId, member_id: userId, status: "going" },
      { onConflict: "plan_id,member_id" },
    );
  if (error) return { error: error.message };

  if (plan.creator_id !== userId) {
    const { data: joinerRow } = await sb
      .from("members")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle();
    await notifyMember({
      recipientId: plan.creator_id,
      actorId: userId,
      category: "plan_activity",
      messageKey: "planJoined",
      values: {
        actor: joinerRow?.display_name ?? "Someone",
        title: plan.title,
      },
      cta: { labelKey: "ctaOpenPlan", url: `${SITE}/plans/${planId}` },
    });
  }

  return { error: null };
}

export async function leavePlan(planId: string, userId: string) {
  const supabase = await createClient();
  const sb = asAny(supabase);
  const { error } = await sb
    .from("plan_attendees")
    .delete()
    .eq("plan_id", planId)
    .eq("member_id", userId);
  if (!error) {
    const [{ data: plan }, { data: actor }] = await Promise.all([
      sb
        .from("plans")
        .select("creator_id, title")
        .eq("id", planId)
        .maybeSingle(),
      sb.from("members").select("display_name").eq("id", userId).maybeSingle(),
    ]);
    if (plan?.creator_id) {
      await notifyMember({
        recipientId: plan.creator_id,
        actorId: userId,
        category: "plan_activity",
        messageKey: "planLeft",
        values: { actor: actor?.display_name ?? "Someone", title: plan.title },
        cta: { labelKey: "ctaOpenPlan", url: `${SITE}/plans/${planId}` },
      });
    }
  }
  return { error: error?.message ?? null };
}

export async function addComment(planId: string, userId: string, body: string) {
  const supabase = await createClient();
  const sb = asAny(supabase);
  const { data, error } = await sb
    .from("plan_comments")
    .insert({ plan_id: planId, author_id: userId, body })
    .select("*")
    .single();
  if (!error) {
    const [{ data: plan }, { data: actor }] = await Promise.all([
      sb
        .from("plans")
        .select("creator_id, title")
        .eq("id", planId)
        .maybeSingle(),
      sb.from("members").select("display_name").eq("id", userId).maybeSingle(),
    ]);
    if (plan?.creator_id) {
      await notifyMember({
        recipientId: plan.creator_id,
        actorId: userId,
        category: "comments",
        messageKey: "planCommented",
        values: { actor: actor?.display_name ?? "Someone", title: plan.title },
        cta: { labelKey: "ctaOpenPlan", url: `${SITE}/plans/${planId}` },
      });
    }
  }
  return { data, error: error?.message ?? null };
}

// Create or update the current user's review for a plan. Reviews are only
// allowed for nomads who attended (going) and only once the plan has ended.
// The host can't review their own plan. RLS enforces the same rules; this is
// the friendly, app-level guard with readable errors.
export async function upsertReview(
  planId: string,
  userId: string,
  input: ReviewUpsertInput,
): Promise<{ data: unknown; error: string | null }> {
  const supabase = await createClient();
  const sb = asAny(supabase);

  const { data: plan, error: planErr } = await sb
    .from("plans")
    .select("id, creator_id, title, expires_at")
    .eq("id", planId)
    .maybeSingle();
  if (planErr || !plan) {
    return { data: null, error: planErr?.message ?? "Plan not found" };
  }

  if (plan.creator_id === userId) {
    return { data: null, error: "Hosts can't review their own plan" };
  }
  if (new Date(plan.expires_at).getTime() >= Date.now()) {
    return { data: null, error: "You can review once the plan has ended" };
  }

  const { data: attendee } = await sb
    .from("plan_attendees")
    .select("member_id")
    .eq("plan_id", planId)
    .eq("member_id", userId)
    .eq("status", "going")
    .maybeSingle();
  if (!attendee) {
    return { data: null, error: "Only attendees can review this plan" };
  }

  const { data, error } = await sb
    .from("plan_reviews")
    .upsert(
      {
        plan_id: planId,
        author_id: userId,
        rating: input.rating,
        would_return: input.would_return,
        body: input.body ?? null,
      },
      { onConflict: "plan_id,author_id" },
    )
    .select("*")
    .single();
  if (error || !data) {
    return { data: null, error: error?.message ?? "Failed to save review" };
  }

  if (plan.creator_id !== userId) {
    const { data: actor } = await sb
      .from("members")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle();
    await notifyMember({
      recipientId: plan.creator_id,
      actorId: userId,
      category: "plan_activity",
      messageKey: "planReviewed",
      values: { actor: actor?.display_name ?? "Someone", title: plan.title },
      cta: { labelKey: "ctaOpenPlan", url: `${SITE}/plans/${planId}` },
    });
  }

  return { data, error: null };
}

export async function deleteReview(planId: string, userId: string) {
  const supabase = await createClient();
  const sb = asAny(supabase);
  const { error } = await sb
    .from("plan_reviews")
    .delete()
    .eq("plan_id", planId)
    .eq("author_id", userId);
  return { error: error?.message ?? null };
}
