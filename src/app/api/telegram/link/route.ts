import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Redis } from "@upstash/redis";

const TOKEN_TTL_SECONDS = 600; // 10 min

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

function randomToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return NextResponse.json(
      { error: "Telegram bot not configured" },
      { status: 503 },
    );
  }

  const token = randomToken();
  const creds = resolveCreds();
  if (creds) {
    const redis = new Redis(creds);
    await redis.set(`tg-link:${token}`, user.id, { ex: TOKEN_TTL_SECONDS });
  } else {
    // Local dev fallback: in-memory map per process (best-effort).
    devTokenStore.set(token, {
      userId: user.id,
      expiresAt: Date.now() + TOKEN_TTL_SECONDS * 1000,
    });
  }

  return NextResponse.json({
    data: {
      url: `https://t.me/${botUsername}?start=${token}`,
      expires_in: TOKEN_TTL_SECONDS,
    },
  });
}

// Exported so the webhook can read it when Upstash isn't configured.
// Module-scope map; resets on cold start (fine for local dev only).
export const devTokenStore = new Map<
  string,
  { userId: string; expiresAt: number }
>();
