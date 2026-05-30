"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Star, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

export interface ReviewItem {
  id: string;
  rating: number;
  would_return: boolean;
  body: string | null;
  created_at: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

interface Props {
  planId: string;
  initial: ReviewItem[];
  // True only for a non-host attendee, once the plan has ended.
  canReview: boolean;
  // Why the form is hidden, when the viewer is logged in but can't review.
  lockReason: "not-attended" | "not-ended" | null;
  currentMemberId: string;
  currentMemberName: string;
}

// Read-only row of 5 stars filled up to `value`.
function StarDisplay({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-3.5 w-3.5",
            n <= value
              ? "fill-ferry-yellow text-ferry-yellow"
              : "text-paper-faint",
          )}
        />
      ))}
    </span>
  );
}

export function PlanReviews({
  planId,
  initial,
  canReview,
  lockReason,
  currentMemberId,
  currentMemberName,
}: Props) {
  const t = useTranslations("plans.reviews");
  const [reviews, setReviews] = useState(initial);

  const mine = reviews.find((r) => r.author?.id === currentMemberId) ?? null;
  const [rating, setRating] = useState(mine?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(
    mine?.would_return ?? null,
  );
  const [body, setBody] = useState(mine?.body ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const summary = useMemo(() => {
    if (reviews.length === 0)
      return { average: null, count: 0, wouldReturn: 0 };
    const total = reviews.reduce((s, r) => s + r.rating, 0);
    return {
      average: Math.round((total / reviews.length) * 10) / 10,
      count: reviews.length,
      wouldReturn: reviews.filter((r) => r.would_return).length,
    };
  }, [reviews]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating < 1 || wouldReturn === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/plans/${planId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          would_return: wouldReturn,
          body: body.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error);
        return;
      }
      const saved: ReviewItem = {
        id: json.data.id,
        rating: json.data.rating,
        would_return: json.data.would_return,
        body: json.data.body,
        created_at: json.data.created_at,
        author: {
          id: currentMemberId,
          display_name: currentMemberName,
          avatar_url: null,
        },
      };
      setReviews((list) => {
        const without = list.filter((r) => r.author?.id !== currentMemberId);
        return [saved, ...without];
      });
      showToast.success(t("saved"));
    } finally {
      setLoading(false);
    }
  }

  async function removeMine() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/plans/${planId}/reviews`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        showToast.error(t("deleteError"), json.error);
        return;
      }
      setReviews((list) =>
        list.filter((r) => r.author?.id !== currentMemberId),
      );
      setRating(0);
      setWouldReturn(null);
      setBody("");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("title", { count: summary.count })}
        </h2>
        {summary.average != null && (
          <div className="flex items-center gap-2 text-sm text-paper">
            <StarDisplay value={Math.round(summary.average)} />
            <span className="font-medium">{summary.average.toFixed(1)}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              · {t("wouldReturn", { count: summary.wouldReturn })}
            </span>
          </div>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {reviews.length === 0 && (
          <li className="text-sm text-paper-dim">{t("empty")}</li>
        )}
        {reviews.map((r) => {
          const isOwn = r.author?.id === currentMemberId;
          const authorLabel = isOwn
            ? t("you")
            : (r.author?.display_name ?? "...");
          return (
            <li key={r.id} className="border border-ink-3 bg-ink-1 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={
                    isOwn
                      ? "text-sm font-medium text-terracotta"
                      : "text-sm font-medium text-paper"
                  }
                >
                  {authorLabel}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                    {new Date(r.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {isOwn && (
                    <button
                      type="button"
                      aria-label={t("delete")}
                      disabled={deleting}
                      onClick={removeMine}
                      className="inline-flex items-center justify-center text-paper-faint transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <StarDisplay value={r.rating} />
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider",
                    r.would_return ? "text-moss" : "text-paper-mute",
                  )}
                >
                  {r.would_return ? (
                    <ThumbsUp className="h-3 w-3" aria-hidden />
                  ) : (
                    <ThumbsDown className="h-3 w-3" aria-hidden />
                  )}
                  {r.would_return ? t("recommendYes") : t("recommendNo")}
                </span>
              </div>
              {r.body && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-paper-dim">
                  {r.body}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {canReview ? (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {mine ? t("update") : t("rate")}
          </p>

          {/* Star input */}
          <div
            className="flex items-center gap-1"
            role="radiogroup"
            aria-label={t("rate")}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n}`}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    n <= (hover || rating)
                      ? "fill-ferry-yellow text-ferry-yellow"
                      : "text-paper-faint",
                  )}
                />
              </button>
            ))}
          </div>

          {/* Would return toggle */}
          <div>
            <p className="text-sm text-paper-dim">{t("recommendQuestion")}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setWouldReturn(true)}
                className={cn(
                  "inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                  wouldReturn === true
                    ? "border-moss bg-moss/10 text-moss"
                    : "border-ink-4 text-paper-mute hover:border-paper",
                )}
              >
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                {t("recommendYes")}
              </button>
              <button
                type="button"
                onClick={() => setWouldReturn(false)}
                className={cn(
                  "inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                  wouldReturn === false
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-ink-4 text-paper-mute hover:border-paper",
                )}
              >
                <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
                {t("recommendNo")}
              </button>
            </div>
          </div>

          <Textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("placeholder")}
            maxLength={1000}
            rows={3}
          />
          <Button
            type="submit"
            loading={loading}
            disabled={rating < 1 || wouldReturn === null}
            size="sm"
          >
            {mine ? t("submitUpdate") : t("submit")}
          </Button>
        </form>
      ) : lockReason ? (
        <p className="mt-6 border border-ink-3 bg-ink-1 p-4 text-sm text-paper-dim">
          {lockReason === "not-ended"
            ? t("lockedNotEnded")
            : t("lockedNotAttended")}
        </p>
      ) : null}
    </section>
  );
}
