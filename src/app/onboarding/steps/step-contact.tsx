"use client";

import { Input } from "@/components/ui/input";
import type { OnboardingData } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
}

export function StepContact({ data, updateField }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2a2018] dark:text-[#f7f2ea]">
          Contact & Work
        </h2>
        <p className="mt-1 text-sm text-[#6b6257] dark:text-[#b8a898]">
          How can the community reach you, and what do you do?
        </p>
      </div>

      <Input
        label="Phone Number (WhatsApp)"
        value={(data.phone_whatsapp as string) || ""}
        onChange={(e) => updateField("phone_whatsapp", e.target.value)}
        placeholder="+90 5XX XXX XXXX"
        type="tel"
      />

      <Input
        label="Email Address"
        value={(data.email as string) || ""}
        disabled
        helperText="From your Google account - can't be changed here."
      />

      <Input
        label="Profession / Field of Work"
        value={(data.profession as string) || ""}
        onChange={(e) => updateField("profession", e.target.value)}
        placeholder="e.g., Software Developer, Designer, Writer"
      />

      <Input
        label="Instagram or LinkedIn profile"
        value={(data.social_profile as string) || ""}
        onChange={(e) => updateField("social_profile", e.target.value)}
        placeholder="https://instagram.com/yourname or linkedin.com/in/yourname"
        helperText="Helps us verify you're a real person."
      />
    </div>
  );
}
