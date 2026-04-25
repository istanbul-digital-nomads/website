"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, UserPlus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { showToast } from "@/lib/toast";

const GRADIENTS = [
  "from-rose-400 to-orange-400",
  "from-amber-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-indigo-500",
  "from-fuchsia-400 to-purple-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-blue-500",
  "from-lime-400 to-emerald-500",
  "from-pink-400 to-rose-500",
  "from-violet-400 to-fuchsia-500",
];

const VISIBLE = 10;
const STACK_PREVIEW = 7;

interface WaitlistSummary {
  count: number;
  recent: { first_name: string; created_at: string }[];
}

interface AvatarEntry {
  name: string;
  gradient: string;
}

function gradientFor(name: string, fallbackIndex: number) {
  const seed = name
    .toLowerCase()
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[(seed + fallbackIndex) % GRADIENTS.length]!;
}

function buildAvatars(summary: WaitlistSummary | null): AvatarEntry[] {
  const real = (summary?.recent ?? []).map((r, i) => ({
    name: r.first_name,
    gradient: gradientFor(r.first_name, i),
  }));
  return real.slice(0, VISIBLE);
}

export function SurpriseEventWaitlist() {
  const [summary, setSummary] = useState<WaitlistSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.data) setSummary(json.data as WaitlistSummary);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const firstName = String(formData.get("first_name") ?? "");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name: firstName }),
      });
      const json = await res.json();

      if (!res.ok) {
        showToast.error("Could not join the waitlist", json.error);
        return;
      }

      setJoined(true);
      showToast.success("You're on the list!", json.data.message);

      // Optimistically add to the visible list
      setSummary((prev) => {
        const recent = [
          { first_name: firstName, created_at: new Date().toISOString() },
          ...(prev?.recent ?? []),
        ].slice(0, 10);
        return { count: (prev?.count ?? 0) + 1, recent };
      });
    } catch {
      showToast.error("Something went wrong", "Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const avatars = buildAvatars(summary);
  const realCount = summary?.count ?? 0;
  const overflow = Math.max(realCount - STACK_PREVIEW, 0);
  const previewNames = avatars
    .slice(0, 3)
    .map((a) => a.name)
    .join(", ");
  const remainingNamed = Math.max(realCount - 3, 0);

  return (
    <Container>
      <div className="relative overflow-hidden rounded-3xl bg-white/40 p-6 shadow-[0_24px_60px_-30px_rgba(26,26,46,0.25)] ring-1 ring-white/60 backdrop-blur-2xl sm:p-10 dark:bg-white/5 dark:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] dark:ring-white/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-primary-400/30 blur-3xl dark:bg-primary-500/20" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-500/10" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-primary-700 ring-1 ring-white/60 backdrop-blur-md dark:bg-white/10 dark:text-primary-300 dark:ring-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              Surprise event
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1a1a2e] sm:text-3xl dark:text-[#f2f3f4]">
              Something&apos;s coming. Date drops on the day.
            </h2>
            <p className="mt-3 max-w-lg text-sm text-[#5d6d7e] sm:text-base dark:text-[#99a3ad]">
              We&apos;re cooking up a community-only event in Istanbul. The when
              and where stay under wraps until that morning. Join the waitlist
              and you&apos;ll be the first to know.
            </p>

            {joined ? (
              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-white/50 px-4 py-3 text-sm font-medium text-primary-700 ring-1 ring-white/60 backdrop-blur-md dark:bg-white/10 dark:text-primary-300 dark:ring-white/10">
                  <Check className="h-4 w-4" />
                  You&apos;re on the list. Watch your inbox.
                </div>
                <div className="rounded-2xl bg-white/40 p-4 ring-1 ring-white/60 backdrop-blur-md sm:p-5 dark:bg-white/5 dark:ring-white/10">
                  <p className="text-sm font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                    One more step: complete your profile.
                  </p>
                  <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                    Members with full profiles get priority when spots are
                    limited and a faster intro into the community.
                  </p>
                  <Link
                    href="/login"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Complete profile
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="text"
                  name="first_name"
                  required
                  maxLength={60}
                  placeholder="First name"
                  className="min-w-0 flex-1 rounded-xl bg-white/60 px-3.5 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-white/70 backdrop-blur-md transition-colors placeholder:text-neutral-400 focus:ring-primary-400 dark:bg-white/5 dark:text-[#f2f3f4] dark:ring-white/10 dark:placeholder:text-[#5d6d7e]"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-xl bg-white/60 px-3.5 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-white/70 backdrop-blur-md transition-colors placeholder:text-neutral-400 focus:ring-primary-400 dark:bg-white/5 dark:text-[#f2f3f4] dark:ring-white/10 dark:placeholder:text-[#5d6d7e]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  {loading ? "Joining..." : "Join the waitlist"}
                  {!loading && <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </form>
            )}

            {!joined && (
              <p className="mt-3 text-xs text-[#7a8693] dark:text-[#5d6d7e]">
                No spam. We email once when the date is announced.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white/40 p-5 ring-1 ring-white/60 backdrop-blur-xl dark:bg-white/5 dark:ring-white/10">
            {realCount === 0 ? (
              <div className="flex flex-col items-start gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-primary-700 ring-1 ring-white/70 backdrop-blur-md dark:bg-white/10 dark:text-primary-300 dark:ring-white/10">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="mt-2 text-sm font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                  Be the first to join.
                </p>
                <p className="text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                  We&apos;ll show who&apos;s in here as people sign up.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center -space-x-2">
                  {avatars.slice(0, STACK_PREVIEW).map((a, i) => (
                    <div
                      key={`${a.name}-${i}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ring-2 ring-white dark:ring-[#15212c] ${a.gradient}`}
                      title={a.name}
                    >
                      {a.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {overflow > 0 && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-semibold text-white ring-2 ring-white dark:bg-white/10 dark:ring-[#15212c]">
                      +{overflow}
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                  {realCount === 1
                    ? "1 nomad on the list"
                    : `${realCount} nomads on the list`}
                </p>
                <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                  {previewNames}
                  {remainingNamed > 0 ? ` and ${remainingNamed} more` : ""}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
