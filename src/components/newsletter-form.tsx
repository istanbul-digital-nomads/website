"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { showToast } from "@/lib/toast";

export function NewsletterForm({
  variant = "default",
}: {
  variant?: "default" | "footer";
}) {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error("Could not subscribe", data.error);
        return;
      }

      setSubscribed(true);
      showToast.success("You're in!", data.data.message);
    } catch {
      showToast.error("Something went wrong", "Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
        <Check className="h-4 w-4" />
        You&apos;re subscribed!
      </div>
    );
  }

  const isFooter = variant === "footer";

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className={`min-w-0 flex-1 rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 ${
          isFooter
            ? "border-black/10 bg-white/70 text-neutral-950 placeholder:text-neutral-400 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#f2f3f4] dark:placeholder:text-[#8f8378]"
            : "border-black/10 bg-white text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-[#f2f3f4] dark:placeholder:text-[#5d6d7e]"
        }`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          isFooter
            ? "border border-primary-600 bg-primary-600 text-white hover:border-primary-700 hover:bg-primary-700 dark:border-primary-500 dark:bg-primary-500 dark:hover:border-primary-400 dark:hover:bg-primary-400"
            : "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
        }`}
        aria-label={isFooter ? "Subscribe to the Sunday letter" : undefined}
      >
        <span className={isFooter ? "sr-only sm:not-sr-only" : undefined}>
          {loading ? "..." : "Subscribe"}
        </span>
        {!loading && <ArrowRight className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}
