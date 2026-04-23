import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createClient } from "@/lib/supabase/server";
import { NewsletterWelcomeEmail } from "@/lib/emails";
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const NEWSLETTER_LIMIT = 5;
const NEWSLETTER_WINDOW_MS = 60_000;

// Unified response - do not leak whether an email is already in our DB.
// Same message whether we insert a new row or find an existing one.
// Real validation errors (malformed email) still return 400 because those
// reflect user typos, not enumeration.
const UNIFIED_SUCCESS = {
  data: {
    success: true,
    message:
      "Thanks - if this email isn't already subscribed, a welcome message is on its way.",
  },
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(
    `newsletter:${ip}`,
    NEWSLETTER_LIMIT,
    NEWSLETTER_WINDOW_MS,
  );
  const rlHeaders = rateLimitHeaders(rl, NEWSLETTER_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: rlHeaders },
    );
  }

  const body = await request.json();
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400, headers: rlHeaders },
    );
  }

  const supabase = await createClient();

  const { data: existing } = await (
    supabase.from("newsletter_subscribers") as any
  )
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json(UNIFIED_SUCCESS, { headers: rlHeaders });
  }

  const { error: dbError } = await (
    supabase.from("newsletter_subscribers") as any
  ).insert({ email });

  if (dbError) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: rlHeaders },
    );
  }

  try {
    const html = await render(NewsletterWelcomeEmail());
    const { error: emailError } = await getResend().emails.send({
      from: "Istanbul Nomads <noreply@istanbulnomads.com>",
      to: email,
      subject: "Welcome to Istanbul Digital Nomads",
      html,
    });
    if (emailError) {
      console.error("Resend newsletter error:", emailError);
    }
  } catch (err) {
    console.error("Newsletter email failed:", err);
  }

  return NextResponse.json(UNIFIED_SUCCESS, { headers: rlHeaders });
}
