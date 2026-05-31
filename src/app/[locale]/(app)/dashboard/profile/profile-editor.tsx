"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Camera, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ChipInput } from "@/components/ui/chip-input";
import { LocationPicker } from "@/components/ui/location-picker";
import { NationalityPicker } from "@/components/ui/nationality-picker";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { CURRENT_STATUS_OPTIONS } from "@/lib/member-profile";

type Data = Record<string, unknown>;

const ONBOARDING_ROLES = ["nomad", "remote_worker"] as const;
const ARRIVAL_STATUS = ["in_istanbul", "elsewhere_turkey", "planning"] as const;
const AGE_RANGES = ["18-24", "25-29", "30-35", "36-40", "41-50", "50+"];
const GENDERS: { key: string; value: string }[] = [
  { key: "female", value: "female" },
  { key: "male", value: "male" },
  { key: "preferNotToSay", value: "prefer-not-to-say" },
];

// Editable, section-by-section profile editor. Unlike the onboarding
// wizard (a linear first-run flow), this lets a member jump to any
// section and save just that part. Each card owns a Save button that
// writes only its own fields, so an update to "Contact" never touches
// "Interests".

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

function AvatarUpload({
  userId,
  displayName,
  initialUrl,
}: {
  userId: string;
  displayName: string;
  initialUrl: string | null;
}) {
  const t = useTranslations("profileEditor.avatar");
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials =
    displayName
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·";

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!inputRef.current) inputRef.current = e.target;
    // Reset so the same file can be re-selected after an error.
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      showToast.error(t("tooLarge"));
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const { error: dbErr } = await (supabase.from("members") as any)
        .update({ avatar_url: publicUrl })
        .eq("id", userId);
      if (dbErr) throw dbErr;
      setUrl(publicUrl);
      showToast.success(t("saved"));
    } catch {
      showToast.error(t("uploadError"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={t("changePhoto")}
      title={t("changePhoto")}
      disabled={uploading}
      onClick={() => inputRef.current?.click()}
      className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
    >
      {url ? (
        <Image
          src={url}
          alt={displayName}
          fill
          className="object-cover"
          sizes="80px"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-ink-3 font-display text-xl text-paper-mute">
          {initials}
        </span>
      )}
      {/* Hover overlay */}
      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink-0/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-paper" aria-hidden />
        ) : (
          <Camera className="h-5 w-5 text-paper" aria-hidden />
        )}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        aria-hidden
      />
    </button>
  );
}

