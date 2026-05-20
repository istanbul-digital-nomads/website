"use client";

import { useMemo, useState } from "react";
import { Link } from "@/lib/i18n/routing";
import {
  Search,
  ChevronDown,
  ArrowRight,
  Compass,
  CalendarDays,
  BadgeCheck,
  FileText,
  ShieldCheck,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HelpSearchItem } from "@/lib/help-search";

// Browse + search in one. Empty query shows the browse view (platform-doc
// cards + category-grouped FAQ accordion). Typing filters across docs,
// FAQ, and city guides in-memory. All text arrives pre-translated from
// the server, so this component is pure presentation.

const DOC_ICONS: Record<string, LucideIcon> = {
  Compass,
  CalendarDays,
  BadgeCheck,
  FileText,
  ShieldCheck,
  HeartHandshake,
};

export interface DocCard {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  href: string;
}

export interface FaqGroup {
  category: string;
  label: string;
  items: FaqEntry[];
}

export interface HelpExplorerProps {
  searchItems: HelpSearchItem[];
  docCards: DocCard[];
  faqGroups: FaqGroup[];
  labels: {
    searchPlaceholder: string;
    docsTitle: string;
    faqTitle: string;
    learnMore: string;
    noResults: string;
    resultsTitle: string;
    kindFaq: string;
    kindDoc: string;
    kindGuide: string;
    cityNote: string;
    cityCta: string;
  };
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
}

export function HelpExplorer({
  searchItems,
  docCards,
  faqGroups,
  labels,
}: HelpExplorerProps) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return null;
    return searchItems.filter((it) => {
      const hay = normalize(
        `${it.title} ${it.subtitle ?? ""} ${(it.keywords ?? []).join(" ")}`,
      );
      return hay.includes(q);
    });
  }, [query, searchItems]);

  const kindLabel = (kind: HelpSearchItem["kind"]) =>
    kind === "faq"
      ? labels.kindFaq
      : kind === "doc"
        ? labels.kindDoc
        : labels.kindGuide;

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-paper-faint"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchPlaceholder}
          className="w-full rounded-xl border border-ink-3 bg-ink-2/60 ps-12 pe-4 py-4 text-[15px] text-paper placeholder:text-paper-faint focus:border-terracotta focus:outline-none"
        />
      </div>

      {/* Results mode */}
      {results !== null ? (
        <div className="mt-8">
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
            {labels.resultsTitle}
          </h2>
          {results.length === 0 ? (
            <p className="mt-4 text-sm text-paper-mute">{labels.noResults}</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-3 border-y border-ink-3">
              {results.map((it) => (
                <li key={it.id}>
                  <Link
                    href={it.href}
                    className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-ink-2/40"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[15px] text-paper">
                        {it.title}
                      </div>
                      {it.subtitle ? (
                        <div className="mt-0.5 truncate text-xs text-paper-mute">
                          {it.subtitle}
                        </div>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full bg-ink-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                      {kindLabel(it.kind)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          {/* Platform docs */}
          <section className="mt-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold/70">
              {labels.docsTitle}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {docCards.map((doc) => {
                const Icon = DOC_ICONS[doc.icon] ?? FileText;
                return (
                  <Link
                    key={doc.slug}
                    href={doc.href}
                    className="group flex flex-col rounded-xl border border-ink-3 bg-ink-2/50 p-5 transition-colors hover:border-terracotta/50 hover:bg-ink-2"
                  >
                    <Icon className="h-5 w-5 text-terracotta" aria-hidden />
                    <h3 className="mt-3 font-display text-lg leading-tight text-paper">
                      {doc.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-paper-dim">
                      {doc.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-terracotta">
                      {labels.learnMore}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* FAQ by category */}
          <section className="mt-14">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold/70">
              {labels.faqTitle}
            </h2>
            <div className="mt-6 space-y-10">
              {faqGroups.map((group) => (
                <div key={group.category}>
                  <h3 className="font-display text-xl text-paper">
                    {group.label}
                  </h3>
                  <div className="mt-3 divide-y divide-ink-3 border-t border-ink-3">
                    {group.items.map((item) => {
                      const isOpen = openId === item.id;
                      return (
                        <div key={item.id}>
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-4 py-4 text-start"
                          >
                            <span className="text-[15px] font-medium text-paper">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 shrink-0 text-paper-faint transition-transform duration-200",
                                isOpen && "rotate-180",
                              )}
                              aria-hidden
                            />
                          </button>
                          <div
                            className={cn(
                              "grid transition-all duration-200 motion-reduce:transition-none",
                              isOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0",
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="pb-5">
                                <p className="text-sm leading-7 text-paper-dim">
                                  {item.answer}
                                </p>
                                <Link
                                  href={item.href}
                                  className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta"
                                >
                                  {labels.learnMore}
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
              ))}
            </div>
          </section>

          {/* City guides note */}
          <section className="mt-14 rounded-xl border border-ink-3 bg-ink-2/40 p-6">
            <p className="text-sm text-paper-dim">{labels.cityNote}</p>
            <Link
              href="/guides"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta"
            >
              {labels.cityCta}
              <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
