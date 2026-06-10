"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown, LogOut, Play, User } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import {
  navItems,
  type NavDropdownItem,
  type NavFlatItem,
  type NavItem,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

type Props = { locale?: string; nomadCount?: number };

function isDropdown(item: NavItem): item is NavDropdownItem {
  return "children" in item;
}

export function HeroFrame({ nomadCount = 0 }: Props) {
  const t = useTranslations("home.heroLive");
  const tNav = useTranslations("nav");
  const tSite = useTranslations("site");

  // Auth state lifted here so it's fetched once and shared to both
  // HeroAuthControl (header top-right) and the primary CTA.
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    const timer = setTimeout(async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        setAuthReady(true);
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) =>
        setUser(session?.user ?? null),
      );
      unsub = () => subscription.unsubscribe();
    }, 100);
    return () => {
      clearTimeout(timer);
      unsub?.();
    };
  }, []);

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
          {/* width/height 96 (not the file's 512) so next/image serves a
              ~3x-of-34px asset instead of a 1080px one for a 34px logo. */}
          <Image
            src="/images/logo-light.png"
            alt=""
            width={96}
            height={96}
            style={{ width: 34, height: "auto" }}
            priority
          />
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
          <HeroAuthControl user={user} ready={authReady} />
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
          {t("livePip", { count: nomadCount })}
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
            href={user ? "/today" : "/onboarding"}
            onClick={() =>
              track("hero_cta_click", {
                authed: !!user,
                destination: user ? "/today" : "/onboarding",
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 text-sm font-semibold text-[#06101f] transition hover:bg-gold/90"
          >
            {user ? t("ctaPrimaryAuthed") : t("ctaPrimary")}
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

// ── Auth-aware control for the hero header.
// Receives auth state from HeroFrame (single getUser() call, not duplicated).
// Uses the hero's dark/cream palette instead of the main header's ink/paper.
function HeroAuthControl({
  user,
  ready,
}: {
  user: SupabaseUser | null;
  ready: boolean;
}) {
  const t = useTranslations("auth");

  const handleSignOut = useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  const pill =
    "group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-cream/20 bg-cream/[0.04] px-3.5 py-1.5 font-grotesk text-[12.5px] font-medium text-cream backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-gold/10 hover:text-gold";

  // Pulse skeleton until the 100ms deferred check completes - prevents the
  // sign-in link from flashing for authenticated visitors on first paint.
  if (!ready) {
    return <div className="h-8 w-20 animate-pulse rounded-full bg-cream/10" />;
  }

  if (user) {
    const name =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      t("memberFallback");
    const avatar = user.user_metadata?.avatar_url;
    return (
      <div className="flex items-center gap-1.5">
        <Link href="/dashboard" className={pill} title={t("openDashboard")}>
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={18}
              height={18}
              className="h-[18px] w-[18px] rounded-full"
            />
          ) : (
            <User className="h-3.5 w-3.5" />
          )}
          <span className="max-w-[110px] truncate">{name}</span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          title={t("signOut")}
          aria-label={t("signOut")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream/20 bg-cream/[0.04] text-cream backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-gold/10 hover:text-gold"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className={pill}>
      {t("signIn")}
      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
    </Link>
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