export function ProfileEditor({
  member,
  email,
}: {
  member: Data;
  email: string;
}) {
  const router = useRouter();
  const t = useTranslations("profileEditor");
  const tRoles = useTranslations(
    "onboardingPage.steps.interests.memberTypeOptions",
  );
  const tArrival = useTranslations(
    "onboardingPage.steps.interests.arrivalStatusOptions",
  );
  const tStatus = useTranslations(
    "onboardingPage.steps.interests.currentStatusOptions",
  );
  const tGenders = useTranslations("onboardingPage.steps.about.genders");

  const [form, setForm] = useState<Data>(() => ({ ...member }));
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const set = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const saveSection = useCallback(
    async (sectionKey: string, fields: string[]) => {
      setSavingKey(sectionKey);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          showToast.error(t("signInAgain"));
          router.push("/login");
          return;
        }
        const patch: Data = {};
        for (const f of fields) {
          const v = form[f];
          // Empty strings -> null so optional date/text columns clear
          // cleanly (a "" date value errors against a Postgres date column).
          patch[f] = v === "" || v === undefined ? null : v;
        }
        const { error } = await (supabase.from("members") as any)
          .update(patch)
          .eq("id", user.id);
        if (error) {
          showToast.error(t("saveError"), error.message);
          return;
        }
        showToast.success(t("sectionSaved"));
        router.refresh();
      } catch {
        showToast.error(t("saveError"));
      } finally {
        setSavingKey(null);
      }
    },
    [form, router, t],
  );

  const memberType = (form.member_type as string) || "";

  return (
    <section className="bg-ink-0 pb-24 pt-8 md:pt-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* Masthead */}
          <div className="flex items-center gap-5">
            <AvatarUpload
              userId={(form.id as string) || ""}
              displayName={(form.display_name as string) || email}
              initialUrl={(form.avatar_url as string) || null}
            />
            <div>
              <h1 className="font-display text-h2 leading-tight text-paper">
                {t("title")}
              </h1>
              <p className="mt-1 text-sm text-paper-dim">{t("intro")}</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {/* ABOUT */}
            <SectionCard
              title={t("about.title")}
              description={t("about.description")}
              saving={savingKey === "about"}
              onSave={() =>
                saveSection("about", [
                  "display_name",
                  "bio",
                  "nationality",
                  "gender",
                  "age_range",
                  "birthday",
                ])
              }
              saveLabel={t("save")}
            >
              <Input
                label={t("about.displayName")}
                value={(form.display_name as string) || ""}
                onChange={(e) => set("display_name", e.target.value)}
              />
              <Textarea
                label={t("about.bio")}
                value={(form.bio as string) || ""}
                onChange={(e) => set("bio", e.target.value)}
                maxLength={400}
                placeholder={t("about.bioPlaceholder")}
              />
              <NationalityPicker
                label={t("about.nationality")}
                value={(form.nationality as string) || null}
                onChange={(v) => set("nationality", v)}
              />
              <PillGroup
                label={t("about.gender")}
                options={GENDERS.map((g) => ({
                  value: g.value,
                  label: tGenders(g.key),
                }))}
                value={(form.gender as string) || ""}
                onSelect={(v) => set("gender", v)}
              />
              <PillGroup
                label={t("about.ageRange")}
                options={AGE_RANGES.map((r) => ({ value: r, label: r }))}
                value={(form.age_range as string) || ""}
                onSelect={(v) => set("age_range", v)}
              />
            </SectionCard>

            {/* LOCATION */}
            <SectionCard
              title={t("location.title")}
              description={t("location.description")}
              saving={savingKey === "location"}
              onSave={() =>
                saveSection("location", ["location", "city_district"])
              }
              saveLabel={t("save")}
            >
              <LocationPicker
                label={t("location.field")}
                district={(form.location as string) || null}
                neighborhood={(form.city_district as string) || null}
                onChange={(district, neighborhood) => {
                  set("location", district);
                  set("city_district", neighborhood);
                }}
              />
            </SectionCard>

            {/* WORK */}
            <SectionCard
              title={t("work.title")}
              description={t("work.description")}
              saving={savingKey === "work"}
              onSave={() =>
                saveSection("work", [
                  "member_type",
                  "arrival_status",
                  "profession",
                  "professional_role",
                  "skills",
                ])
              }
              saveLabel={t("save")}
            >
              <PillGroup
                label={t("work.role")}
                options={ONBOARDING_ROLES.map((r) => ({
                  value: r,
                  label: tRoles(r),
                }))}
                value={memberType}
                onSelect={(v) => set("member_type", v)}
              />
              <p className="-mt-2 text-xs text-paper-mute">
                {t("work.roleNote")}
              </p>
              <PillGroup
                label={t("work.arrival")}
                options={ARRIVAL_STATUS.map((a) => ({
                  value: a,
                  label: tArrival(a),
                }))}
                value={(form.arrival_status as string) || ""}
                onSelect={(v) => set("arrival_status", v)}
              />
              <Input
                label={t("work.profession")}
                value={(form.profession as string) || ""}
                onChange={(e) => set("profession", e.target.value)}
              />
              {memberType === "remote_worker" && (
                <Input
                  label={t("work.professionalRole")}
                  value={(form.professional_role as string) || ""}
                  onChange={(e) => set("professional_role", e.target.value)}
                />
              )}
              <ChipInput
                label={t("work.skills")}
                hint={t("work.skillsHint")}
                placeholder={t("work.skillsPlaceholder")}
                removeLabel={t("chipRemove")}
                value={(form.skills as string[]) || []}
                onChange={(v) => set("skills", v)}
                max={12}
              />
            </SectionCard>

            {/* INTERESTS */}
            <SectionCard
              title={t("interests.title")}
              description={t("interests.description")}
              saving={savingKey === "interests"}
              onSave={() =>
                saveSection("interests", [
                  "current_status",
                  "working_on",
                  "wants_to_talk_about",
                  "hobbies",
                ])
              }
              saveLabel={t("save")}
            >
              <PillGroup
                label={t("interests.status")}
                options={CURRENT_STATUS_OPTIONS.map((s) => ({
                  value: s,
                  label: tStatus(s),
                }))}
                value={(form.current_status as string) || ""}
                onSelect={(v) => set("current_status", v)}
              />
              <ChipInput
                label={t("interests.workingOn")}
                removeLabel={t("chipRemove")}
                value={(form.working_on as string[]) || []}
                onChange={(v) => set("working_on", v)}
                max={8}
              />
              <ChipInput
                label={t("interests.wantsToTalk")}
                removeLabel={t("chipRemove")}
                value={(form.wants_to_talk_about as string[]) || []}
                onChange={(v) => set("wants_to_talk_about", v)}
                max={8}
              />
              <ChipInput
                label={t("interests.hobbies")}
                removeLabel={t("chipRemove")}
                value={(form.hobbies as string[]) || []}
                onChange={(v) => set("hobbies", v)}
                max={12}
              />
            </SectionCard>

            {/* STAY */}
            <SectionCard
              title={t("stay.title")}
              description={t("stay.description")}
              saving={savingKey === "stay"}
              onSave={() =>
                saveSection("stay", [
                  "move_in_date",
                  "planned_move_out_date",
                  "favorite_spots",
                ])
              }
              saveLabel={t("save")}
            >
              <Input
                type="date"
                label={t("stay.moveIn")}
                value={(form.move_in_date as string) || ""}
                onChange={(e) => set("move_in_date", e.target.value)}
              />
              <Input
                type="date"
                label={t("stay.moveOut")}
                value={(form.planned_move_out_date as string) || ""}
                onChange={(e) => set("planned_move_out_date", e.target.value)}
              />
              <ChipInput
                label={t("stay.favoriteSpots")}
                hint={t("stay.favoriteSpotsHint")}
                removeLabel={t("chipRemove")}
                value={(form.favorite_spots as string[]) || []}
                onChange={(v) => set("favorite_spots", v)}
                max={10}
              />
            </SectionCard>

            {/* CONTACT */}
            <SectionCard
              title={t("contact.title")}
              description={t("contact.description")}
              saving={savingKey === "contact"}
              onSave={() =>
                saveSection("contact", [
                  "telegram_handle",
                  "website",
                  "phone_whatsapp",
                ])
              }
              saveLabel={t("save")}
            >
              <Input
                label={t("contact.email")}
                value={email}
                disabled
                helperText={t("contact.emailNote")}
              />
              <Input
                label={t("contact.telegram")}
                value={(form.telegram_handle as string) || ""}
                onChange={(e) => set("telegram_handle", e.target.value)}
                placeholder="@handle"
              />
              <Input
                label={t("contact.website")}
                value={(form.website as string) || ""}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://"
              />
              <Input
                label={t("contact.whatsapp")}
                value={(form.phone_whatsapp as string) || ""}
                onChange={(e) => set("phone_whatsapp", e.target.value)}
              />
            </SectionCard>

            {/* VISIBILITY */}
            <SectionCard
              title={t("visibility.title")}
              description={t("visibility.description")}
              saving={savingKey === "visibility"}
              onSave={() => saveSection("visibility", ["is_visible"])}
              saveLabel={t("save")}
            >
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(form.is_visible)}
                  onChange={(e) => set("is_visible", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600"
                />
                <span className="text-sm text-paper-dim">
                  {t("visibility.toggle")}
                </span>
              </label>
            </SectionCard>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SectionCard({
  title,
  description,
  children,
  onSave,
  saving,
  saveLabel,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave: () => void;
  saving: boolean;
  saveLabel: string;
}) {
  return (
    <div className="rounded-xl border border-ink-3 bg-ink-1 p-6">
      <h2 className="font-display text-lg text-paper">{title}</h2>
      {description && (
        <p className="mt-1 text-[13px] text-paper-mute">{description}</p>
      )}
      <div className="mt-5 space-y-5">{children}</div>
      <div className="mt-6 flex justify-end">
        <Button
          onClick={onSave}
          loading={saving}
          size="sm"
          className="min-h-11 w-full px-6 sm:w-auto"
        >
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}

function PillGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              value === opt.value
                ? "bg-primary-600 text-white"
                : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#1e2130] dark:text-[#99a3ad] dark:ring-white/5"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
