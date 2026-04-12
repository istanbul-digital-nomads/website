import type { Metadata } from "next";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { GuideApplicationForm } from "./guide-application-form";

export const metadata: Metadata = {
  title: "Become a Local Guide",
  description:
    "Apply to become a local guide for Istanbul Digital Nomads. Help newcomers navigate neighborhoods, housing, visa, and more.",
};

export default function JoinAsGuidePage() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Become a local guide</SectionTitle>
        <SectionDescription>
          Know Istanbul well enough to help someone skip their first-month
          confusion? Tell us about yourself and what you can help with.
          We&apos;ll review your application within a few days.
        </SectionDescription>
      </SectionHeader>

      <div className="mx-auto max-w-2xl">
        <GuideApplicationForm />
      </div>
    </Section>
  );
}
