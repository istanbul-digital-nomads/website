"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, siteConfig, socialLinks } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

const themeIcons = { light: Sun, dark: Moon, system: Monitor } as const;
const themeOrder = ["light", "dark", "system"] as const;

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { direction, scrolled, atTop } = useScrollDirection();

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  };

  const ThemeIcon = themeIcons[theme];

  const hideOnMobile = direction === "down" && !atTop;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-black/5 bg-[rgba(245,239,228,0.75)] backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-300 dark:border-white/10 dark:bg-[rgba(7,17,29,0.72)]",
        scrolled &&
          "border-black/10 bg-[rgba(245,239,228,0.88)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-[rgba(7,17,29,0.88)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        hideOnMobile && "max-md:-translate-y-full",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex h-16 items-center justify-between transition-[height] duration-300",
            scrolled && "h-14",
          )}
        >
          <Link href="/" prefetch className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_20px_rgba(227,75,50,0.5)]" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-950 dark:text-neutral-50">
                {siteConfig.shortName}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                Remote life, local rhythm
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all hover:bg-black/5 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-neutral-50",
                  pathname === item.href
                    ? "bg-black/5 text-neutral-950 dark:bg-white/10 dark:text-neutral-50"
                    : "text-neutral-600 dark:text-neutral-400",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={cycleTheme}
              className="rounded-full border border-black/5 p-2 text-neutral-500 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/10"
              aria-label={`Switch theme (current: ${theme})`}
            >
              <ThemeIcon className="h-5 w-5" />
            </button>

            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button
                size="sm"
                className="rounded-full bg-primary-600 px-4 text-white hover:bg-primary-700 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-400"
              >
                Join Community
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
