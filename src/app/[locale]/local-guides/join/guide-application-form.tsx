"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelectToggle } from "@/components/ui/multi-select-toggle";
import { showToast } from "@/lib/toast";
import {
  guideSpecializations,
  istanbulNeighborhoods,
  commonLanguages,
} from "@/lib/constants";
import { COUNTRIES } from "@/lib/path-to-istanbul";

const ORIGIN_COUNTRY_OPTIONS = COUNTRIES.map((c) => ({
  value: c.code,
  label: `${c.flag} ${c.name}`,
}));

interface FormData {
  name: string;
  email: string;
  phone_whatsapp: string;
  languages: string[];
  specializations: string[];
  neighborhoods: string[];
  origin_countries: string[];
  years_in_istanbul: string;
  bio: string;
  sample_tip: string;
  motivation: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
  social_website: string;
  photo_url: string;
  references_text: string;
  agrees_guidelines: boolean;
}

const initial: FormData = {
  name: "",
  email: "",
  phone_whatsapp: "",
  languages: [],
  specializations: [],
  neighborhoods: [],
  origin_countries: [],
  years_in_istanbul: "",
  bio: "",
  sample_tip: "",
  motivation: "",
  social_instagram: "",
  social_linkedin: "",
  social_twitter: "",
  social_website: "",
  photo_url: "",
  references_text: "",
  agrees_guidelines: false,
};

export function GuideApplicationForm() {
  const t = useTranslations("localGuidesJoinPage");
  const [form, setForm] = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...form,
      years_in_istanbul: parseInt(form.years_in_istanbul, 10) || 0,
      phone_whatsapp: form.phone_whatsapp || undefined,
      social_instagram: form.social_instagram || undefined,
      social_linkedin: form.social_linkedin || undefined,
      social_twitter: form.social_twitter || undefined,
      social_website: form.social_website || undefined,
      photo_url: form.photo_url || undefined,
      references_text: form.references_text || undefined,
      origin_countries: form.origin_countries.length
        ? form.origin_countries
        : undefined,
    };

    try {
      const res = await fetch("/api/local-guides/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(t("toast.errorTitle"), data.error);
        return;
      }

      setSubmitted(true);
      showToast.success(t("toast.successTitle"), t("toast.successBody"));
    } catch {
      showToast.error(
        t("toast.genericErrorTitle"),
        t("toast.genericErrorBody"),
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50/80 p-8 text-center dark:border-primary-900/40 dark:bg-primary-900/20">
        <p className="text-lg font-semibold text-primary-800 dark:text-primary-300">
          {t("submitted.title")}
        </p>
        <p className="mt-2 text-sm text-primary-700 dark:text-primary-400">
          {t("submitted.body")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Section 1: Your Details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            {t("sections.yourDetails.title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            {t("sections.yourDetails.subtitle")}
          </p>
        </div>
        <Input
          label={t("fields.name.label")}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder={t("fields.name.placeholder")}
          required
        />
        <Input
          label={t("fields.email.label")}
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder={t("fields.email.placeholder")}
          required
        />
        <Input
          label={t("fields.phone.label")}
          value={form.phone_whatsapp}
          onChange={(e) => update("phone_whatsapp", e.target.value)}
          placeholder={t("fields.phone.placeholder")}
          helperText={t("fields.phone.helper")}
        />
      </div>

      {/* Section 2: Your Expertise */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            {t("sections.expertise.title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            {t("sections.expertise.subtitle")}
          </p>
        </div>
        <MultiSelectToggle
          label={t("fields.languages.label")}
          options={commonLanguages}
          value={form.languages}
          onChange={(v) => update("languages", v)}
          required
        />
        <MultiSelectToggle
          label={t("fields.specializations.label")}
          options={guideSpecializations}
          value={form.specializations}
          onChange={(v) => update("specializations", v)}
          required
        />
        <MultiSelectToggle
          label={t("fields.neighborhoods.label")}
          options={istanbulNeighborhoods}
          value={form.neighborhoods}
          onChange={(v) => update("neighborhoods", v)}
          required
        />
        <Input
          label={t("fields.yearsInIstanbul.label")}
          type="number"
          min={0}
          value={form.years_in_istanbul}
          onChange={(e) => update("years_in_istanbul", e.target.value)}
          placeholder={t("fields.yearsInIstanbul.placeholder")}
          required
        />
        <MultiSelectToggle
          label={t("fields.originCountries.label")}
          options={ORIGIN_COUNTRY_OPTIONS}
          value={form.origin_countries}
          onChange={(v) => update("origin_countries", v)}
        />
      </div>

      {/* Section 3: Tell Us About Yourself */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            {t("sections.aboutYou.title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            {t("sections.aboutYou.subtitle")}
          </p>
        </div>
        <Textarea
          label={t("fields.bio.label")}
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder={t("fields.bio.placeholder")}
          helperText={t("fields.bio.helper")}
          required
        />
        <Textarea
          label={t("fields.sampleTip.label")}
          value={form.sample_tip}
          onChange={(e) => update("sample_tip", e.target.value)}
          placeholder={t("fields.sampleTip.placeholder")}
          helperText={t("fields.sampleTip.helper")}
          required
        />
        <Textarea
          label={t("fields.motivation.label")}
          value={form.motivation}
          onChange={(e) => update("motivation", e.target.value)}
          placeholder={t("fields.motivation.placeholder")}
          required
        />
      </div>

      {/* Section 4: Social Profiles */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            {t("sections.social.title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            {t("sections.social.subtitle")}
          </p>
        </div>
        <Input
          label={t("fields.instagram.label")}
          value={form.social_instagram}
          onChange={(e) => update("social_instagram", e.target.value)}
          placeholder={t("fields.instagram.placeholder")}
        />
        <Input
          label={t("fields.linkedin.label")}
          value={form.social_linkedin}
          onChange={(e) => update("social_linkedin", e.target.value)}
          placeholder={t("fields.linkedin.placeholder")}
        />
        <Input
          label={t("fields.twitter.label")}
          value={form.social_twitter}
          onChange={(e) => update("social_twitter", e.target.value)}
          placeholder={t("fields.twitter.placeholder")}
        />
        <Input
          label={t("fields.website.label")}
          value={form.social_website}
          onChange={(e) => update("social_website", e.target.value)}
          placeholder={t("fields.website.placeholder")}
        />
      </div>

      {/* Section 5: Almost Done */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            {t("sections.almostDone.title")}
          </h2>
        </div>
        <Input
          label={t("fields.photoUrl.label")}
          value={form.photo_url}
          onChange={(e) => update("photo_url", e.target.value)}
          placeholder={t("fields.photoUrl.placeholder")}
          helperText={t("fields.photoUrl.helper")}
        />
        <Textarea
          label={t("fields.references.label")}
          value={form.references_text}
          onChange={(e) => update("references_text", e.target.value)}
          placeholder={t("fields.references.placeholder")}
        />
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.agrees_guidelines}
              onChange={(e) => update("agrees_guidelines", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              required
            />
            <span className="text-sm text-neutral-600 dark:text-[#99a3ad]">
              {t("fields.guidelines")} <span className="text-red-500">*</span>
            </span>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        size="lg"
        className="w-full rounded-full sm:w-auto"
      >
        {t("submit")}
      </Button>
    </form>
  );
}
