import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "./onboarding-wizard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("onboardingPage.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await (supabase.from("members") as any)
    .select("*")
    .eq("id", user.id)
    .single();

  if (!member) {
    redirect("/login");
  }

  // Already-completed members can re-enter this page to edit their profile.
  // The wizard re-saves on submit (onboarding_completed stays true).
  return (
    <OnboardingWizard
      initialData={{
        display_name: (member.display_name as string) || "",
        email: (member.email as string) || user.email || "",
        avatar_url:
          (member.avatar_url as string) || user.user_metadata?.avatar_url || "",
      }}
      existing={member}
    />
  );
}
