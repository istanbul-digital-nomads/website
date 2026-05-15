"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTranslations } from "next-intl";
import type { SearchItem } from "@/lib/search";

/**
 * Design System v2 Phase 6 - the global Command-K menu. Cmd/Ctrl+K opens
 * the overlay; the header's `⌘K` button dispatches an `open-command-menu`
 * custom event that this same listener picks up, so the trigger button
 * needs no shared store.
 *
 * Items are prebuilt server-side per locale (see `getSearchItems`), so
 * filtering is in-memory and instant. Selecting a row navigates.
 */
export function CommandMenu({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("commandMenu");

  // Open on Cmd/Ctrl+K, close on Escape (cmdk handles the latter natively).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onOpen);
    };
  }, []);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      router.push(item.href);
    },
    [router],
  );

  // Group items in source order, preserving the prebuilt grouping.
  const groups: { key: SearchItem["group"]; items: SearchItem[] }[] = [];
  for (const item of items) {
    const existing = groups.find((g) => g.key === item.group);
    if (existing) existing.items.push(item);
    else groups.push({ key: item.group, items: [item] });
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label={t("ariaLabel")}
      className="fixed inset-0 z-[100] grid place-items-start"
      overlayClassName="fixed inset-0 z-[100] bg-ink-0/70 backdrop-blur-sm"
      contentClassName="relative z-[101] mx-auto mt-[14vh] w-[min(640px,92vw)] border border-ink-3 bg-ink-1 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
    >
      <Command shouldFilter className="flex flex-col">
        <Command.Input
          placeholder={t("placeholder")}
          className="border-b border-ink-3 bg-transparent px-5 py-4 text-base text-paper outline-none placeholder:text-paper-faint"
        />
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center font-mono text-[11px] uppercase tracking-wider text-paper-faint">
            {t("empty")}
          </Command.Empty>
          {groups.map((group) => (
            <Command.Group
              key={group.key}
              heading={t(`groups.${group.key}`)}
              className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-terracotta"
            >
              {group.items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.title} ${item.subtitle ?? ""} ${(item.keywords ?? []).join(" ")}`}
                  onSelect={() => handleSelect(item)}
                  className="flex cursor-pointer items-center justify-between gap-4 px-3 py-2.5 text-sm text-paper transition-colors aria-selected:bg-ink-2 data-[selected=true]:bg-ink-2"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{item.title}</div>
                    {item.subtitle ? (
                      <div className="mt-0.5 truncate text-xs text-paper-mute">
                        {item.subtitle}
                      </div>
                    ) : null}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                    ↵
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
        <div className="flex items-center justify-between border-t border-ink-3 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
          <span>{t("footnote")}</span>
          <span>esc to close</span>
        </div>
      </Command>
    </Command.Dialog>
  );
}
