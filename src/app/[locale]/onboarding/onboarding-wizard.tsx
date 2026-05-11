"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";
import { StepAbout } from "./steps/step-about";
import { StepContact } from "./steps/step-contact";
import { StepInterests } from "./steps/step-interests";
import { StepGuidelines } from "./steps/step-guidelines";
import { StepFinal } from "./steps/step-final";

export type OnboardingData = Record<string, unknown>;
export type FieldErrors = Record<string, string>;

interface OnboardingWizardProps {
  initialData: {
    display_name: string;
    email: string;
    avatar_url: string;
  };
}

const STEPS = [
  { label: "About You", component: StepAbout },
  { label: "Contact & Work", component: StepContact },
  { label: "Your Interests", component: StepInterests },
  { label: "Community Guidelines", component: StepGuidelines },
  { label: "Almost Done", component: StepFinal },
];

function validateStep(step: number, data: OnboardingData): FieldErrors {
  const errors: FieldErrors = {};

  switch (step) {
    case 0: {
      const name = (data.display_name as string)?.trim();
      if (!name) errors.display_name = "Your name is required.";
      if (!data.age_range && !data.birthday) {
        errors.age_or_birthday =
          "Pick an age range or share your birthday - either works.";
      }
      break;
    }
    case 1: {
      const profession = (data.profession as string)?.trim();
      if (!profession)
        errors.profession =
          "Let us know what you do - even something short like 'freelancer' works.";
      break;
    }
    case 2: {
      if (!data.member_type)
        errors.member_type = "Pick the option that fits you best.";
      break;
    }
    case 3: {
      if (!data.agrees_guidelines)
        errors.agrees_guidelines =
          "Please read and agree to the guidelines to continue.";
      break;
    }
    case 4: {
      const why = (data.why_join as string)?.trim();
      if (!why || why.length < 10)
        errors.why_join =
          "Tell us a bit about why you want to join (at least a sentence).";
      break;
    }
  }

  return errors;
}

export function OnboardingWizard({ initialData }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    display_name: initialData.display_name,
    email: initialData.email,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [shakeButton, setShakeButton] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const StepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

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
    showToast.info(
      "You can complete your profile later from your account menu.",
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        showToast.error("Please sign in again");
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
          ...updateData,
          ...legacyAgreements,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        showToast.error("Couldn't save your profile", error.message);
        return;
      }

      showToast.success("Welcome to Istanbul Digital Nomads!");
      router.push("/");
      router.refresh();
    } catch {
      showToast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-8 md:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#1a1a2e] dark:text-[#f2f3f4]">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-sm text-[#5d6d7e] transition-colors hover:text-primary-600 dark:text-[#99a3ad]"
              >
                Skip for now
              </button>
            </div>
            <div className="mt-3 flex gap-1.5">
              {STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= currentStep
                      ? "bg-primary-500"
                      : "bg-primary-100 dark:bg-primary-900/30"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
              {STEPS[currentStep].label}
            </p>
          </div>

          {/* Step content */}
          <div className="rounded-2xl border border-primary-200/30 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-[rgba(192,57,43,0.12)] dark:bg-[#1a1d27]/70">
            <StepComponent
              data={formData}
              updateField={updateField}
              errors={errors}
            />
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="rounded-xl"
                >
                  Back
                </Button>
              )}
            </div>
            <Button
              onClick={handleNext}
              loading={submitting}
              className={`rounded-xl px-8 ${shakeButton ? "animate-shake" : ""}`}
              size="lg"
            >
              {isLastStep ? "Submit Application" : "Continue"}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
