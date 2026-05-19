import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/supabase/queries";
import { PaperworkCreateForm } from "@/components/sections/paperwork/paperwork-create-form";

export const metadata: Metadata = {
  title: "Add a paperwork service",
  robots: { index: false, follow: false },
};

export default function NewPaperworkServicePage(props: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <NewServiceContent {...props} />
    </Suspense>
  );
}

async function NewServiceContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const { data: member } = await getCurrentMember();
  if (!member) redirect("/login?next=/paperwork/new");
  // Phase 2: paperwork creation is gated to is_agent members only.
  if (!member.is_agent) redirect("/onboarding?focus=is_agent");
  // Phase 3: paid paperwork services require Blue+ verification too.
  // The API also enforces this; this just short-circuits the page
  // with a useful redirect for unverified agents.
  if (
    member.verification_level !== "verified" &&
    member.verification_level !== "trusted"
  ) {
    redirect("/dashboard/verify?next=/paperwork/new");
  }

  return <PaperworkCreateForm />;
}
