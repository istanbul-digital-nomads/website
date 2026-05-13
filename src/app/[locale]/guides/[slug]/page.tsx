import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { guides } from "@/lib/data";
import { getGuideContent } from "@/lib/guides";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { mdxComponents } from "@/components/ui/mdx-components";
import { formatDate } from "@/lib/utils";
import { mdxOptions } from "@/lib/mdx-options";

interface GuidePageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) return {};
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = await getTranslations({ locale, namespace: "guides" });
  return {
    title: t(`${guide.slug}.title`),
    description: t(`${guide.slug}.description`),
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) notFound();

  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const guideContent = getGuideContent(params.slug, locale);
  const t = await getTranslations({ locale, namespace: "guides" });
  const tPage = await getTranslations({
    locale,
    namespace: "guideDetailPage",
  });
  const localizedTitle = t(`${guide.slug}.title`);
  const localizedDescription = t(`${guide.slug}.description`);

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
          <Link
            href="/"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {tPage("breadcrumb.home")}
          </Link>
          <span>/</span>
          <Link
            href="/guides"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {tPage("breadcrumb.guides")}
          </Link>
          <span>/</span>
          <span className="text-[#1a1a2e] dark:text-[#f2f3f4]">
            {localizedTitle}
          </span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4]">
          {localizedTitle}
        </h1>
        <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
          {guideContent?.frontmatter.description || localizedDescription}
        </p>

        {guideContent?.frontmatter.lastUpdated && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
            <Calendar className="h-4 w-4" />
            {tPage("lastUpdatedTemplate", {
              date: formatDate(
                guideContent.frontmatter.lastUpdated,
                undefined,
                locale,
              ),
            })}
          </div>
        )}

        {guideContent ? (
          <article className="mt-10">
            <MDXRemote
              source={guideContent.content}
              components={mdxComponents}
              options={mdxOptions}
            />
          </article>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-12 text-center dark:border-primary-900/30 dark:bg-primary-950/10">
            <p className="text-[#5d6d7e] dark:text-[#99a3ad]">
              {tPage("comingSoon")}
            </p>
            <p className="mt-2 text-sm text-[#5d6d7e]/70 dark:text-[#99a3ad]/70">
              {tPage("contributeIntro")}{" "}
              <a
                href="https://t.me/istanbul_digital_nomads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 underline dark:text-primary-400"
              >
                {tPage("telegramLinkText")}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
