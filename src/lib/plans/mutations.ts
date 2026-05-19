import "server-only";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendTelegram } from "./telegram";
import type { PlanCreateInput, PlanStopInput } from "./schema";
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

  // Phase 2 host snapshot. Lock in role + badge at the moment of
  // creation so a downgraded guide's older plans still display
  // correctly. badge stays 'basic' until Phase 3 ships verification.
  const { data: hostRow } = await sb
    .from("members")
    .select("member_type")
    .eq("id", userId)
    .maybeSingle();
  const host_role_at_creation =
    (hostRow as { member_type: string | null } | null)?.member_type ?? null;
  const canTicket =
    host_role_at_creation === "local_guide" ||
    host_role_at_creation === "tour_guide";

  // Server-side guard: even if the client form somehow posts a
  // ticketed flag for a non-host role, drop it on the floor here.
  // Phase 3 will further restrict to Blue+ verified hosts.
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
      host_badge_at_creation: "basic",
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

  // Notify attendees (excluding host).
  const { data: attendees } = await sb
    .from("plan_attendees")
    .select("member_id, member:members(display_name)")
    .eq("plan_id", planId)
    .eq("status", "going")
    .neq("member_id", userId);

  for (const a of (attendees ?? []) as Array<{
    member_id: string;
    member: { display_name: string } | null;
  }>) {
    const { data: sub } = await sb
      .from("telegram_subscriptions")
      .select("telegram_chat_id")
      .eq("member_id", a.member_id)
      .maybeSingle();
    if (sub) {
      await sendTelegram({
        chatId: sub.telegram_chat_id,
        text: `<b>Plan cancelled</b>\n"${escapeHtml((plan as PlanRow).title)}" was cancelled by the host.`,
      });
    }
  }

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
    const [{ data: joinerRow }, { data: hostSub }] = await Promise.all([
      sb.from("members").select("display_name").eq("id", userId).maybeSingle(),
      sb
        .from("telegram_subscriptions")
        .select("telegram_chat_id")
        .eq("member_id", plan.creator_id)
        .maybeSingle(),
    ]);

    if (hostSub) {
      const joinerName = joinerRow?.display_name ?? "Someone";
      await sendTelegram({
        chatId: hostSub.telegram_chat_id,
        text: `<b>${escapeHtml(joinerName)}</b> joined your plan "${escapeHtml(plan.title)}".`,
        cta: { text: "Open plan", url: `${SITE}/plans/${planId}` },
      });
    }
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
  return { data, error: error?.message ?? null };
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
