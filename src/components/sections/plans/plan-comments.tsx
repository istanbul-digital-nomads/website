"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
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
}

export function PlanComments({ planId, initial, isAttendee }: Props) {
  const t = useTranslations("plans.comments");
  const [comments, setComments] = useState(initial);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

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
      // optimistic-ish: refetch on next page nav, append locally
      setComments((c) => [
        ...c,
        {
          id: json.data.id,
          body: json.data.body,
          created_at: json.data.created_at,
          author: null,
        },
      ]);
      setBody("");
    } finally {
      setLoading(false);
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
        {comments.map((c) => (
          <li key={c.id} className="border border-ink-3 bg-ink-1 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-paper">
                {c.author?.display_name ?? "-"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                {new Date(c.created_at).toLocaleString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-paper-dim">
              {c.body}
            </p>
          </li>
        ))}
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
