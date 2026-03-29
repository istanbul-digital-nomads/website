"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, siteConfig, socialLinks } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { MobileNav } from "./mobile-nav";

const themeIcons = { light: Sun, dark: Moon, system: Monitor } as const;
const themeOrder = ["light", "dark", "system"] as const;

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(245,239,228,0.75)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(7,17,29,0.72)]">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.55)]" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-950 dark:text-neutral-50">
                {siteConfig.shortName}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                Istanbul - remote city signal
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
                className="rounded-full bg-neutral-950 px-4 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Join Community
              </Button>
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-full p-2 text-neutral-500 md:hidden dark:text-neutral-300"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
