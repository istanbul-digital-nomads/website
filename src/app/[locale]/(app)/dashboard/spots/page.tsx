import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Database } from "@/types/database";
import { SpotsList } from "./spots-list";

export const metadata: Metadata = {
  title: "Spots to visit",
  robots: { index: false, follow: false },
};

type SavedSpot = Database["public"]["Tables"]["saved_spots"]["Row"];

export default function SpotsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <SpotsContent {...props} />
    </Suspense>
  );
}

async function SpotsContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const { data: member } = await getCurrentMember();
  if (!member) {
    redirect("/login?next=/dashboard/spots");
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_spots")
    .select("*")
    .eq("member_id", member.id)
    .order("created_at", { ascending: false });
  const spots = (data ?? []) as SavedSpot[];

  const t = getCachedTranslations(locale, "dashboardSpots");

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-xl text-sm text-paper-dim">{t("intro")}</p>

        <div className="mt-12 max-w-2xl pb-24">
          <SpotsList spots={spots} />
        </div>
      </Container>
    </section>
  );
}
