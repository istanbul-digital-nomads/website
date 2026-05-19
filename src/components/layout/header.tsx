"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  Compass,
  MapPin,
  Search,
  Tag,
  Users,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isRtl, type Locale } from "@/lib/i18n/config";
import {
  navItems,
  type NavCountKey,
  type NavDropdownItem,
  type NavFlatItem,
  type NavItem,
  type NavItemKey,
} from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { AuthButton } from "./auth-button";
import { LanguageSwitcher } from "./language-switcher";

// Lucide icons rendered at 14px / 1.5 stroke - consistent visual weight
// across the destinations bar. One glyph per top-level route + a glyph
// per dropdown trigger so the bar reads as a single row of icons.
const NAV_ICONS: Record<
  NavItemKey,
  React.ComponentType<{ className?: string }>
> = {
  today: CalendarDays,
  map: MapPin,
  events: Calendar,
  members: Users,
  perks: Tag,
  explore: Compass,
  community: UsersRound,
};

const headerControl =
  "header-control inline-flex h-8 items-center justify-center rounded-full border border-ink-3/70 bg-ink-1/50 text-[12.5px] text-paper-mute transition-all duration-fast hover:border-ink-4 hover:bg-ink-2 hover:text-paper";
const headerControlStyle = {
  height: 32,
  fontSize: 12.5,
  lineHeight: "18px",
} satisfies CSSProperties;

export type HeaderCounts = Partial<Record<NavCountKey, number>>;

type Props = { counts?: HeaderCounts };

function isDropdown(item: NavItem): item is NavDropdownItem {
  return "children" in item;
}

export function Header({ counts = {} }: Props) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  const { direction, scrolled, atTop } = useScrollDirection();
  const tSite = useTranslations("site");
  const tNav = useTranslations("nav");

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
          maxWidth: 1360,
          paddingInline: "clamp(16px, 2.5vw, 32px)",
        }}
      >
        <div
          data-header-inner
          className={cn(
            "flex items-center justify-between gap-3 transition-[height] duration-300",
            scrolled && "h-12",
          )}
          style={{ height: scrolled ? 48 : 56 }}
        >
          {/* 1 · Brand mark + wordmark. No tagline. */}
          <Link
            href="/"
            prefetch
            data-header-brand
            className="flex shrink-0 items-center gap-2"
          >
            <Image
              src="/images/logo-light.png"
              alt={tSite("shortName")}
              width={530}
              height={680}
              className="block dark:hidden"
              style={{ width: 26, height: "auto" }}
              priority
            />
            <Image
              src="/images/logo-dark.png"
              alt={tSite("shortName")}
              width={542}
              height={693}
              className="hidden dark:block"
              style={{ width: 26, height: "auto" }}
              priority
            />
            <span className="hidden font-display text-[15px] tracking-tight text-paper sm:inline">
              {tSite("shortName")}
            </span>
          </Link>

          <span className="hidden h-5 w-px bg-ink-3 lg:block" aria-hidden />

          {/* 2 · Destinations - flat icon items + Explore / Community
              dropdowns. Active state: gold-tint background + gold icon. */}
          <nav
            data-header-nav
            className="header-nav hidden min-w-0 flex-1 items-center justify-start gap-px lg:flex"
            aria-label={tNav("primaryAria")}
          >
            {navItems.map((item) =>
              isDropdown(item) ? (
                <NavDropdown
                  key={item.key}
                  item={item}
                  pathname={pathname}
                  rtl={rtl}
                />
              ) : (
                <FlatNavLink
                  key={item.key}
                  item={item}
                  pathname={pathname}
                  count={item.countKey ? counts[item.countKey] : undefined}
                />
              ),
            )}
          </nav>

          {/* 3 · Right cluster - polished pill controls with a subtle
              divider, the ⌘K search trigger, language switcher, and
              auth/CTA. */}
          <div data-header-actions className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-command-menu"))
              }
              className={cn(
                headerControl,
                "hidden w-36 justify-between gap-2 px-3 text-start xl:inline-flex",
              )}
              aria-label={tNav("search")}
              dir={rtl ? "rtl" : "ltr"}
              style={{ ...headerControlStyle, width: 144 }}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 text-paper-mute">
                <Search className="h-3 w-3 shrink-0" />
                <span className="truncate text-[12px]">{tNav("search")}</span>
              </span>
              <span
                dir="ltr"
                className="rounded border border-ink-3/70 bg-ink-0/40 px-1 py-px font-mono text-[9.5px] tracking-wider text-paper-faint"
              >
                ⌘K
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-command-menu"))
              }
              className={cn(headerControl, "w-8 xl:hidden")}
              aria-label={tNav("search")}
              style={{ ...headerControlStyle, width: 32 }}
            >
              <Search className="h-3.5 w-3.5" />
            </button>

            <span className="hidden h-4 w-px bg-ink-3 md:block" aria-hidden />

            <LanguageSwitcher />

            <AuthButton />
          </div>
        </div>
      </Container>
    </header>
  );
}

function FlatNavLink({
  item,
  pathname,
  count,
}: {
  item: NavFlatItem;
  pathname: string;
  count?: number;
}) {
  const tNav = useTranslations("nav");
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = NAV_ICONS[item.key];
  return (
    <Link
      href={item.href}
      prefetch
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors duration-fast",
        active
          ? "bg-ferry-yellow/10 text-paper"
          : "text-paper-mute hover:bg-paper/[0.04] hover:text-paper",
      )}
    >
      <Icon
        className={cn("h-3 w-3 shrink-0", active && "text-ferry-yellow")}
        aria-hidden
      />
      <span className="whitespace-nowrap">{tNav(item.key)}</span>
      {count != null && count > 0 && (
        <span className="rounded-full bg-paper/[0.08] px-1.5 py-px font-mono text-[10px] tabular-nums text-paper-mute">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function NavDropdown({
  item,
  pathname,
  rtl,
}: {
  item: NavDropdownItem;
  pathname: string;
  rtl: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tNav = useTranslations("nav");
  const tItems = useTranslations("nav.items");
  const Icon = NAV_ICONS[item.key];

  const childActive = item.children.some(
    (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
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
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-current={childActive ? "page" : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors duration-fast",
          childActive
            ? "bg-ferry-yellow/10 text-paper"
            : "text-paper-mute hover:bg-paper/[0.04] hover:text-paper",
        )}
        dir={rtl ? "rtl" : "ltr"}
      >
        <Icon
          className={cn("h-3 w-3 shrink-0", childActive && "text-ferry-yellow")}
          aria-hidden
        />
        <span className="whitespace-nowrap">{tNav(item.key)}</span>
        <ChevronDown
          className={cn(
            "h-2.5 w-2.5 shrink-0 text-paper-faint transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-ink-3 bg-ink-1/95 p-1.5 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl"
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
                role="menuitem"
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-start transition-colors",
                  active ? "bg-ferry-yellow/10" : "hover:bg-paper/[0.05]",
                )}
              >
                <div
                  className={cn(
                    "text-[13.5px] font-medium",
                    active ? "text-paper" : "text-paper",
                  )}
                >
                  {tItems(`${child.key}.label`)}
                </div>
                <div className="mt-0.5 text-[12px] leading-snug text-paper-mute">
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
