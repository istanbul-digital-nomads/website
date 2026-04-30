import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { blogCoverImages } from "@/lib/blog-covers";

export const metadata: Metadata = {
  title: "Photo credits",
  description:
    "Attribution and licensing for every photo on Istanbul Nomads - sourced from Unsplash, Wikimedia Commons, generated originals, and other free-license providers.",
};

interface AttributionEntry {
  slug: string;
  neighborhood: string;
  role: "hero" | "gallery";
  src: string;
  alt: string;
  author: string;
  source: string;
  sourceHref: string;
  license: string;
  licenseHref?: string;
}

function loadAttributions(): AttributionEntry[] {
  const manifestPath = path.join(
    process.cwd(),
    "public",
    "images",
    "neighborhoods",
    "attributions.json",
  );
  if (!fs.existsSync(manifestPath)) return [];
  try {
    const raw = fs.readFileSync(manifestPath, "utf-8");
    return JSON.parse(raw) as AttributionEntry[];
  } catch {
    return [];
  }
}

export default function CreditsPage() {
  const entries = loadAttributions();
  const grouped = entries.reduce<Record<string, AttributionEntry[]>>(
    (acc, entry) => {
      (acc[entry.neighborhood] ??= []).push(entry);
      return acc;
    },
    {},
  );
  const blogCredits = Object.entries(blogCoverImages);

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
          <Link
            href="/"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1a1a2e] dark:text-[#f2f3f4]">
            Photo credits
          </span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4]">
          Photo credits
        </h1>
        <p className="mt-4 text-base leading-8 text-[#5d6d7e] dark:text-[#99a3ad]">
          Every photo on Istanbul Nomads is credited here. Neighborhood and blog
          photography is sourced from Unsplash, Wikimedia Commons, and generated
          originals made for the site. Each credit links back to the source or
          license information so you can verify usage.
        </p>

        <div className="mt-10 space-y-10">
          {blogCredits.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                Blog covers
              </h2>
              <ul className="mt-4 space-y-3">
                {blogCredits.map(([slug, image]) => (
                  <li
                    key={slug}
                    className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white/55 p-4 text-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                        {slug.replace(/-/g, " ")}
                      </span>
                      <p className="mt-1 text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {image.alt}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                      <a
                        href={image.credit.sourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-dotted underline-offset-2 hover:text-primary-600 dark:hover:text-primary-300"
                      >
                        {image.credit.author} / {image.credit.source}
                      </a>
                      <a
                        href={image.credit.licenseHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-primary-500/20 bg-primary-50/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200"
                      >
                        {image.credit.license}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {Object.keys(grouped).length === 0 ? (
            <Container>
              <p className="rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-8 text-center text-[#5d6d7e] dark:border-primary-900/30 dark:bg-primary-950/10 dark:text-[#99a3ad]">
                Photo manifest not found. Run{" "}
                <code className="rounded bg-primary-50 px-1.5 py-0.5 text-primary-800 dark:bg-primary-950/30 dark:text-primary-200">
                  pnpm tsx scripts/fetch-neighborhood-photos.ts
                </code>{" "}
                to generate it.
              </p>
            </Container>
          ) : (
            Object.entries(grouped).map(([neighborhood, items]) => (
              <div key={neighborhood}>
                <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                  {neighborhood}
                </h2>
                <ul className="mt-4 space-y-3">
                  {items.map((e) => (
                    <li
                      key={e.src}
                      className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white/55 p-4 text-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                          {e.role}
                        </span>
                        <p className="mt-1 text-[#1a1a2e] dark:text-[#f2f3f4]">
                          {e.alt}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                        <a
                          href={e.sourceHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-dotted underline-offset-2 hover:text-primary-600 dark:hover:text-primary-300"
                        >
                          {e.author} / {e.source}
                        </a>
                        {e.licenseHref ? (
                          <a
                            href={e.licenseHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-primary-500/20 bg-primary-50/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200"
                          >
                            {e.license}
                          </a>
                        ) : (
                          <span className="rounded-full border border-primary-500/20 bg-primary-50/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200">
                            {e.license}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 rounded-xl border border-primary-500/20 bg-primary-50/30 p-6 text-sm leading-7 text-[#5d6d7e] dark:border-primary-500/30 dark:bg-primary-950/20 dark:text-[#99a3ad]">
          Got a photo to contribute? We&apos;re building out community photos
          from people who actually live here. Reach out in the{" "}
          <a
            href="https://t.me/istanbul_digital_nomads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 underline dark:text-primary-400"
          >
            Telegram group
          </a>
          .
        </div>
      </div>
    </Section>
  );
}
