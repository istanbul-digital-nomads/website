import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getMembersPublic } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { MemberCard } from "@/components/sections/members/member-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "membersV2" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/members"),
  };
}

export default async function MembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getCachedTranslations(locale, "membersV2");
  const { data } = await getMembersPublic();
  const members = data ?? [];

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 max-w-3xl font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
          {t("lede")}
        </p>

        <div className="mt-14 pb-24">
          {members.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="border border-ink-3 bg-ink-2 px-6 py-12">
              <p className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                {t("emptyEyebrow")}
              </p>
              <p className="mt-3 max-w-xl font-display text-h3 text-paper">
                {t("emptyTitle")}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
