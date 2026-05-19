"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import type { OnboardingData, FieldErrors } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
  errors: FieldErrors;
}

type AtmosphereOption = { key: string; value: string };
const ATMOSPHERE: readonly AtmosphereOption[] = [
  { key: "friendly", value: "friendly-and-social" },
  { key: "professional", value: "professional-networking" },
  { key: "party", value: "party-focused" },
  { key: "calm", value: "calm-and-activity-based" },
];

function CheckboxGroup({
  label,
  options,
  optionLabels,
  value,
  onChange,
}: {
  label: string;
  options: readonly AtmosphereOption[];
  optionLabels: (key: string) => string;
  value: string[];
  onChange: (val: string[]) => void;
}) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              value.includes(opt.value)
                ? "bg-primary-600 text-white"
                : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#1e2130] dark:text-[#99a3ad] dark:ring-white/5"
            }`}
          >
            {optionLabels(opt.key)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepFinal({ data, updateField, errors }: StepProps) {
  const t = useTranslations("onboardingPage.steps.final");
  const tAtmosphere = useTranslations(
    "onboardingPage.steps.final.atmosphereOptions",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast.error(t("photoTooLarge"), t("photoTooLargeDetail"));
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const ext = file.name.split(".").pop();
      const path = `${user.id}/verification.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (error) {
        showToast.error(t("uploadFailed"), error.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      updateField("photo_verification_url", publicUrl);
      showToast.success(t("photoUploadSuccess"));
    } catch {
      showToast.error(t("uploadFailedRetry"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#f2f3f4]">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
          {t("intro")}
        </p>
      </div>

      <Textarea
        label={t("whyJoin")}
        value={(data.why_join as string) || ""}
        onChange={(e) => updateField("why_join", e.target.value)}
        placeholder={t("whyJoinPlaceholder")}
        required
        error={errors.why_join}
      />

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
          {t("photoLabel")}
        </label>
        <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
          {t("photoHelper")}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-primary-300 bg-primary-50/30 px-4 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-800 dark:bg-primary-950/10 dark:text-primary-200"
        >
          <Upload className="h-4 w-4" />
          {data.photo_verification_url ? t("photoUploaded") : t("photoUpload")}
        </button>
        {Boolean(data.photo_verification_url) && (
          <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
            {t("photoSuccess")}
          </p>
        )}
      </div>

      <CheckboxGroup
        label={t("atmosphere")}
        options={ATMOSPHERE}
        optionLabels={(k) => tAtmosphere(k)}
        value={(data.atmosphere_preferences as string[]) || []}
        onChange={(v) => updateField("atmosphere_preferences", v)}
      />

      {/* Phase 3 nudge: host roles + is_agent see a "verify next" hint
          on the final step so they discover /dashboard/verify without
          having to hit the /plans/new ticketed-mode gate to find it. */}
      {(data.member_type === "local_guide" ||
        data.member_type === "tour_guide" ||
        data.is_agent === true) && (
        <div className="rounded-xl border border-sky-500/40 bg-sky-500/5 p-4">
          <p className="text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
            {t("verifyNudgeTitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#5d6d7e] dark:text-[#99a3ad]">
            {t("verifyNudgeBody")}
          </p>
        </div>
      )}
    </div>
  );
}
