import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getAllBlogPosts, getAllTags } from "@/lib/blog";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { BlogListing } from "./blog-listing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "blogIndexPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/blog"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale, "/blog"),
      type: "website",
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
  const t = await getTranslations("blogIndexPage");
  const posts = getAllBlogPosts(locale);
  const allTags = getAllTags(locale);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              {t("hero.intro")}
            </p>
          </div>

          <BlogListing posts={posts} allTags={allTags} />
        </Reveal>
      </Container>
    </section>
  );
}
