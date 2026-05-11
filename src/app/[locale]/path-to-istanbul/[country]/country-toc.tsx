"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  label: string;
}

const ITEMS: TOCItem[] = [
  { id: "visa-residence-documents", label: "Visa & residence" },
  { id: "flights-arrival-money", label: "Flights & money" },
  { id: "housing-healthcare-community", label: "Housing & community" },
  { id: "guides", label: "Guides from here" },
  { id: "related", label: "Related reading" },
];

export function CountryTOC() {
  const [active, setActive] = useState<string>(ITEMS[0].id);

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

    for (const item of ITEMS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pl-4 lg:block"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#5d6d7e] dark:text-[#99a3ad]">
        On this page
      </p>
      <ul className="mt-3 space-y-2 border-l border-black/10 dark:border-white/10">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-4 text-sm transition-colors",
                active === item.id
                  ? "border-primary-500 font-medium text-primary-600 dark:text-primary-400"
                  : "border-transparent text-[#5d6d7e] hover:text-[#1a1a2e] dark:text-[#99a3ad] dark:hover:text-[#f2f3f4]",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
