import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createClient } from "@/lib/supabase/server";
import { NewsletterWelcomeEmail } from "@/lib/emails";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
  const body = await request.json();
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
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
    return NextResponse.json({
      data: { success: true, message: "You're already subscribed!" },
    });
  }

  const { error: dbError } = await (
    supabase.from("newsletter_subscribers") as any
  ).insert({ email });

  if (dbError) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
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

  return NextResponse.json({
    data: {
      success: true,
      message: "You're in! Check your inbox for a welcome email.",
    },
  });
}
