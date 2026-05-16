import "server-only";

const API_BASE = "https://api.telegram.org";

interface SendOptions {
  chatId: number;
  text: string;
  /** Inline button [{ text, url }] pair. */
  cta?: { text: string; url: string };
}

/**
 * Send a Telegram DM via Bot API. No-op (logs a warning) when
 * TELEGRAM_BOT_TOKEN isn't configured, so local dev and previews don't crash.
 */
export async function sendTelegram({
  chatId,
  text,
  cta,
}: SendOptions): Promise<{ ok: boolean; reason?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN not set; skipping notification",
      { chatId, text },
    );
    return { ok: false, reason: "no-token" };
  }

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (cta) {
    body.reply_markup = {
      inline_keyboard: [[{ text: cta.text, url: cta.url }]],
    };
  }

  try {
    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[telegram] send failed", res.status, errText);
      return { ok: false, reason: `http-${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[telegram] send threw", err);
    return { ok: false, reason: "exception" };
  }
}

/**
 * Set a webhook URL for the bot. Called manually during deploy or via a
 * one-shot script; included here for completeness.
 */
export async function setWebhook(url: string, secret: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, reason: "no-token" };
  const res = await fetch(`${API_BASE}/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, secret_token: secret }),
  });
  return { ok: res.ok };
}
