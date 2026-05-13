"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
      <div className="flex items-center gap-2">
        <button
          onClick={handleSignOut}
          className="hidden items-center gap-2 rounded-full border border-black/5 px-3 py-1.5 text-sm font-medium text-[#5d6d7e] transition-colors hover:bg-black/5 md:flex dark:border-white/10 dark:text-[#99a3ad] dark:hover:bg-white/10"
          title={t("signOut")}
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
          <span className="max-w-[100px] truncate">{name}</span>
        </button>

        {/* Complete profile nudge */}
        {!onboardingComplete && (
          <Link
            href="/onboarding"
            className="hidden items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 md:flex dark:bg-primary-900/20 dark:text-primary-200"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" />
            {t("completeProfile")}
          </Link>
        )}

        {/* Mobile - avatar with nudge dot */}
        <Link
          href={onboardingComplete ? "#" : "/onboarding"}
          onClick={onboardingComplete ? handleSignOut : undefined}
          className="relative rounded-full p-1.5 md:hidden"
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full ring-2 ring-primary-500/30"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
              {name[0].toUpperCase()}
            </div>
          )}
          {!onboardingComplete && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-primary-500 ring-2 ring-white dark:ring-[#0f1117]" />
          )}
        </Link>
      </div>
    );
  }

  return (
    <Link href="/login" className="hidden md:block">
      <Button size="sm" variant="ghost" className="rounded-full">
        <User className="h-4 w-4" />
        {t("signIn")}
      </Button>
    </Link>
  );
}
