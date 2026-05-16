import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getMemberByIdPublic } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Tag } from "@/components/ui/tag";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  const { data: member } = await getMemberByIdPublic(id);
  if (!member) return {};
  return {
    title: member.display_name,
    description: member.bio?.slice(0, 160) ?? member.display_name,
  };
}

export default async function MemberProfilePage(props: Props) {
  return (
    <Suspense fallback={null}>
      <MemberProfileContent {...props} />
    </Suspense>
  );
}

async function MemberProfileContent(props: Props) {
  const { locale: rawLocale, id } = await props.params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: member } = await getMemberByIdPublic(id);
  if (!member) notFound();

  const t = getCachedTranslations(locale, "membersV2");
  const initial = (member.display_name || "?").trim().charAt(0).toUpperCase();

  return (
    <section className="bg-ink-1 pt-12 lg:pt-16">
      <Container>
        <nav className="flex flex-wrap gap-2.5 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          <Link href="/members" className="hover:text-paper">
            {t("eyebrow")}
          </Link>
          <span>/</span>
          <span className="text-paper">{member.display_name}</span>
        </nav>

        <div className="mt-10 grid gap-12 pb-24 lg:grid-cols-[280px_1fr] lg:items-start">
          {/* Avatar + meta */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden border border-ink-4 bg-ink-3">
              {member.avatar_url ? (
                <Image
                  src={member.avatar_url}
                  alt={member.display_name}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-display text-7xl text-paper-faint">
                  {initial}
                </span>
              )}
            </div>
            <dl className="mt-5 border-t border-ink-3">
              {member.location ? (
                <Fact label={t("profile.location")} value={member.location} />
              ) : null}
              {member.profession ? (
                <Fact
                  label={t("profile.profession")}
                  value={member.profession}
                />
              ) : null}
              {member.member_type ? (
                <Fact label={t("profile.type")} value={member.member_type} />
              ) : null}
            </dl>
            {member.telegram_handle ? (
              <a
                href={`https://t.me/${member.telegram_handle.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 bg-terracotta px-5 py-3.5 text-center text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
              >
                {t("profile.reachOut")}{" "}
                <span className="inline-dir-arrow" aria-hidden />
              </a>
            ) : null}
          </div>

          {/* Bio + skills + languages */}
          <div>
            <SectionEyebrow num="N° 01" label={t("profile.aboutEyebrow")} />
            <h1 className="mt-6 font-display text-display-lg leading-none text-paper">
              {member.display_name}
            </h1>
            {member.bio ? (
              <p className="mt-6 max-w-2xl text-lede leading-relaxed text-paper-dim">
                {member.bio}
              </p>
            ) : (
              <p className="mt-6 text-base text-paper-mute">
                {t("profile.noBio")}
              </p>
            )}

            {member.skills && member.skills.length > 0 ? (
              <div className="mt-10 border-t border-ink-3 pt-8">
                <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                  {t("profile.skills")}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
              </div>
            ) : null}

            {member.languages && member.languages.length > 0 ? (
              <div className="mt-8 border-t border-ink-3 pt-8">
                <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                  {t("profile.languages")}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.languages.map((lang) => (
                    <Tag key={lang}>{lang}</Tag>
                  ))}
                </div>
              </div>
            ) : null}

            {member.website ? (
              <p className="mt-8 border-t border-ink-3 pt-8">
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-terracotta pb-0.5 text-sm text-terracotta"
                >
                  {member.website.replace(/^https?:\/\//, "")}{" "}
                  <span className="inline-dir-arrow" aria-hidden />
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink-3 py-2.5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
        {label}
      </dt>
      <dd className="text-right text-[12px] text-paper">{value}</dd>
    </div>
  );
}
