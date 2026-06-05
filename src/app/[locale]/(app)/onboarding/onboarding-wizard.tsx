"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { StepAbout } from "./steps/step-about";
import { StepContact } from "./steps/step-contact";
import { StepInterests } from "./steps/step-interests";
import { StepGuidelines } from "./steps/step-guidelines";
import { StepFinal } from "./steps/step-final";

export type OnboardingData = Record<string, unknown>;
export type FieldErrors = Record<string, string>;

// Empty strings -> null before writing, so optional date columns (e.g.
// move_in_date) don't get a "" that Postgres rejects as invalid date.
function nullifyEmpty(data: OnboardingData): OnboardingData {
  const out: OnboardingData = {};
  for (const [k, v] of Object.entries(data)) out[k] = v === "" ? null : v;
  return out;
}

interface OnboardingWizardProps {
  initialData: {
    display_name: string;
    email: string;
    avatar_url: string;
  };
  /**
   * Full member row. When `existing.onboarding_completed` is true the
   * wizard pre-fills every step from the member's saved profile (edit
   * mode) and tweaks the submit copy accordingly. When omitted or false,
   * the wizard runs as first-time onboarding.
   */
  existing?: Record<string, unknown> | null;
}

const STEPS = [
  { key: "about", component: StepAbout },
  { key: "contact", component: StepContact },
  { key: "interests", component: StepInterests },
  { key: "guidelines", component: StepGuidelines },
  { key: "final", component: StepFinal },
] as const;

function useValidator() {
  const tValidation = useTranslations("onboardingPage.validation");

  return useCallback(
    (step: number, data: OnboardingData): FieldErrors => {
      const errors: FieldErrors = {};

      switch (step) {
        case 0: {
          const name = (data.display_name as string)?.trim();
          if (!name) errors.display_name = tValidation("displayName");
          if (!data.age_range && !data.birthday) {
            errors.age_or_birthday = tValidation("ageOrBirthday");
          }
          break;
        }
        case 1: {
          const profession = (data.profession as string)?.trim();
          if (!profession) errors.profession = tValidation("profession");
          break;
        }
        case 2: {
          if (!data.member_type) errors.member_type = tValidation("memberType");
          break;
        }
        case 3: {
          if (!data.agrees_guidelines)
            errors.agrees_guidelines = tValidation("guidelines");
          break;
        }
        case 4: {
          const why = (data.why_join as string)?.trim();
          if (!why || why.length < 10) errors.why_join = tValidation("whyJoin");
          break;
        }
      }

      return errors;
    },
    [tValidation],
  );
}

