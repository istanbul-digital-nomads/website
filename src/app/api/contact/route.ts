import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContactForm } from "@/lib/validations";
import { ContactFormEmail } from "@/lib/emails";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateContactForm(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, email, message } = result.data!;

  try {
    await getResend().emails.send({
      from: "Istanbul Nomads <noreply@istanbulnomads.com>",
      to: "hello@istanbulnomads.com",
      replyTo: email,
      subject: `Contact form: ${name}`,
      react: ContactFormEmail({ name, email, message }),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      success: true,
      message: "Message received. We'll get back to you soon.",
    },
  });
}
