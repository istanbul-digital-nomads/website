import { NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateContactForm(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, email, message } = result.data!;

  // Resend email integration pending - for now, accept and acknowledge
  void name;
  void email;
  void message;

  return NextResponse.json({
    data: { success: true, message: "Message received. We will get back to you soon." },
  });
}
