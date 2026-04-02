import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if onboarding is completed
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: member } = await (supabase.from("members") as any)
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        // Redirect to onboarding if not completed
        if (!member?.onboarding_completed) {
          const forwardedHost = request.headers.get("x-forwarded-host");
          const isLocalEnv = process.env.NODE_ENV === "development";
          if (isLocalEnv) {
            return NextResponse.redirect(`${origin}/onboarding`);
          } else if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}/onboarding`);
          } else {
            return NextResponse.redirect(`${origin}/onboarding`);
          }
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Auth error - redirect to home with error
  return NextResponse.redirect(`${origin}/?error=auth`);
}
