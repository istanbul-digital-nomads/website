import type { Metadata } from "next";
import { Send, Github, Mail, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { socialLinks } from "@/lib/constants";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Istanbul Digital Nomads. Reach us via Telegram, email, or the contact form.",
};

const quickLinks = [
  {
    title: "Telegram",
    description: "The fastest way to reach us and the community.",
    href: socialLinks.telegram,
    icon: Send,
  },
  {
    title: "GitHub",
    description: "Report issues, contribute, or explore our repos.",
    href: socialLinks.github,
    icon: Github,
  },
  {
    title: "Email",
    description: "For partnerships, press, or private inquiries.",
    href: `mailto:${socialLinks.email}`,
    icon: Mail,
  },
];

const faqs = [
  {
    q: "Is the community free to join?",
    a: "Yes, completely free. Just join our Telegram group and introduce yourself.",
  },
  {
    q: "I'm visiting Istanbul for a week - can I still join events?",
    a: "Absolutely. Short-term visitors are welcome at all our events.",
  },
  {
    q: "Do I need to be a developer or work in tech?",
    a: "Not at all. We have designers, writers, marketers, founders, and more. Anyone who works remotely is welcome.",
  },
  {
    q: "How do I find out about upcoming events?",
    a: "Events are posted in the Telegram group and on our Events page. We also send a weekly digest.",
  },
  {
    q: "Can I organize an event?",
    a: "Yes! Reach out in the Telegram group or via this form. We love community-led events.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>Contact Us</SectionTitle>
          <SectionDescription>
            Questions, ideas, or feedback - we&apos;d like to hear it.
          </SectionDescription>
        </SectionHeader>

        <div className="grid gap-8 lg:grid-cols-2">
          <ContactForm />

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            {quickLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card hoverable className="mb-4">
                  <CardContent className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <link.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{link.title}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {link.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-neutral-50 dark:bg-neutral-900/50">
        <SectionHeader>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
        </SectionHeader>
        <div className="mx-auto max-w-2xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
