import type { Metadata } from "next";
import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Community stories, Istanbul tips, nomad interviews, and remote work insights.",
};

export default function BlogPage() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Blog</SectionTitle>
        <SectionDescription>
          Community stories, Istanbul tips, and remote work insights.
        </SectionDescription>
      </SectionHeader>
      <div className="mx-auto max-w-xl rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
        <p className="text-neutral-500">
          Blog posts are on the way. We&apos;re writing about coworking spots,
          visa tips, and what it&apos;s actually like to live here.
        </p>
      </div>
    </Section>
  );
}
