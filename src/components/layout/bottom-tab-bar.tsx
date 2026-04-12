"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calendar, Send, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/lib/constants";
import { MobileMenuOverlay } from "./mobile-menu-overlay";

interface Tab {
  label: string;
  icon: typeof Home;
  href?: string;
  external?: boolean;
  action?: "menu";
}

const tabs: Tab[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Guides", icon: BookOpen, href: "/guides" },
  { label: "Events", icon: Calendar, href: "/events" },
  {
    label: "Community",
    icon: Send,
    href: socialLinks.telegram,
    external: true,
  },
  { label: "Menu", icon: Menu, action: "menu" },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (tab: Tab) => {
    if (tab.action === "menu") return menuOpen;
    if (tab.external) return false;
    if (tab.href === "/") return pathname === "/";
    return tab.href ? pathname.startsWith(tab.href) : false;
  };

  return (
    <>
      <div
        className="animate-slide-up-bar fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[rgba(245,239,228,0.95)] backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[rgba(21,16,16,0.96)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16 items-stretch">
          {tabs.map((tab) => {
            const active = isActive(tab);
            const Icon = tab.action === "menu" && menuOpen ? X : tab.icon;

            const content = (
              <div className="tap-highlight flex flex-1 flex-col items-center justify-center gap-0.5">
                {active && (
                  <span className="absolute top-0 h-0.5 w-6 rounded-full bg-primary-500" />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-neutral-500 dark:text-[#8a7a6a]",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    active
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-neutral-500 dark:text-[#8a7a6a]",
                  )}
                >
                  {tab.label}
                </span>
              </div>
            );

            if (tab.action === "menu") {
              return (
                <button
                  key={tab.label}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative flex flex-1"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  {content}
                </button>
              );
            }

            if (tab.external) {
              return (
                <a
                  key={tab.label}
                  href={tab.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex flex-1"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={tab.label}
                href={tab.href!}
                prefetch
                className="relative flex flex-1"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <MobileMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
