import { NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateContactForm(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, email, message } = result.data!;

  // TODO: Integrate with Resend email service
  console.log("[Contact Form]", { name, email, message: message.substring(0, 100) });

  return NextResponse.json({
    data: { success: true, message: "Message received. We will get back to you soon." },
  });
}
