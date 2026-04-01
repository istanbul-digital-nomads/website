import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { guides } from "@/lib/data";

interface GuidePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) notFound();

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#6b6257] dark:text-[#b8a898]">
          <Link
            href="/"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/guides"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            Guides
          </Link>
          <span>/</span>
          <span className="text-[#2a2018] dark:text-[#f7f2ea]">
            {guide.title}
          </span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight">{guide.title}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          {guide.description}
        </p>

        <div className="mt-12 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
          <p className="text-neutral-500">
            We&apos;re writing this guide with input from the community. Check
            back soon.
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            Know something useful? Share it in the{" "}
            <a
              href="https://t.me/istanbul_digital_nomads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline dark:text-primary-400"
            >
              Telegram group
            </a>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
