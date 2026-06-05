import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { createPublicClient } from "@/lib/supabase/server";
import { devTokenStore } from "@/lib/telegram/dev-token-store";
import { sendTelegram } from "@/lib/plans/telegram";

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    from?: { username?: string };
    text?: string;
  };
}

function resolveCreds(): { url: string; token: string } | null {
  const env = process.env;
  const pairs: Array<[string | undefined, string | undefined]> = [
    [env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN],
    [env.KV_REST_API_URL, env.KV_REST_API_TOKEN],
  ];
  for (const [url, token] of pairs) {
    if (url && token) return { url, token };
  }
  return null;
}

async function consumeToken(token: string): Promise<string | null> {
  const creds = resolveCreds();
  if (creds) {
    const redis = new Redis(creds);
    const userId = await redis.get<string>(`tg-link:${token}`);
    if (userId) await redis.del(`tg-link:${token}`);
    return userId ?? null;
  }
  const entry = devTokenStore.get(token);
  if (!entry) return null;
  devTokenStore.delete(token);
  if (entry.expiresAt < Date.now()) return null;
  return entry.userId;
}

export async function POST(request: Request) {
  // Verify Telegram's secret-token header
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = request.headers.get("x-telegram-bot-api-secret-token");
  if (!expected || got !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const update = (await request
    .json()
    .catch(() => null)) as TelegramUpdate | null;
  if (!update?.message) return NextResponse.json({ ok: true });

  const chatId = update.message.chat.id;
  const text = update.message.text ?? "";

  // /start <token> flow: link the chat to a member
  const startMatch = text.match(/^\/start\s+([a-z0-9]+)/i);
  if (startMatch) {
    const token = startMatch[1];
    const userId = await consumeToken(token);
    if (!userId) {
      await sendTelegram({
        chatId,
        text: "This link expired. Open the website and click 'Connect Telegram' again.",
      });
      return NextResponse.json({ ok: true });
    }

    // Upsert subscription with service-role-less anon write under member RLS.
    // Since the webhook has no user session, use the public client; the
    // `telegram_subscriptions` row write is only safe through a service-role
    // key (which we don't expose here), so we route via a Postgres function
    // OR write the subscription using a server-side RPC. For v1, since this
    // is a small project and the webhook is secret-protected, write with
    // service role if configured, else log a warning.
    const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceUrl && serviceKey) {
      const res = await fetch(`${serviceUrl}/rest/v1/telegram_subscriptions`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          member_id: userId,
          telegram_chat_id: chatId,
        }),
      });
      if (!res.ok) {
        console.error("[telegram webhook] upsert failed", res.status);
      }
    } else {
      console.warn(
        "[telegram webhook] SUPABASE_SERVICE_ROLE_KEY not set; skipping subscription persist",
      );
    }

    await sendTelegram({
      chatId,
      text: "You're connected. I'll DM you when someone joins your plan, and an hour before each plan starts.",
    });
    return NextResponse.json({ ok: true });
  }

  // Friendly fallback
  if (text === "/start") {
    await sendTelegram({
      chatId,
      text: "Hello. Open Istanbul Nomads and click 'Connect Telegram' from your dashboard to link this chat.",
    });
  }

  return NextResponse.json({ ok: true });
}

// Keep createPublicClient import to ensure side-effect-free build.
void createPublicClient;
