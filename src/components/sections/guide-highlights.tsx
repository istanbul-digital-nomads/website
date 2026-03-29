import Link from "next/link";
import { MapPin, Wifi, Home, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";

const guides = [
  {
    title: "Neighborhoods",
    description: "Find the perfect area to live and work in Istanbul.",
    href: "/guides/neighborhoods",
    icon: MapPin,
  },
  {
    title: "Coworking Spaces",
    description: "Best cafes and coworking spots with reliable wifi.",
    href: "/guides/coworking",
    icon: Wifi,
  },
  {
    title: "Housing",
    description: "How to find an apartment, what to expect, and fair prices.",
    href: "/guides/housing",
    icon: Home,
  },
  {
    title: "Cost of Living",
    description: "Monthly budgets for different lifestyles in Istanbul.",
    href: "/guides/cost-of-living",
    icon: Banknote,
  },
];

export function GuideHighlights() {
  return (
    <Section className="bg-neutral-50 dark:bg-neutral-900/50">
      <SectionHeader>
        <SectionTitle>City Guides</SectionTitle>
        <SectionDescription>
          Everything you need to know about living and working in Istanbul.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((guide) => (
          <Link key={guide.href} href={guide.href}>
            <Card hoverable className="h-full">
              <CardContent>
                <guide.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <h3 className="mt-4 font-semibold">{guide.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {guide.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
