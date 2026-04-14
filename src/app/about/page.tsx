import type { Metadata } from "next";
import { Heart, HelpCircle, Sparkles, PartyPopper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { socialLinks } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Istanbul Digital Nomads - how we started, what we believe in, and the people who make it happen.",
};

const values = [
  {
    icon: Heart,
    title: "Inclusive",
    description:
      "Everyone is welcome regardless of background, skill level, or how long they plan to stay.",
  },
  {
    icon: HelpCircle,
    title: "Helpful",
    description:
      "We share knowledge freely - from visa tips to the best cafes. No question is too basic.",
  },
  {
    icon: Sparkles,
    title: "Authentic",
    description:
      "Real connections over networking. We value genuine relationships and honest recommendations.",
  },
  {
    icon: PartyPopper,
    title: "Fun",
    description:
      "Life as a nomad should be enjoyable. We balance productivity with exploration and social events.",
  },
];

const team = [
  {
    name: "Ali",
    role: "Founder",
    bio: "Full-stack developer who moved to Istanbul in early 2026 and started this community to help the next person land easier.",
  },
  {
    name: "Dina",
    role: "Events Organizer",
    bio: "Product designer who organizes weekly coworking sessions and monthly socials.",
  },
  {
    name: "Kerem",
    role: "Local Guide",
    bio: "Istanbul native and freelance translator. Bridges the gap between nomads and local culture.",
  },
];

const timeline = [
  { year: "Feb 2026", event: "Decided to move to Turkey" },
  { year: "Mar 2026", event: "Started the Istanbul Digital Nomads idea" },
  { year: "Apr 2026", event: "Website launched" },
  {
    year: "Q2 2026",
    event: "First community meetup (planned)",
    upcoming: true,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Story */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Our Story
          </h1>
          <div className="mt-6 space-y-4 text-lg text-neutral-600 dark:text-[#85929e]">
            <p>
              Istanbul Digital Nomads is a brand-new community, started in 2026
              by one person who decided to make the move and wanted to build the
              thing that didn&apos;t exist yet for the next people coming.
            </p>
            <p>
              The decision came in February 2026. The idea took shape in March.
              The website went live in April. The first meetup is planned for
              Q2. That&apos;s the whole story so far - we&apos;re writing the
              rest with whoever shows up.
            </p>
            <p>
              Istanbul is one of the best cities in the world for remote work -
              affordable, culturally rich, extremely well-connected, and full of
              energy. Our mission is to make the transition easier and the
              experience richer for every nomad who comes here.
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-neutral-50 dark:bg-[#1a1d27]/50">
        <SectionHeader>
          <SectionTitle>What We Believe In</SectionTitle>
          <SectionDescription>
            The principles that guide our community.
          </SectionDescription>
        </SectionHeader>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title}>
              <CardContent>
                <v.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-[#85929e]">
                  {v.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader>
          <SectionTitle>The Team</SectionTitle>
          <SectionDescription>
            The people who keep the community running.
          </SectionDescription>
        </SectionHeader>
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name}>
              <CardContent>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {member.name[0]}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {member.role}
                </p>
                <p className="mt-2 text-sm text-neutral-600 dark:text-[#85929e]">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section className="bg-neutral-50 dark:bg-[#1a1d27]/50">
        <SectionHeader>
          <SectionTitle>Milestones</SectionTitle>
          <SectionDescription>Our journey so far.</SectionDescription>
        </SectionHeader>
        <div className="mx-auto max-w-xl">
          <div className="space-y-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={
                      item.upcoming
                        ? "h-3 w-3 rounded-full border-2 border-primary-600 bg-transparent dark:border-primary-400"
                        : "h-3 w-3 rounded-full bg-primary-600 dark:bg-primary-400"
                    }
                  />
                  {idx < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-neutral-300 dark:bg-[#3a302a]" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {item.year}
                  </span>
                  <p className="mt-1 text-neutral-700 dark:text-[#99a3ad]">
                    {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
