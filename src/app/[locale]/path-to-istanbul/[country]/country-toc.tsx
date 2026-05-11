"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const ITEM_KEYS = ["visa", "flights", "housing", "guides", "related"] as const;

const ID_BY_KEY: Record<(typeof ITEM_KEYS)[number], string> = {
  visa: "visa-residence-documents",
  flights: "flights-arrival-money",
  housing: "housing-healthcare-community",
  guides: "guides",
  related: "related",
};

export function CountryTOC() {
  const t = useTranslations("countryPage.toc");
  const [active, setActive] = useState<string>(ID_BY_KEY[ITEM_KEYS[0]]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -65% 0px", threshold: 0 },
    );

    for (const key of ITEM_KEYS) {
      const el = document.getElementById(ID_BY_KEY[key]);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pl-4 lg:block"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#5d6d7e] dark:text-[#99a3ad]">
        {t("title")}
      </p>
      <ul className="mt-3 space-y-2 border-l border-black/10 dark:border-white/10">
        {ITEM_KEYS.map((key) => {
          const id = ID_BY_KEY[key];
          return (
            <li key={key}>
              <a
                href={`#${id}`}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-4 text-sm transition-colors",
                  active === id
                    ? "border-primary-500 font-medium text-primary-600 dark:text-primary-400"
                    : "border-transparent text-[#5d6d7e] hover:text-[#1a1a2e] dark:text-[#99a3ad] dark:hover:text-[#f2f3f4]",
                )}
              >
                {t(`items.${key}`)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
