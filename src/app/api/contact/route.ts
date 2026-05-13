import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { getTranslations } from "next-intl/server";
import { validateContactForm } from "@/lib/validations";
import { ContactFormEmail } from "@/lib/emails";
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const CONTACT_LIMIT = 3;
const CONTACT_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`contact:${ip}`, CONTACT_LIMIT, CONTACT_WINDOW_MS);
  const rlHeaders = rateLimitHeaders(rl, CONTACT_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: rlHeaders },
    );
  }

  const body = await request.json();
  const result = validateContactForm(body);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 400, headers: rlHeaders },
    );
  }

  const { name, email, message } = result.data!;
  const rawLocale =
    typeof body?.locale === "string" ? body.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  try {
    const tSubject = await getTranslations({
      locale,
      namespace: "emails.contactForm",
    });
    const subject = tSubject("subjectTemplate", { name });
    const html = await render(
      await ContactFormEmail({ name, email, message, locale }),
    );
    await getResend().emails.send({
      from: "Istanbul Nomads <noreply@istanbulnomads.com>",
      to: "hello@istanbulnomads.com",
      replyTo: email,
      subject,
      html,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500, headers: rlHeaders },
    );
  }

  return NextResponse.json(
    {
      data: {
        success: true,
        message: "Message received. We'll get back to you soon.",
      },
    },
    { headers: rlHeaders },
  );
}
