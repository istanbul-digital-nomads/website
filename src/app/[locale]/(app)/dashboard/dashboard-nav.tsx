"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/container";
import { LayoutDashboard, User, BadgeCheck, Wallet, Bell } from "lucide-react";
import type { ComponentType } from "react";

// Persistent sub-navigation across the /dashboard area so the profile
// editor, verification, and payouts feel like one product rather than
// stray pages. Sticky tab bar; active tab is derived from the path.

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  profile: User,
  account: Bell,
  verification: BadgeCheck,
  payouts: Wallet,
};

export interface DashboardNavItem {
  key: string;
  href: string;
}

export function DashboardNav({
  items,
  greetingName,
}: {
  items: DashboardNavItem[];
  greetingName: string;
}) {
  const t = useTranslations("membersV2.dashboard.nav");
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="sticky top-0 z-30 border-b border-ink-3 bg-ink-1/95 backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-paper-mute sm:block">
            {t("eyebrow")}
          </span>
          <span className="truncate font-mono text-[11px] uppercase tracking-wider text-paper-faint sm:hidden">
            {greetingName}
          </span>
          <nav
            aria-label={t("eyebrow")}
            className="-mb-3 flex items-center gap-1 overflow-x-auto"
          >
            {items.map((item) => {
              const Icon = ICONS[item.key] ?? LayoutDashboard;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 pb-3 pt-1 text-sm transition-colors ${
                    active
                      ? "border-terracotta text-paper"
                      : "border-transparent text-paper-mute hover:text-paper"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </div>
  );
}
