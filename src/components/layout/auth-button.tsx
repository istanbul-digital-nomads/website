"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LogOut, User } from "lucide-react";
import { showToast } from "@/lib/toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const headerControl =
  "inline-flex h-9 items-center justify-center border border-ink-4 bg-ink-1/55 text-sm text-paper-mute transition-colors duration-fast hover:border-ink-5 hover:bg-ink-2 hover:text-paper";

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const t = useTranslations("auth");

  useEffect(() => {
    // Cheap heuristic: skip the supabase client entirely when there's no
    // Supabase auth cookie (sb-*-auth-token). For anonymous visitors - the
    // vast majority of home-page traffic - this avoids downloading the ~40 KB
    // supabase chunk and the ~50 KB gotrue-js auth client. Authenticated
    // visitors fall through to the deferred dynamic import below.
    const hasAuthCookie =
      typeof document !== "undefined" &&
      document.cookie.split(";").some((c) => c.trim().startsWith("sb-"));
    if (!hasAuthCookie) {
      setLoading(false);
      return;
    }

    let cleanupRef: (() => void) | null = null;

    // Defer auth client load + check until after first paint. Lazy-importing
    // the supabase client keeps its chunk off the initial bundle even for
    // signed-in visitors.
    const timer = setTimeout(async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      supabase.auth.getUser().then(async ({ data }) => {
        setUser(data.user);
        if (data.user) {
          const { data: member } = await (supabase.from("members") as any)
            .select("onboarding_completed")
            .eq("id", data.user.id)
            .single();
          setOnboardingComplete(member?.onboarding_completed ?? false);
        }
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      cleanupRef = () => subscription.unsubscribe();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupRef?.();
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    showToast.success(t("signedOut"));
    window.location.href = "/";
  }, [t]);

  if (loading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
    );
  }

  if (user) {
    const name =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      t("memberFallback");
    const avatar = user.user_metadata?.avatar_url;

    return (
      <div className="flex items-center gap-1.5">
        {/* Desktop: name button -> /dashboard, separate sign-out icon */}
        <Link
          href="/dashboard"
          title={t("openDashboard")}
          className={`${headerControl} hidden gap-2 px-3 font-medium md:inline-flex`}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={20}
              height={20}
              className="h-5 w-5 rounded-full"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span className="max-w-[120px] truncate">{name}</span>
        </Link>

        {/* Complete profile nudge */}
        {!onboardingComplete && (
          <Link
            href="/onboarding"
            className="hidden h-9 items-center gap-1.5 border border-terracotta bg-terracotta/10 px-3 text-xs font-medium text-terracotta transition-colors hover:bg-terracotta/20 md:inline-flex"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracotta" />
            {t("completeProfile")}
          </Link>
        )}

        {/* Sign-out icon (desktop only; mobile uses the avatar tap) */}
        <button
          onClick={handleSignOut}
          title={t("signOut")}
          aria-label={t("signOut")}
          className={`${headerControl} hidden w-9 md:inline-flex`}
        >
          <LogOut className="h-4 w-4" />
        </button>

        {/* Mobile - avatar tap goes to dashboard (or onboarding if incomplete) */}
        <Link
          href={onboardingComplete ? "/dashboard" : "/onboarding"}
          className="relative rounded-full p-1.5 md:hidden"
          title={onboardingComplete ? t("openDashboard") : t("completeProfile")}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full ring-2 ring-terracotta/40"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta/20 text-xs font-medium text-terracotta">
              {name[0].toUpperCase()}
            </div>
          )}
          {!onboardingComplete && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-terracotta ring-2 ring-ink-1" />
          )}
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className={`${headerControl} hidden gap-1.5 px-3 font-medium md:inline-flex`}
    >
      <User className="h-4 w-4" />
      {t("signIn")}
    </Link>
  );
}
