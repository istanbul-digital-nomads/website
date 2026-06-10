"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";

// One-click-ish unsubscribe: the email + signed token come from the link, and
// the visitor confirms with a button (a plain GET link would let email
// scanners/prefetchers unsubscribe people by accident). On success we show a
// done state with a way back. A missing/!valid token is handled by the API.
export function UnsubscribeForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const t = useTranslations("unsubscribe");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    email && token ? "idle" : "error",
  );

  async function unsubscribe() {
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mt-6">
        <p className="text-[15px] leading-relaxed text-paper-dim">
          {t("doneBody", { email })}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-medium text-terracotta-ink hover:underline"
        >
          {t("backHome")}
        </Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-6">
        <p className="text-[15px] leading-relaxed text-paper-dim">
          {t("errorBody")}
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex text-sm font-medium text-terracotta-ink hover:underline"
        >
          {t("contactUs")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-[15px] leading-relaxed text-paper-dim">
        {t("confirmBody", { email })}
      </p>
      <div className="mt-6">
        <Button onClick={unsubscribe} loading={state === "loading"} size="sm">
          {t("confirmButton")}
        </Button>
      </div>
    </div>
  );
}
