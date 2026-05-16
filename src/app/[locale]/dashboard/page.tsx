import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getCurrentMember } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <DashboardContent {...props} />
    </Suspense>
  );
}

async function DashboardContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const { data: member } = await getCurrentMember();
  if (!member) {
    redirect("/login?next=/dashboard");
  }

  const t = getCachedTranslations(locale, "membersV2.dashboard");

  // Profile completeness from real fields only - a gentle nudge, not a score.
  const fields: [string, boolean][] = [
    [t("fields.bio"), Boolean(member.bio)],
    [t("fields.location"), Boolean(member.location)],
    [t("fields.profession"), Boolean(member.profession)],
    [t("fields.skills"), Boolean(member.skills && member.skills.length > 0)],
    [
      t("fields.languages"),
      Boolean(member.languages && member.languages.length > 0),
    ],
    [t("fields.visible"), member.is_visible],
  ];
  const done = fields.filter(([, ok]) => ok).length;

  const links: [string, string][] = [
    [t("links.directory"), "/members"],
    [t("links.profile"), `/members/${member.id}`],
    [t("links.events"), "/events"],
    [t("links.editProfile"), "/onboarding"],
  ];

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        {/* Masthead */}
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("greeting", { name: member.display_name })}
        </h1>
        <p className="mt-6 font-mono text-[12px] uppercase tracking-wider text-paper-mute">
          {[member.profession, member.location].filter(Boolean).join(" · ") ||
            t("noMeta")}
        </p>

        <div className="mt-14 grid gap-8 pb-24 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Profile completeness */}
          <div className="border border-ink-3 bg-ink-2 p-7">
            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                {t("profileEyebrow")}
              </h2>
              <span className="font-mono text-sm tabular-nums text-paper">
                {done}
                <span className="text-paper-faint">/{fields.length}</span>
              </span>
            </div>
            <ul className="mt-5">
              {fields.map(([label, ok]) => (
                <li
                  key={label}
                  className="flex items-center justify-between border-b border-ink-3 py-2.5"
                >
                  <span className="text-sm text-paper-dim">{label}</span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider ${
                      ok ? "text-moss" : "text-paper-faint"
                    }`}
                  >
                    {ok ? t("done") : t("todo")}
                  </span>
                </li>
              ))}
            </ul>
            {done < fields.length ? (
              <Link
                href="/onboarding"
                className="mt-6 inline-flex items-center gap-1.5 border-b border-terracotta pb-0.5 text-sm text-terracotta"
              >
                {t("completeProfile")}{" "}
                <span className="inline-dir-arrow" aria-hidden />
              </Link>
            ) : null}
          </div>

          {/* Quick links */}
          <div className="border border-ink-3 bg-ink-2 p-7">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
              {t("linksEyebrow")}
            </h2>
            <ul className="mt-4">
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center justify-between border-b border-ink-3 py-3 text-sm text-paper transition-colors hover:text-terracotta"
                  >
                    {label}
                    <span className="inline-dir-arrow" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
