"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Sun, Moon, Monitor, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { isRtl, type Locale } from "@/lib/i18n/config";
import { navItems, socialLinks, type NavItem } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { useTheme } from "./theme-provider";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { AuthButton } from "./auth-button";
import { LanguageSwitcher } from "./language-switcher";

const themeIcons = { light: Sun, dark: Moon, system: Monitor } as const;
const themeOrder = ["light", "dark", "system"] as const;
const headerControl =
  "header-control inline-flex h-9 items-center justify-center border border-ink-4 bg-ink-1/55 text-sm text-paper-mute transition-colors duration-fast hover:border-ink-5 hover:bg-ink-2 hover:text-paper";
const headerControlStyle = {
  height: 36,
  fontSize: 14,
  lineHeight: "20px",
} satisfies CSSProperties;
const headerNavItemStyle = {
  width: 104,
  minWidth: 104,
  padding: "8px 12px",
  fontSize: 14,
  lineHeight: "20px",
} satisfies CSSProperties;
const headerNavDropdownStyle = {
  width: 128,
  minWidth: 128,
  padding: "8px 12px",
  fontSize: 14,
  lineHeight: "20px",
} satisfies CSSProperties;

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
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
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
          "header-nav-dropdown flex min-w-[96px] items-center justify-center gap-1 px-3 py-2 text-center text-sm font-medium transition-colors duration-fast hover:text-paper",
          isChildActive ? "text-paper" : "text-paper-mute",
        )}
        style={headerNavDropdownStyle}
        dir={rtl ? "rtl" : "ltr"}
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
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 border border-ink-3 bg-ink-1/95 p-2 shadow-[0_16px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          dir={rtl ? "rtl" : "ltr"}
        >
          {item.children.map((child) => {
            const active =
              pathname === child.href || pathname.startsWith(child.href + "/");
            return (
              <Link
                key={child.href}
                href={child.href}
                prefetch
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3.5 py-2.5 text-start transition-colors hover:bg-ink-2",
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
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
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
        "site-header sticky top-0 z-50 border-b border-ink-3 bg-ink-1/80 backdrop-blur-md transition-[background-color,box-shadow,transform] duration-300",
        scrolled &&
          "is-scrolled bg-ink-1/95 shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
        hideOnMobile && "max-md:-translate-y-full",
      )}
    >
      <Container
        style={{
          maxWidth: 1280,
          paddingInline: "clamp(16px, 2.5vw, 32px)",
        }}
      >
        <div
          data-header-inner
          className={cn(
            "flex h-16 items-center justify-between gap-4 transition-[height] duration-300",
            scrolled && "h-14",
          )}
          style={{ height: scrolled ? 56 : 64 }}
        >
          <Link
            href="/"
            prefetch
            data-header-brand
            className="flex w-[220px] shrink-0 items-center gap-3"
            style={{ width: 220 }}
          >
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
            <div className="min-w-0 leading-none">
              <div className="font-display text-[17px] tracking-tight text-paper">
                {tSite("shortName")}
              </div>
              <div className="mt-1 truncate font-mono text-[9.5px] uppercase tracking-[0.18em] text-paper-mute">
                {tSite("tagline")}
              </div>
            </div>
          </Link>

          <nav
            data-header-nav
            className="header-nav hidden min-w-0 flex-1 items-center justify-center gap-1 px-6 lg:flex"
          >
            {navItems.map((item) =>
              isDropdown(item) ? (
                <NavDropdown key={item.key} item={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className={cn(
                    "header-nav-link relative min-w-[80px] px-3 py-2 text-center text-sm font-medium transition-colors duration-fast hover:text-paper",
                    pathname === item.href ? "text-paper" : "text-paper-mute",
                  )}
                  style={headerNavItemStyle}
                >
                  {tNav(item.key)}
                  {pathname === item.href && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-terracotta" />
                  )}
                </Link>
              ),
            )}
          </nav>

          <div
            data-header-actions
            className="flex min-w-[272px] shrink-0 items-center justify-end gap-1.5 rtl:justify-start xl:min-w-[400px]"
            style={{ minWidth: 272 }}
          >
            {/* Command palette trigger - dispatches the open event the
                global CommandMenu listens for. Cmd/Ctrl+K opens it from
                anywhere too. */}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-command-menu"))
              }
              className={cn(
                headerControl,
                "hidden w-36 gap-3 px-3 xl:inline-flex",
                "justify-between text-start",
              )}
              aria-label={tNav("search")}
              dir={rtl ? "rtl" : "ltr"}
              style={{ ...headerControlStyle, width: 144 }}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 text-paper-mute">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate text-[13px]">{tNav("search")}</span>
              </span>
              <span
                dir="ltr"
                className="border border-ink-4 bg-ink-0/40 px-1.5 py-px font-mono text-[10px] text-paper-faint"
              >
                ⌘K
              </span>
            </button>

            <button
              onClick={cycleTheme}
              className={cn(headerControl, "w-9")}
              aria-label={tNav("theme.ariaLabel", { theme })}
              style={{ ...headerControlStyle, width: 36 }}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>

            <LanguageSwitcher />

            <AuthButton />

            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="header-control hidden h-9 w-36 items-center justify-center bg-terracotta px-4 text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim md:inline-flex"
              style={{ ...headerControlStyle, width: 144 }}
            >
              {tNav("joinTelegram")}
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
