import type { Metadata } from "next";
import { Send, Github, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { socialLinks } from "@/lib/constants";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { ContactForm } from "./contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "contactPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/contact"),
  };
}

const quickLinkKeys = [
  { key: "telegram", href: socialLinks.telegram, icon: Send },
  { key: "github", href: socialLinks.github, icon: Github },
  { key: "email", href: `mailto:${socialLinks.email}`, icon: Mail },
] as const;

const faqKeys = ["free", "shortTerm", "tech", "events", "organize"] as const;

export default async function ContactPage() {
  const tHero = await getTranslations("contactPage.hero");
  const tQuick = await getTranslations("contactPage.quickLinks");
  const tFaq = await getTranslations("contactPage.faq");
  const tFaqItems = await getTranslations("contactPage.faq.items");

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>{tHero("title")}</SectionTitle>
          <SectionDescription>{tHero("description")}</SectionDescription>
        </SectionHeader>

        <div className="grid gap-8 lg:grid-cols-2">
          <ContactForm />

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{tQuick("heading")}</h3>
            {quickLinkKeys.map((link) => (
              <a
                key={link.key}
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
                      <h4 className="font-medium">
                        {tQuick(`${link.key}.title`)}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-[#85929e]">
                        {tQuick(`${link.key}.description`)}
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
      <Section className="bg-neutral-50 dark:bg-[#1a1d27]/50">
        <SectionHeader>
          <SectionTitle>{tFaq("title")}</SectionTitle>
        </SectionHeader>
        <div className="mx-auto max-w-2xl space-y-6">
          {faqKeys.map((key) => (
            <div key={key}>
              <h3 className="font-semibold">{tFaqItems(`${key}.q`)}</h3>
              <p className="mt-1 text-neutral-600 dark:text-[#85929e]">
                {tFaqItems(`${key}.a`)}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
