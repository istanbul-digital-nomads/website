import "server-only";
import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendTelegram } from "@/lib/plans/telegram";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

// Central Telegram notifier. Every social-action notification goes through
// here so the gating (master switch + per-category toggle), recipient lookup,
// and localization live in one place.
//
// Uses the SERVICE-ROLE client on purpose: the actor (e.g. a commenter) needs
// to read the RECIPIENT's telegram_subscriptions + member prefs, which the
// own-row-only RLS on those tables forbids for the auth client. (The old
// inline join/cancel sends used the auth client and were silently RLS-blocked.)

export type NotifyCategory =
  | "plan_activity"
  | "comments"
  | "tickets"
  | "events"
  | "reminders";

const CATEGORY_COLUMN: Record<NotifyCategory, string> = {
  plan_activity: "notify_plan_activity",
  comments: "notify_comments",
  tickets: "notify_tickets",
  events: "notify_events",
  reminders: "notify_reminders",
};

type LooseClient = { from: (table: string) => any };

interface NotifyArgs {
  /** Member to DM. */
  recipientId: string;
  /** Actor who triggered the action; skipped if it equals the recipient. */
  actorId?: string | null;
  category: NotifyCategory;
  /** Key under the `telegramNotifications` i18n namespace. */
  messageKey: string;
  /** ICU placeholder values for the message (e.g. { actor, title }). */
  values?: Record<string, string | number>;
  /** Optional inline button: localized label key + absolute URL. */
  cta?: { labelKey: string; url: string };
}

/**
 * Send one localized Telegram DM, respecting the recipient's preferences.
 * Best-effort: any failure (no subscription, toggle off, Telegram error) is
 * swallowed so the calling mutation is never blocked.
 */
export async function notifyMember(args: NotifyArgs): Promise<void> {
  try {
    const { recipientId, actorId, category, messageKey, values, cta } = args;
    if (!recipientId) return;
    if (actorId && actorId === recipientId) return; // never self-notify

    const supabase = createServiceClient() as unknown as LooseClient;
    const column = CATEGORY_COLUMN[category];

    const { data: member } = await supabase
      .from("members")
      .select(`notify_telegram, ${column}, preferred_locale`)
      .eq("id", recipientId)
      .maybeSingle();
    if (!member) return;
    if (member.notify_telegram === false) return;
    if (member[column] === false) return;

    const { data: sub } = await supabase
      .from("telegram_subscriptions")
      .select("telegram_chat_id")
      .eq("member_id", recipientId)
      .maybeSingle();
    if (!sub?.telegram_chat_id) return;

    const locale = isValidLocale(member.preferred_locale)
      ? member.preferred_locale
      : defaultLocale;
    const t = await getTranslations({
      locale,
      namespace: "telegramNotifications",
    });
    const text = t(messageKey, values ?? {});
    const ctaOut = cta ? { text: t(cta.labelKey), url: cta.url } : undefined;

    // Plain text: localized messages interpolate untrusted titles/names, so we
    // skip HTML parse mode to avoid escaping bugs and next-intl tag parsing.
    await sendTelegram({
      chatId: sub.telegram_chat_id,
      text,
      cta: ctaOut,
      parseMode: "plain",
    });
  } catch (err) {
    console.error("[notify] failed", err);
  }
}

/** Fan-out helper: notify many recipients with the same message. */
export async function notifyMembers(
  recipientIds: string[],
  args: Omit<NotifyArgs, "recipientId">,
): Promise<void> {
  await Promise.all(
    recipientIds.map((recipientId) => notifyMember({ ...args, recipientId })),
  );
}
