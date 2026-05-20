import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditor } from "./profile-editor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profileEditor");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function ProfileEditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/profile");
  }

  const { data: member } = await (supabase.from("members") as any)
    .select("*")
    .eq("id", user.id)
    .single();

  if (!member) {
    redirect("/login");
  }

  return (
    <ProfileEditor
      member={member as Record<string, unknown>}
      email={(member.email as string) || user.email || ""}
    />
  );
}
