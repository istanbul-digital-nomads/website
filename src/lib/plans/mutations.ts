import "server-only";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendTelegram } from "./telegram";
import type { PlanCreateInput } from "./schema";
import { computeExpiresAt } from "./expiry";
import type { Database } from "@/types/database";

type PlanRow = Database["public"]["Tables"]["plans"]["Row"];

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbulnomads.com";

// Supabase generated types don't yet include the plans tables (migration
// 014 not applied to a typegen run). Cast via this helper, matching the
// codebase's existing pattern for un-typed tables (see queries.ts perks).
type SB = ReturnType<typeof createClient> extends Promise<infer C> ? C : never;
function asAny(client: SB) {
  return client as unknown as {
    from: (table: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
    input.end_time ?? null,
  );

  const payload = {
    creator_id: userId,
    scheduled_date: input.scheduled_date,
    start_time: input.start_time ?? null,
    end_time: input.end_time ?? null,
    space_id: input.space_id ?? null,
    neighborhood_slug: input.neighborhood_slug ?? null,
    custom_location: input.custom_location ?? null,
    title: input.title,
    vibe: input.vibe,
    notes: input.notes ?? null,
    capacity: input.capacity ?? null,
    language: input.language ?? "en",
    expires_at,
  };

  const { data, error } = await sb
    .from("plans")
    .insert(payload)
    .select("*")
    .single();

  if (error) return { data: null, error: error.message };
  const plan = data as PlanRow;

  // Auto-attend as host
  await sb
    .from("plan_attendees")
    .insert({ plan_id: plan.id, member_id: userId, status: "going" });

  revalidateTag("plans-today", "minutes");
  return { data: plan, error: null };
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

  // Notify attendees (excluding host)
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
    .select("id, creator_id, title, capacity, start_time, scheduled_date")
    .eq("id", planId)
    .eq("status", "active")
    .maybeSingle();

  if (planErr || !plan) {
    return { error: planErr?.message ?? "Plan not found" };
  }

  // Capacity check
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

  // Notify host if not joining their own plan
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

export async function addComment(
  planId: string,
  userId: string,
  body: string,
) {
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
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
