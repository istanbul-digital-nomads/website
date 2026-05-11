import type { Metadata } from "next";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { RelocationAgentShell } from "./relocation-agent-shell";

export const metadata: Metadata = {
  title: "Plan your move to Istanbul",
  description:
    "Tell us how you live and we'll lay out the neighbourhood, the budget, and the first month - using only what we've actually verified on the ground.",
  alternates: { canonical: "/relocation-agent" },
  openGraph: {
    title: "Plan your move to Istanbul",
    description:
      "Personalised neighbourhood pick, monthly budget, and first-month checklist for digital nomads moving to Istanbul.",
    url: "https://istanbulnomads.com/relocation-agent",
    siteName: "Istanbul Digital Nomads",
    type: "website",
  },
};

export default function RelocationAgentPage() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Plan your move to Istanbul</SectionTitle>
        <SectionDescription>
          Tell us how you live and we&apos;ll lay out the neighbourhood, the
          budget, and the first month - using only what we&apos;ve actually
          verified on the ground.
        </SectionDescription>
      </SectionHeader>

      <div className="mx-auto max-w-3xl">
        <RelocationAgentShell />
      </div>
    </Section>
  );
}
