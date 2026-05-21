"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import {
  navItems,
  type NavDropdownItem,
  type NavFlatItem,
  type NavItem,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

type Props = { locale?: string };

function isDropdown(item: NavItem): item is NavDropdownItem {
  return "children" in item;
}

export function HeroFrame(_props: Props) {
  const t = useTranslations("home.heroLive");
  const tNav = useTranslations("nav");
  const tSite = useTranslations("site");

  return (
    <>
      {/* Inline-start gradient mask for text contrast over the map.
          hero-text-mask flips direction in [dir=rtl] - see hero-live.css. */}
      <div className="hero-text-mask pointer-events-none absolute inset-0 z-[1050]" />

      {/* Brand bar - the hero's own header. Same nav content as the global
          Header, but rendered in an editorial register: bigger confident
          brand mark, italic-gold active accents, refined right cluster. */}
      <header className="absolute inset-x-0 top-0 z-[1100] flex h-16 items-center justify-between gap-4 px-6 md:h-[68px] md:px-10">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={tSite("shortName")}
        >
          <span
            className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px]"
            style={{
              background: "linear-gradient(135deg, #f4b860, #e87a5d)",
              boxShadow:
                "0 8px 22px -8px rgba(244,184,96,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.18)",
            }}
          >
            <Image
              src="/images/logo-dark.png"
              alt=""
              width={542}
              height={693}
              style={{
                width: 22,
                height: "auto",
                filter:
                  "brightness(0) saturate(100%) invert(7%) sepia(50%) saturate(2200%) hue-rotate(195deg) brightness(95%) contrast(98%)",
              }}
              priority
            />
          </span>
          <span
            className="font-editorial leading-none tracking-tight text-cream"
            style={{ fontSize: 18, letterSpacing: "-0.01em" }}
          >
            Istanbul <em className="italic text-gold">Nomads</em>
          </span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
          aria-label={tNav("primaryAria")}
        >
          {navItems.map((item) =>
            isDropdown(item) ? (
              <HeroDropdown key={item.key} item={item} />
            ) : (
              <HeroFlatLink key={item.key} item={item} />
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-cream/20 bg-cream/[0.04] px-3.5 py-1.5 font-grotesk text-[12.5px] font-medium text-cream backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
          >
            {t("nav.signIn")}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0" />
          </Link>
        </div>
      </header>

      {/* Headline block - inline-start side, vertically centered.
          Uses logical CSS properties (start-*) so it sits on the right
          in [dir=rtl] without extra overrides. */}
      <div className="absolute start-6 top-1/2 z-[1100] w-[min(540px,calc(100%-3rem))] -translate-y-1/2 md:start-11">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-moss/35 bg-moss/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-moss">
          <span
            className="hero-live-pip inline-block h-1.5 w-1.5 rounded-full bg-moss"
            style={{ boxShadow: "0 0 8px rgb(134, 239, 172)" }}
          />
          {t("livePip")}
        </div>

        <h1
          className="font-editorial text-cream"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            margin: "0 0 1.1rem",
          }}
        >
          <span className="block">
            {t("headlineA")}{" "}
            <em className="italic text-gold">{t("headlineB")}</em>
          </span>
          <span className="block">{t("headlineC")}</span>
        </h1>

        <p className="mb-7 max-w-[420px] text-[15.5px] leading-[1.55] text-cream/70">
          {t("lede")}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 text-sm font-semibold text-deep-water transition hover:bg-gold/90"
          >
            {t("ctaPrimary")}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full px-2 py-3.5 text-sm font-medium text-cream"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cream/30">
              <Play className="h-3 w-3 fill-current" />
            </span>
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </>
  );
}

// ── Hero-tone flat link. Active state shows a gold underline dot.
function HeroFlatLink({ item }: { item: NavFlatItem }) {
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const active =
    pathname === item.href || pathname?.startsWith(item.href + "/");
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center whitespace-nowrap px-3 py-2 font-grotesk text-[13px] transition-colors",
        active ? "text-cream" : "text-cream/65 hover:text-cream",
      )}
    >
      <span className="relative">
        {tNav(item.key)}
        {active && (
          <span
            aria-hidden
            className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold"
            style={{ boxShadow: "0 0 8px rgb(244, 184, 96)" }}
          />
        )}
      </span>
    </Link>
  );
}

// ── Hero-tone dropdown. Same editorial register, gold-italic on active.
function HeroDropdown({ item }: { item: NavDropdownItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tNav = useTranslations("nav");
  const tItems = useTranslations("nav.items");
  const pathname = usePathname();
  const active = item.children.some(
    (c) => pathname === c.href || pathname?.startsWith(c.href + "/"),
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 font-grotesk text-[13px] transition-colors",
          active ? "text-cream" : "text-cream/65 hover:text-cream",
        )}
      >
        <span className="relative">
          {tNav(item.key)}
          {active && (
            <span
              aria-hidden
              className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold"
              style={{ boxShadow: "0 0 8px rgb(244, 184, 96)" }}
            />
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-2.5 w-2.5 text-cream/40 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-xl border p-1.5 backdrop-blur-xl"
          style={{
            borderColor: "rgba(244, 184, 96, 0.22)",
            background: "rgba(10, 26, 47, 0.95)",
            boxShadow: "0 24px 56px -12px rgba(0,0,0,0.55)",
          }}
        >
          {item.children.map((child) => {
            const isChildActive =
              pathname === child.href || pathname?.startsWith(child.href + "/");
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                role="menuitem"
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-start transition-colors",
                  isChildActive ? "bg-gold/10" : "hover:bg-gold/[0.06]",
                )}
              >
                <div
                  className={cn(
                    "font-grotesk text-[13.5px] font-medium",
                    isChildActive ? "text-gold" : "text-cream",
                  )}
                >
                  {tItems(`${child.key}.label`)}
                </div>
                <div className="mt-0.5 text-[12px] leading-snug text-cream/55">
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
