"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import type { OnboardingData, FieldErrors } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
  errors: FieldErrors;
}

export function StepContact({ data, updateField, errors }: StepProps) {
  const t = useTranslations("onboardingPage.steps.contact");
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

      <Input
        label={t("phone")}
        value={(data.phone_whatsapp as string) || ""}
        onChange={(e) => updateField("phone_whatsapp", e.target.value)}
        placeholder={t("phonePlaceholder")}
        type="tel"
        helperText={t("phoneHelper")}
      />

      <Input
        label={t("email")}
        value={(data.email as string) || ""}
        disabled
        helperText={t("emailHelper")}
      />

      <Input
        label={t("profession")}
        value={(data.profession as string) || ""}
        onChange={(e) => updateField("profession", e.target.value)}
        placeholder={t("professionPlaceholder")}
        required
        error={errors.profession}
      />

      <Input
        label={t("social")}
        value={(data.social_profile as string) || ""}
        onChange={(e) => updateField("social_profile", e.target.value)}
        placeholder={t("socialPlaceholder")}
        helperText={t("socialHelper")}
      />
    </div>
  );
}
