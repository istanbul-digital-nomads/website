import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "./onboarding-wizard";

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description: "Fill out your member profile to join Istanbul Digital Nomads.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await (supabase.from("members") as any)
    .select("display_name, email, avatar_url, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (!member) {
    redirect("/login");
  }

  if (member.onboarding_completed) {
    redirect("/");
  }

  return (
    <OnboardingWizard
      initialData={{
        display_name: (member.display_name as string) || "",
        email: (member.email as string) || user.email || "",
        avatar_url:
          (member.avatar_url as string) || user.user_metadata?.avatar_url || "",
      }}
    />
  );
}
