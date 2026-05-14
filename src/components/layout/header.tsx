"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, socialLinks, type NavItem } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { useTheme } from "./theme-provider";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { AuthButton } from "./auth-button";
import { LanguageSwitcher } from "./language-switcher";

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
  const tNav = useTranslations("nav");
  const tItems = useTranslations("nav.items");

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
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-fast hover:text-paper",
          isChildActive ? "text-paper" : "text-paper-mute",
        )}
      >
        {tNav(item.key)}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 border border-ink-3 bg-ink-1/95 p-2 shadow-[0_16px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {item.children.map((child) => {
            const active =
              pathname === child.href ||
              pathname.startsWith(child.href + "/");
            return (
              <Link
                key={child.href}
                href={child.href}
                prefetch
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3.5 py-2.5 transition-colors hover:bg-ink-2",
                  active && "bg-ink-2",
                )}
              >
                <div className="text-sm font-medium text-paper">
                  {tItems(`${child.key}.label`)}
                </div>
                <div className="mt-0.5 text-xs text-paper-mute">
                  {tItems(`${child.key}.description`)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { direction, scrolled, atTop } = useScrollDirection();
  const tSite = useTranslations("site");
  const tNav = useTranslations("nav");

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme);
    setTheme(themeOrder[(idx + 1) % themeOrder.length]);
  };

  const ThemeIcon = themeIcons[theme];

  const hideOnMobile = direction === "down" && !atTop;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-ink-3 bg-ink-1/80 backdrop-blur-md transition-[background-color,box-shadow,transform] duration-300",
        scrolled && "bg-ink-1/95 shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
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
              alt={tSite("shortName")}
              width={530}
              height={680}
              className="block dark:hidden"
              style={{ width: 32, height: "auto" }}
              priority
            />
            <Image
              src="/images/logo-dark.png"
              alt={tSite("shortName")}
              width={542}
              height={693}
              className="hidden dark:block"
              style={{ width: 32, height: "auto" }}
              priority
            />
            <div className="leading-none">
              <div className="font-display text-[17px] tracking-tight text-paper">
                {tSite("shortName")}
              </div>
              <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-paper-mute">
                {tSite("tagline")}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) =>
              isDropdown(item) ? (
                <NavDropdown key={item.key} item={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-fast hover:text-paper",
                    pathname === item.href ? "text-paper" : "text-paper-mute",
                  )}
                >
                  {tNav(item.key)}
                  {pathname === item.href && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-terracotta" />
                  )}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/* Command palette affordance - visual only until the Command-K
                menu lands in a later phase. */}
            <button
              type="button"
              className="hidden items-center gap-2 border border-ink-4 px-3 py-1.5 font-mono text-[11px] text-paper-mute transition-colors hover:border-ink-5 hover:text-paper lg:flex"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="border border-ink-4 px-1.5 py-px text-[10px]">
                ⌘K
              </span>
            </button>

            <button
              onClick={cycleTheme}
              className="border border-ink-4 p-2 text-paper-mute transition-colors hover:border-ink-5 hover:text-paper"
              aria-label={tNav("theme.ariaLabel", { theme })}
            >
              <ThemeIcon className="h-5 w-5" />
            </button>

            <LanguageSwitcher />

            <AuthButton />

            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden bg-terracotta px-4 py-2 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim md:block"
            >
              {tNav("joinTelegram")}
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
