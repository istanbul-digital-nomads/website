"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, BookOpen, Calendar, Send, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/lib/constants";
import { MobileMenuOverlay } from "./mobile-menu-overlay";

interface Tab {
  key: "home" | "guides" | "events" | "community" | "menu";
  icon: typeof Home;
  href?: string;
  external?: boolean;
  action?: "menu";
}

const tabs: Tab[] = [
  { key: "home", icon: Home, href: "/" },
  { key: "guides", icon: BookOpen, href: "/guides" },
  { key: "events", icon: Calendar, href: "/events" },
  {
    key: "community",
    icon: Send,
    href: socialLinks.telegram,
    external: true,
  },
  { key: "menu", icon: Menu, action: "menu" },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("bottomNav");

  // Safety net: close the sheet on any navigation, not just taps on its own
  // links (covers back/forward and programmatic routing).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close on route change is intentional
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (tab: Tab) => {
    if (tab.action === "menu") return menuOpen;
    if (tab.external) return false;
    if (tab.href === "/") return pathname === "/";
    return tab.href ? pathname.startsWith(tab.href) : false;
  };

  return (
    <>
      <div
        className="animate-slide-up-bar fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[rgba(250,250,250,0.95)] backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[rgba(26,29,39,0.96)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16 items-stretch">
          {tabs.map((tab) => {
            const active = isActive(tab);
            const Icon = tab.action === "menu" && menuOpen ? X : tab.icon;
            const label = t(tab.key);

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
                      : "text-neutral-500 dark:text-[#85929e]",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    active
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-neutral-500 dark:text-[#85929e]",
                  )}
                >
                  {label}
                </span>
              </div>
            );

            if (tab.action === "menu") {
              return (
                <button
                  key={tab.key}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative flex flex-1"
                  aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu-overlay"
                >
                  {content}
                </button>
              );
            }

            if (tab.external) {
              return (
                <a
                  key={tab.key}
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
                key={tab.key}
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
