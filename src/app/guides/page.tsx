import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Wifi,
  Home,
  Banknote,
  FileText,
  Smartphone,
  Train,
  UtensilsCrossed,
  Stethoscope,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { guides } from "@/lib/data";

export const metadata: Metadata = {
  title: "City Guides",
  description:
    "Comprehensive guides to living and working in Istanbul as a digital nomad - neighborhoods, coworking, housing, visa, cost of living, and more.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Wifi,
  Home,
  Banknote,
  FileText,
  Smartphone,
  Train,
  UtensilsCrossed,
  Stethoscope,
  Globe,
};

export default function GuidesPage() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>City Guides</SectionTitle>
        <SectionDescription>
          Everything you need to know about living and working in Istanbul as a
          digital nomad. Curated by the community.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => {
          const Icon = iconMap[guide.icon] || MapPin;
          return (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              <Card hoverable className="h-full">
                <CardContent>
                  <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <h2 className="mt-4 text-lg font-semibold">{guide.title}</h2>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {guide.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary-600 dark:text-primary-400">
                    Read guide &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
