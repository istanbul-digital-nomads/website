"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

interface CommentItem {
  id: string;
  body: string;
  created_at: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

interface Props {
  planId: string;
  initial: CommentItem[];
  isAttendee: boolean;
  currentMemberId: string;
  currentMemberName: string;
}

export function PlanComments({
  planId,
  initial,
  isAttendee,
  currentMemberId,
  currentMemberName,
}: Props) {
  const t = useTranslations("plans.comments");
  const [comments, setComments] = useState(initial);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/plans/${planId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error);
        return;
      }
      setComments((c) => [
        ...c,
        {
          id: json.data.id,
          body: json.data.body,
          created_at: json.data.created_at,
          author: {
            id: currentMemberId,
            display_name: currentMemberName,
            avatar_url: null,
          },
        },
      ]);
      setBody("");
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(commentId: string) {
    setDeletingIds((prev) => new Set(prev).add(commentId));
    try {
      const res = await fetch(`/api/plans/${planId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        showToast.error(t("deleteError"), json.error);
        return;
      }
      setComments((c) => c.filter((item) => item.id !== commentId));
    } catch {
      showToast.error(t("deleteError"), undefined);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  }

  return (
    <section>
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
        {t("title", { count: comments.length })}
      </h2>

      <ul className="mt-4 space-y-3">
        {comments.length === 0 && (
          <li className="text-sm text-paper-dim">{t("empty")}</li>
        )}
        {comments.map((c) => {
          const isOwn = c.author?.id === currentMemberId;
          const authorLabel = isOwn
            ? t("you")
            : (c.author?.display_name ?? "...");
          return (
            <li key={c.id} className="border border-ink-3 bg-ink-1 p-4">
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
                    {new Date(c.created_at).toLocaleString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {isOwn && (
                    <button
                      type="button"
                      aria-label={t("delete")}
                      disabled={deletingIds.has(c.id)}
                      onClick={() => deleteComment(c.id)}
                      className="inline-flex items-center justify-center text-paper-faint transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-paper-dim">
                {c.body}
              </p>
            </li>
          );
        })}
      </ul>

      {isAttendee && (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("placeholder")}
            maxLength={500}
            rows={3}
          />
          <Button
            type="submit"
            loading={loading}
            disabled={!body.trim()}
            size="sm"
          >
            {t("submit")}
          </Button>
        </form>
      )}
    </section>
  );
}
