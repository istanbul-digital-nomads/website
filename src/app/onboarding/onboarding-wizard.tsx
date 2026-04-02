"use client";

import { useState } from "react";
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

export function OnboardingWizard({ initialData }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    display_name: initialData.display_name,
    email: initialData.email,
  });
  const [submitting, setSubmitting] = useState(false);

  const StepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  function updateField(field: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
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

      const { email, ...updateData } = formData;
      const { error } = await (supabase.from("members") as any)
        .update({
          ...updateData,
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
              <span className="text-sm font-medium text-[#2a2018] dark:text-[#f7f2ea]">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-sm text-[#6b6257] transition-colors hover:text-primary-600 dark:text-[#b8a898]"
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
            <p className="mt-2 text-xs text-[#6b6257] dark:text-[#b8a898]">
              {STEPS[currentStep].label}
            </p>
          </div>

          {/* Step content */}
          <div className="rounded-2xl border border-primary-200/30 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-[rgba(200,100,60,0.12)] dark:bg-[#1c1614]/70">
            <StepComponent data={formData} updateField={updateField} />
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
              className="rounded-xl px-8"
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
