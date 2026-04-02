"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    showToast.success("Signed out");
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
    );
  }

  if (user) {
    const name =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Member";
    const avatar = user.user_metadata?.avatar_url;

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSignOut}
          className="hidden items-center gap-2 rounded-full border border-black/5 px-3 py-1.5 text-sm font-medium text-[#6b6257] transition-colors hover:bg-black/5 md:flex dark:border-white/10 dark:text-[#b8a898] dark:hover:bg-white/10"
          title="Sign out"
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

        {/* Mobile - just avatar */}
        <button
          onClick={handleSignOut}
          className="rounded-full p-1.5 md:hidden"
          title="Sign out"
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
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {name[0].toUpperCase()}
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="hidden md:block">
      <Button size="sm" variant="ghost" className="rounded-full">
        <User className="h-4 w-4" />
        Sign In
      </Button>
    </Link>
  );
}
