import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "Istanbul Nomads made my transition to Istanbul so much easier. Found a flat, coworking buddies, and real friends within my first month.",
    name: "Sarah K.",
    role: "UX Designer, Berlin",
  },
  {
    quote:
      "The weekly coworking sessions are a highlight of my week. Great vibe, great people, and the guides saved me hours of research.",
    name: "Marco T.",
    role: "Software Engineer, Lisbon",
  },
  {
    quote:
      "I came for a month and stayed for a year. This community is the reason Istanbul became my home base.",
    name: "Aiko M.",
    role: "Content Creator, Tokyo",
  },
];

export function Testimonials() {
  return (
    <Section className="bg-neutral-50 dark:bg-neutral-900/50">
      <SectionHeader>
        <SectionTitle>What Nomads Say</SectionTitle>
        <SectionDescription>
          Stories from remote workers who found their place in Istanbul.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name}>
            <CardContent>
              <p className="text-neutral-700 dark:text-neutral-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
