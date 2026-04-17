"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  navItems,
  siteConfig,
  socialLinks,
  type NavItem,
} from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { AuthButton } from "./auth-button";

const themeIcons = { light: Sun, dark: Moon, system: Monitor } as const;
const themeOrder = ["light", "dark", "system"] as const;

function isDropdown(
  item: NavItem,
): item is Extract<NavItem, { children: unknown }> {
  return "children" in item;
}

function NavDropdown({
  item,
  pathname,
}: {
  item: Extract<NavItem, { children: unknown }>;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isChildActive = item.children.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/"),
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all hover:bg-black/5 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-[#f2f3f4]",
          isChildActive
            ? "bg-black/5 text-neutral-950 dark:bg-white/10 dark:text-[#f2f3f4]"
            : "text-neutral-600 dark:text-[#85929e]",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1d27]/95 dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              prefetch
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                (pathname === child.href ||
                  pathname.startsWith(child.href + "/")) &&
                  "bg-primary-50/80 dark:bg-primary-900/20",
              )}
            >
              <div className="text-sm font-medium text-neutral-900 dark:text-[#f2f3f4]">
                {child.label}
              </div>
              <div className="mt-0.5 text-xs text-neutral-500 dark:text-[#85929e]">
                {child.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
        "sticky top-0 z-50 border-b border-black/5 bg-[rgba(250,250,250,0.88)] backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-300 dark:border-white/10 dark:bg-[rgba(26,29,39,0.88)]",
        scrolled &&
          "border-black/10 bg-[rgba(250,250,250,0.95)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-[rgba(26,29,39,0.95)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
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
            <Image
              src="/images/logo-light.png"
              alt="Istanbul Nomads"
              width={34}
              height={44}
              className="block drop-shadow-[0_0_8px_rgba(192,57,43,0.3)] dark:hidden"
              priority
            />
            <Image
              src="/images/logo-dark.png"
              alt="Istanbul Nomads"
              width={34}
              height={44}
              className="hidden drop-shadow-[0_0_8px_rgba(192,57,43,0.4)] dark:block"
              priority
            />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-950 dark:text-[#f2f3f4]">
                {siteConfig.shortName}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500 dark:text-[#85929e]">
                Remote life, local rhythm
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) =>
              isDropdown(item) ? (
                <NavDropdown key={item.label} item={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all hover:bg-black/5 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-[#f2f3f4]",
                    pathname === item.href
                      ? "bg-black/5 text-neutral-950 dark:bg-white/10 dark:text-[#f2f3f4]"
                      : "text-neutral-600 dark:text-[#85929e]",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={cycleTheme}
              className="rounded-full border border-black/5 p-2 text-neutral-500 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-[#99a3ad] dark:hover:bg-white/10"
              aria-label={`Switch theme (current: ${theme})`}
            >
              <ThemeIcon className="h-5 w-5" />
            </button>

            <AuthButton />

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
                Join on Telegram
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