export function OnboardingWizard({
  initialData,
  existing,
}: OnboardingWizardProps) {
  const router = useRouter();
  const t = useTranslations("onboardingPage.wizard");
  const tSteps = useTranslations("onboardingPage.steps");
  const activeLocale = useLocale();
  const validateStep = useValidator();

  const isEdit = !!existing?.onboarding_completed;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>(() => {
    if (isEdit && existing) {
      // Edit mode: seed every step from the saved profile so each field
      // shows the current value and the wizard becomes a multi-step editor.
      return { ...existing, email: initialData.email };
    }
    return {
      display_name: initialData.display_name,
      email: initialData.email,
    };
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [shakeButton, setShakeButton] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const StepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  // Move keyboard focus to the step heading on step change so screen readers
  // announce the new step and tab order resets to its top.
  useEffect(() => {
    stepHeadingRef.current?.focus({ preventScroll: false });
  }, [currentStep]);

  // Funnel: mark the start of a fresh onboarding (not the edit-profile flow).
  useEffect(() => {
    if (!isEdit) track("onboarding_start", { edit: false });
  }, [isEdit]);

  // Hide the floating assistant launcher while onboarding - its sticky
  // mobile footer would overlap the bubble.
  useEffect(() => {
    window.dispatchEvent(new Event("assistant-suppress"));
    return () => {
      window.dispatchEvent(new Event("assistant-unsuppress"));
    };
  }, []);

  // Auto-save partial profile on each step transition so a member can
  // bounce mid-flow and resume where they left off.
  const saveProgress = useCallback(async (data: OnboardingData) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { email, agrees_guidelines, ...updateData } = data;
      void email;
      void agrees_guidelines;
      const sb = supabase as unknown as {
        from: (table: string) => any;
      };
      await sb
        .from("members")
        .update(nullifyEmpty(updateData))
        .eq("id", user.id);
    } catch {
      // Silent - this is best-effort and shouldn't block step navigation.
    }
  }, []);

  const updateField = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  function handleNext() {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setShakeButton(true);
      setTimeout(() => setShakeButton(false), 400);

      const firstErrorKey = Object.keys(stepErrors)[0];
      const el = document.querySelector(
        `[data-field="${firstErrorKey}"], #${firstErrorKey}`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});

    if (isLastStep) {
      handleSubmit();
    } else {
      // Best-effort save so the member can resume if they bounce mid-flow.
      void saveProgress(formData);
      track("onboarding_step", {
        step_index: currentStep,
        step_key: STEPS[currentStep].key,
      });
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setErrors({});
    setCurrentStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSkip() {
    router.push("/");
    showToast.info(t("skipToast"));
  }

  async function handleSubmit() {
    setSubmitting(true);
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

      const { email, agrees_guidelines, ...updateData } = formData;

      // Map single agreement checkbox to all legacy DB boolean fields
      const legacyAgreements = {
        agrees_community_values: true,
        agrees_no_unsolicited_dms: true,
        agrees_kindness: true,
        agrees_mixed_environments: true,
        understands_rsvp_policy: true,
        agrees_payment_policy: true,
        confirms_rules: true,
        confirms_positive_behavior: true,
        confirms_admin_removal: true,
        confirms_not_dating_app: true,
        agrees_no_misuse: [
          "no-selling",
          "no-mass-dm",
          "no-politics",
          "no-harassment",
        ],
      };

      const { error } = await (supabase.from("members") as any)
        .update({
          ...nullifyEmpty(updateData),
          ...legacyAgreements,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          // Capture the locale they onboarded in so Telegram notifications
          // are sent in their language.
          preferred_locale: activeLocale,
        })
        .eq("id", user.id);

      if (error) {
        showToast.error(t("saveError"), error.message);
        return;
      }

      track("onboarding_complete", { edit: isEdit });
      // First-time completion = a new member joining the community.
      if (!isEdit) track("sign_up", { method: "google" });

      showToast.success(isEdit ? t("profileUpdated") : t("welcome"));
      // Land newly-onboarded members on their dashboard; editors back
      // on /dashboard too (their starting point).
      router.push("/dashboard");
      router.refresh();
    } catch {
      showToast.error(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section className="bg-ink-0 pb-32 pt-6 md:pb-16 md:pt-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* Progress strip */}
          <div className="mb-8" aria-label="Onboarding progress">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
                {t("stepIndicator", {
                  current: currentStep + 1,
                  total: STEPS.length,
                })}
              </span>
              <button
                type="button"
                onClick={handleSkip}
                className="min-h-[44px] px-2 py-2 text-sm text-paper-mute transition-colors hover:text-paper focus-visible:outline-none focus-visible:underline"
              >
                {t("skip")}
              </button>
            </div>
            <div
              className="mt-3 flex gap-1.5"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
              aria-valuenow={currentStep + 1}
            >
              {STEPS.map((step, i) => (
                <div
                  key={step.key}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none",
                    i <= currentStep ? "bg-terracotta" : "bg-ink-3",
                  )}
                />
              ))}
            </div>
            <h1
              ref={stepHeadingRef}
              tabIndex={-1}
              className="mt-4 font-display text-h2 leading-tight text-paper focus-visible:outline-none"
            >
              {tSteps(`${STEPS[currentStep].key}.label`)}
            </h1>
          </div>

          {/* Error live region (announced to screen readers) */}
          <div role="alert" aria-live="polite" className="sr-only">
            {hasErrors ? t("hasErrors") : ""}
          </div>

          {/* Step content */}
          <div className="border border-ink-3 bg-ink-1 p-6 sm:p-8">
            <StepComponent
              data={formData}
              updateField={updateField}
              errors={errors}
            />
          </div>

          {/* Desktop nav (inline) */}
          <div className="mt-6 hidden items-center justify-between md:flex">
            <div>
              {!isFirstStep && (
                <Button variant="ghost" onClick={handleBack}>
                  {t("back")}
                </Button>
              )}
            </div>
            <Button
              onClick={handleNext}
              loading={submitting}
              className={cn("px-8", shakeButton && "animate-shake")}
              size="lg"
            >
              {isLastStep
                ? isEdit
                  ? t("saveChanges")
                  : t("submit")
                : t("continue")}
            </Button>
          </div>
        </div>
      </Container>

      {/* Mobile sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-3 bg-ink-1 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          {!isFirstStep && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="min-h-[48px]"
            >
              {t("back")}
            </Button>
          )}
          <Button
            onClick={handleNext}
            loading={submitting}
            className={cn(
              "ms-auto min-h-[48px] flex-1",
              shakeButton && "animate-shake",
            )}
            size="lg"
          >
            {isLastStep ? t("submit") : t("continue")}
          </Button>
        </div>
      </div>
    </section>
  );
}
