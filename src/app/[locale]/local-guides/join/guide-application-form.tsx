"use client";

import { useState, type FormEvent } from "react";
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
        showToast.error("Couldn't submit", data.error);
        return;
      }

      setSubmitted(true);
      showToast.guideApplication();
    } catch {
      showToast.error("Something went wrong", "Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50/80 p-8 text-center dark:border-primary-900/40 dark:bg-primary-900/20">
        <p className="text-lg font-semibold text-primary-800 dark:text-primary-300">
          Thanks for applying!
        </p>
        <p className="mt-2 text-sm text-primary-700 dark:text-primary-400">
          We&apos;ll review your application and get back to you within a few
          days. In the meantime, feel free to join our Telegram group.
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
            Your details
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            Basic info so we know who you are.
          </p>
        </div>
        <Input
          label="Full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Phone / WhatsApp"
          value={form.phone_whatsapp}
          onChange={(e) => update("phone_whatsapp", e.target.value)}
          placeholder="+90 ..."
          helperText="Optional - makes it easier for us to reach you"
        />
      </div>

      {/* Section 2: Your Expertise */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            Your expertise
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            What do you know best about Istanbul?
          </p>
        </div>
        <MultiSelectToggle
          label="Languages you speak"
          options={commonLanguages}
          value={form.languages}
          onChange={(v) => update("languages", v)}
          required
        />
        <MultiSelectToggle
          label="Areas of expertise"
          options={guideSpecializations}
          value={form.specializations}
          onChange={(v) => update("specializations", v)}
          required
        />
        <MultiSelectToggle
          label="Neighborhoods you know well"
          options={istanbulNeighborhoods}
          value={form.neighborhoods}
          onChange={(v) => update("neighborhoods", v)}
          required
        />
        <Input
          label="Years living in Istanbul"
          type="number"
          min={0}
          value={form.years_in_istanbul}
          onChange={(e) => update("years_in_istanbul", e.target.value)}
          placeholder="2"
          required
        />
        <MultiSelectToggle
          label="Where did you move from?"
          options={ORIGIN_COUNTRY_OPTIONS}
          value={form.origin_countries}
          onChange={(v) => update("origin_countries", v)}
        />
      </div>

      {/* Section 3: Tell Us About Yourself */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            Tell us about yourself
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            Help us understand what makes you a great guide.
          </p>
        </div>
        <Textarea
          label="Bio"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="Tell us about yourself, your background, and your experience in Istanbul..."
          helperText="At least 50 characters"
          required
        />
        <Textarea
          label="Your best local tip"
          value={form.sample_tip}
          onChange={(e) => update("sample_tip", e.target.value)}
          placeholder="Share a specific tip that shows what you know - a hidden cafe, a visa shortcut, a neighborhood secret..."
          helperText="This helps us understand your style and depth of knowledge"
          required
        />
        <Textarea
          label="Why do you want to be a guide?"
          value={form.motivation}
          onChange={(e) => update("motivation", e.target.value)}
          placeholder="What motivates you to help newcomers in Istanbul?"
          required
        />
      </div>

      {/* Section 4: Social Profiles */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            Social profiles
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-[#85929e]">
            Optional - helps us verify who you are and lets people find you.
          </p>
        </div>
        <Input
          label="Instagram"
          value={form.social_instagram}
          onChange={(e) => update("social_instagram", e.target.value)}
          placeholder="https://instagram.com/yourhandle"
        />
        <Input
          label="LinkedIn"
          value={form.social_linkedin}
          onChange={(e) => update("social_linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <Input
          label="Twitter / X"
          value={form.social_twitter}
          onChange={(e) => update("social_twitter", e.target.value)}
          placeholder="https://twitter.com/yourhandle"
        />
        <Input
          label="Personal website"
          value={form.social_website}
          onChange={(e) => update("social_website", e.target.value)}
          placeholder="https://yoursite.com"
        />
      </div>

      {/* Section 5: Almost Done */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            Almost done
          </h2>
        </div>
        <Input
          label="Profile photo URL"
          value={form.photo_url}
          onChange={(e) => update("photo_url", e.target.value)}
          placeholder="https://..."
          helperText="Link to a photo of yourself (LinkedIn, Instagram, or any public URL)"
        />
        <Textarea
          label="References"
          value={form.references_text}
          onChange={(e) => update("references_text", e.target.value)}
          placeholder="Anyone in the community who can vouch for you? (optional)"
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
              I agree to the community guidelines and understand that my
              application will be reviewed by the team. I&apos;ll represent the
              community with kindness and honesty.{" "}
              <span className="text-red-500">*</span>
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
        Submit application
      </Button>
    </form>
  );
}
