"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import type { OnboardingData } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
}

const ATMOSPHERE = [
  "Friendly and social",
  "Professional networking",
  "Party-focused",
  "Dating-focused",
  "Calm and activity-based",
  "Not sure",
];

const CONTRIBUTIONS = [
  "Attend events regularly",
  "Help promote events",
  "Host in the future",
  "Volunteer",
  "Just participate for now",
];

const DISAGREEMENT = [
  "Talk calmly with the person",
  "Inform the host/admin",
  "Leave the situation",
  "Confront publicly",
  "Other",
];

function CheckboxGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
}) {
  function toggle(opt: string) {
    const key = opt.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (value.includes(key)) {
      onChange(value.filter((v) => v !== key));
    } else {
      onChange([...value, key]);
    }
  }
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const key = opt.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                value.includes(key)
                  ? "bg-primary-600 text-white"
                  : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#231a14] dark:text-[#b8a898] dark:ring-white/5"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepFinal({ data, updateField }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast.error("Photo too large", "Maximum 10 MB.");
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
        showToast.error("Upload failed", error.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      updateField("photo_verification_url", publicUrl);
      showToast.success("Photo uploaded!");
    } catch {
      showToast.error("Upload failed. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2a2018] dark:text-[#f7f2ea]">
          Almost done!
        </h2>
        <p className="mt-1 text-sm text-[#6b6257] dark:text-[#b8a898]">
          A few more things to help us get to know you better.
        </p>
      </div>

      <Textarea
        label="In a few sentences, tell us why you'd like to join:"
        value={(data.why_join as string) || ""}
        onChange={(e) => updateField("why_join", e.target.value)}
        placeholder="What brings you to Istanbul? What are you hoping to find in this community?"
      />

      <Input
        label="Do you have any friends already in the community? If yes, who?"
        value={(data.friends_in_community as string) || ""}
        onChange={(e) => updateField("friends_in_community", e.target.value)}
        placeholder="Name(s) or 'No'"
      />

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
          Photo Verification
        </label>
        <p className="mt-1 text-xs text-[#6b6257] dark:text-[#b8a898]">
          Upload a clear photo of yourself. This helps us maintain a safe
          community. Max 10 MB.
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
          className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-primary-300 bg-primary-50/30 px-4 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-800 dark:bg-primary-950/10 dark:text-primary-300"
        >
          <Upload className="h-4 w-4" />
          {data.photo_verification_url
            ? "Photo uploaded - change"
            : "Upload photo"}
        </button>
        {Boolean(data.photo_verification_url) && (
          <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
            Photo uploaded successfully.
          </p>
        )}
      </div>

      <CheckboxGroup
        label="What kind of atmosphere are you looking for?"
        options={ATMOSPHERE}
        value={(data.atmosphere_preferences as string[]) || []}
        onChange={(v) => updateField("atmosphere_preferences", v)}
      />

      <CheckboxGroup
        label="How would you like to contribute?"
        options={CONTRIBUTIONS}
        value={(data.contribution_preferences as string[]) || []}
        onChange={(v) => updateField("contribution_preferences", v)}
      />

      <CheckboxGroup
        label="If you have a disagreement with another member, how would you handle it?"
        options={DISAGREEMENT}
        value={(data.disagreement_handling as string[]) || []}
        onChange={(v) => updateField("disagreement_handling", v)}
      />

      {/* Real name on WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
          Is the name you provided your real full name as used on WhatsApp?
        </label>
        <div className="mt-2 flex gap-2">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                updateField("real_name_on_whatsapp", opt === "Yes")
              }
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                (opt === "Yes" && data.real_name_on_whatsapp === true) ||
                (opt === "No" && data.real_name_on_whatsapp === false)
                  ? "bg-primary-600 text-white"
                  : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 dark:bg-[#1c1614] dark:text-[#b8a898] dark:ring-white/5"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
