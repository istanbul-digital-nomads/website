import { Send, Users, Heart } from "lucide-react";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";

const steps = [
  {
    icon: Send,
    title: "Join the Telegram",
    description:
      "Introduce yourself in the group chat. Ask questions, share tips, and connect with other nomads.",
  },
  {
    icon: Users,
    title: "Come to a meetup",
    description:
      "Join our weekly coworking sessions, social events, or workshops. Everyone is welcome.",
  },
  {
    icon: Heart,
    title: "Be part of the community",
    description:
      "Build friendships, collaborate on projects, and make Istanbul feel like home.",
  },
];

export function HowItWorks() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>How It Works</SectionTitle>
        <SectionDescription>
          Three simple steps to become part of Istanbul&apos;s nomad community.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-12 md:grid-cols-3">
        {steps.map((step, idx) => (
          <div key={step.title} className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
              <step.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400">
              Step {idx + 1}
            </div>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
