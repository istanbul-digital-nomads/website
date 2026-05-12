"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(t("errorTitle"), data.error);
        return;
      }

      setSubmitted(true);
      showToast.success(t("successTitle"), t("successBody"));
    } catch {
      showToast.error(t("errorFallbackTitle"), t("errorFallbackBody"));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50/80 p-8 text-center dark:border-primary-900/40 dark:bg-primary-900/20">
        <p className="text-lg font-semibold text-primary-800 dark:text-primary-300">
          {t("successTitle")}
        </p>
        <p className="mt-2 text-sm text-primary-700 dark:text-primary-400">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t("nameLabel")}
        name="name"
        placeholder={t("namePlaceholder")}
        required
      />
      <Input
        label={t("emailLabel")}
        name="email"
        type="email"
        placeholder={t("emailPlaceholder")}
        required
      />
      <Textarea
        label={t("messageLabel")}
        name="message"
        placeholder={t("messagePlaceholder")}
        required
      />
      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        {t("submit")}
      </Button>
    </form>
  );
}
