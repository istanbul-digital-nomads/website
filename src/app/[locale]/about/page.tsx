import type { Metadata } from "next";
import Image from "next/image";
import { Heart, HelpCircle, Sparkles, PartyPopper } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { MilestonesTimeline } from "./milestones-timeline";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const valueKeys = [
  { key: "inclusive", icon: Heart },
  { key: "helpful", icon: HelpCircle },
  { key: "authentic", icon: Sparkles },
  { key: "fun", icon: PartyPopper },
] as const;

const teamMembers = [
  { id: "ali", name: "Ali" },
  { id: "dina", name: "Dina" },
  { id: "kerem", name: "Kerem" },
] as const;

export default function AboutPage() {
  const tSite = useTranslations("site");
  const tStory = useTranslations("about.story");
  const tValues = useTranslations("about.values");
  const tValueItems = useTranslations("about.values.items");
  const tTeam = useTranslations("about.team");
  const tMembers = useTranslations("about.team.members");
  const tMilestones = useTranslations("about.milestones");

  return (
    <>
      <Section className="overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 scale-110 rounded-full bg-primary-500/10 blur-3xl" />
            <Image
              src="/images/logo-light.png"
              alt={tSite("shortName")}
              width={220}
              height={280}
              className="relative block drop-shadow-[0_0_40px_rgba(192,57,43,0.25)] dark:hidden"
              priority
            />
            <Image
              src="/images/logo-dark.png"
              alt={tSite("shortName")}
              width={220}
              height={280}
              className="relative hidden drop-shadow-[0_0_40px_rgba(192,57,43,0.35)] dark:block"
              priority
            />
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {tSite("name")}
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400">
            {tSite("tagline")}
          </p>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {tStory("title")}
          </h2>
          <div className="mt-6 space-y-4 text-lg text-neutral-600 dark:text-[#85929e]">
            <p>{tStory("p1")}</p>
            <p>{tStory("p2")}</p>
            <p>{tStory("p3")}</p>
          </div>
        </div>
      </Section>

      <Section className="bg-neutral-50 dark:bg-[#1a1d27]/50">
        <SectionHeader>
          <SectionTitle>{tValues("title")}</SectionTitle>
          <SectionDescription>{tValues("description")}</SectionDescription>
        </SectionHeader>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueKeys.map((v) => (
            <Card key={v.key}>
              <CardContent>
                <v.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <h3 className="mt-4 font-semibold">
                  {tValueItems(`${v.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-[#85929e]">
                  {tValueItems(`${v.key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>{tTeam("title")}</SectionTitle>
          <SectionDescription>{tTeam("description")}</SectionDescription>
        </SectionHeader>
        <div className="grid gap-6 md:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {member.name[0]}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {tMembers(`${member.id}.role`)}
                </p>
                <p className="mt-2 text-sm text-neutral-600 dark:text-[#85929e]">
                  {tMembers(`${member.id}.bio`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-neutral-50 dark:bg-[#1a1d27]/50">
        <SectionHeader>
          <SectionTitle>{tMilestones("title")}</SectionTitle>
          <SectionDescription>{tMilestones("description")}</SectionDescription>
        </SectionHeader>
        <MilestonesTimeline />
      </Section>

      <CtaBanner />
    </>
  );
}
