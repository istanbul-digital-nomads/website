import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { createClient } from "@/lib/supabase/server";
import { validateGuideApplication } from "@/lib/validations";
import { GuideApplicationEmail } from "@/lib/emails";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateGuideApplication(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const application = result.data!;
  const supabase = await createClient();

  const { error: dbError } = await (
    supabase.from("guide_applications") as any
  ).insert({
    name: application.name,
    email: application.email,
    phone_whatsapp: application.phone_whatsapp || null,
    languages: application.languages,
    specializations: application.specializations,
    neighborhoods: application.neighborhoods,
    years_in_istanbul: application.years_in_istanbul,
    bio: application.bio,
    sample_tip: application.sample_tip,
    motivation: application.motivation,
    social_instagram: application.social_instagram || null,
    social_linkedin: application.social_linkedin || null,
    social_twitter: application.social_twitter || null,
    social_website: application.social_website || null,
    photo_url: application.photo_url || null,
    agrees_guidelines: application.agrees_guidelines,
    references_text: application.references_text || null,
    origin_countries: application.origin_countries || [],
  });

  if (dbError) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  // Send notification email (non-fatal - application is already saved)
  try {
    const html = await render(
      GuideApplicationEmail({
        name: application.name,
        email: application.email,
        specializations: application.specializations,
        neighborhoods: application.neighborhoods,
        languages: application.languages,
        years_in_istanbul: application.years_in_istanbul,
        bio: application.bio,
        motivation: application.motivation,
        sample_tip: application.sample_tip,
      }),
    );
    await getResend().emails.send({
      from: "Istanbul Nomads <noreply@istanbulnomads.com>",
      to: "hello@istanbulnomads.com",
      replyTo: application.email,
      subject: `Local guide candidate: ${application.name}`,
      html,
    });
  } catch {
    // Email failed but application is saved - that's okay
  }

  return NextResponse.json({
    data: {
      success: true,
      message: "Application received! We'll review it and get back to you.",
    },
  });
}
