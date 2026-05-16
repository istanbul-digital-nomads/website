import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Edit plan",
  robots: { index: false, follow: false },
};

export default function EditPlanPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const { data: member } = await getCurrentMember();
  if (!member) redirect(`/login?next=/plans/${id}/edit`);

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data: plan } = await sb
    .from("plans")
    .select("*")
    .eq("id", id)
    .eq("creator_id", member.id)
    .maybeSingle();

  if (!plan) notFound();

  const t = await getTranslations("plans.edit");

  return (
    <section className="bg-ink-0 py-16 lg:py-24">
      <Container className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-display-lg text-paper">
          {plan.title}
        </h1>
        <p className="mt-3 text-sm text-paper-dim">{t("intro")}</p>

        <div className="mt-8 space-y-3 border border-ink-3 bg-ink-1 p-6">
          <p className="text-sm text-paper-dim">{t("editComingSoon")}</p>
          <p className="text-xs text-paper-mute">{t("editComingSoonHint")}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/plans/${plan.id}`}
            className="border border-ink-4 px-5 py-2.5 text-sm text-paper transition-colors hover:border-ink-5"
          >
            {t("back")}
          </Link>
          <form
            action={async () => {
              "use server";
              const client = await createClient();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (client as any)
                .from("plans")
                .update({ status: "cancelled" })
                .eq("id", plan.id)
                .eq("creator_id", member.id);
              redirect("/plans");
            }}
          >
            <Button variant="danger" type="submit">
              {t("cancelPlan")}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
