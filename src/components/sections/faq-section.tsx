"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { faqItems } from "@/lib/faq";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations("sections.faq");
  const tItems = useTranslations("faqItems");
  const tGuides = useTranslations("guides");

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-[#f2f3f4]">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              {t("intro")}
            </p>

            <div className="mt-10 divide-y divide-primary-200/30 dark:divide-[rgba(44,47,58,0.5)]">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={openIndex === index}
                      className="flex w-full items-center justify-between py-5 text-start"
                    >
                      <span className="pe-4 text-base font-medium text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {tItems(`${item.id}.question`)}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-[#5d6d7e] transition-transform duration-200 dark:text-[#99a3ad]",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-200",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-5">
                          <p className="text-sm leading-7 text-[#526e89] dark:text-[#99a3ad]">
                            {tItems(`${item.id}.answer`)}
                          </p>
                          <Link
                            href={`/guides/${item.guideSlug}`}
                            className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            {t("readGuide", {
                              guide: tGuides(`${item.guideSlug}.title`),
                            })}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
