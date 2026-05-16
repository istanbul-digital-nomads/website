import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PlanCreateForm } from "@/components/plans/plan-create-form";
import { getCurrentMember } from "@/lib/supabase/queries";
import { spaces } from "@/lib/spaces";
import { neighborhoods } from "@/lib/neighborhoods";
import {
  defaultLocale,
  isValidLocale,
  type Locale,
} from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Share a plan",
  robots: { index: false, follow: false },
};

export default function NewPlanPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <NewPlanContent {...props} />
    </Suspense>
  );
}

async function NewPlanContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: member } = await getCurrentMember();
  if (!member) redirect("/login?next=/plans/new");

  const t = await getTranslations("plans.create");
  const tHoods = await getTranslations({
    locale,
    namespace: "neighborhoodList",
  });

  const spaceOptions = spaces
    .filter((s) => s.status !== "closed")
    .map((s) => ({
      id: s.id,
      name: s.name,
      neighborhood: s.neighborhood,
    }));

  const hoodOptions = neighborhoods.map((n) => ({
    slug: n.slug,
    name: tHoods(`${n.slug}.name`),
  }));

  return (
    <section className="bg-ink-0 py-16 lg:py-24">
      <Container className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-display-lg text-paper">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-paper-dim">{t("intro")}</p>

        <div className="mt-10">
          <PlanCreateForm spaces={spaceOptions} neighborhoods={hoodOptions} />
        </div>
      </Container>
    </section>
  );
}
