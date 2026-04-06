"use client";

import type { OnboardingData } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
}

function YesNoToggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="rounded-xl border border-primary-200/20 bg-white/50 p-4 dark:border-[rgba(200,100,60,0.08)] dark:bg-[#231a14]/50">
      <p className="text-sm font-medium text-[#2a2018] dark:text-[#f7f2ea]">
        {label}
      </p>
      {description && (
        <p className="mt-1 text-xs text-[#6b6257] dark:text-[#b8a898]">
          {description}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt === "Yes")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              (opt === "Yes" && value === true) ||
              (opt === "No" && value === false)
                ? "bg-primary-600 text-white"
                : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 dark:bg-[#1c1614] dark:text-[#b8a898] dark:ring-white/5"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

const CONFIRMATIONS = [
  "I'll respect community rules",
  "I'll behave positively at events",
  "I understand admins can remove members who break guidelines",
  "I understand this is a real-life social community, not a dating app",
];

const NO_MISUSE = [
  "Selling products/services",
  "Mass private messaging",
  "Political or religious debates",
  "Harassment or pressure on members",
];

export function StepGuidelines({ data, updateField }: StepProps) {
  const confirmKeys = [
    "confirms_rules",
    "confirms_positive_behavior",
    "confirms_admin_removal",
    "confirms_not_dating_app",
  ];
  const noMisuseKeys = [
    "no-selling",
    "no-mass-dm",
    "no-politics",
    "no-harassment",
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#2a2018] dark:text-[#f7f2ea]">
          Community guidelines
        </h2>
        <p className="mt-1 text-sm text-[#6b6257] dark:text-[#b8a898]">
          Our community is built on respect, positivity, and genuine
          connections. Please review and agree to these guidelines.
        </p>
      </div>

      <YesNoToggle
        label="Do you agree to follow our community values and guidelines?"
        value={data.agrees_community_values as boolean | null}
        onChange={(v) => updateField("agrees_community_values", v)}
      />

      <YesNoToggle
        label="We've got a strict policy against unsolicited private messages (DMs) to members without consent. Do you agree?"
        value={data.agrees_no_unsolicited_dms as boolean | null}
        onChange={(v) => updateField("agrees_no_unsolicited_dms", v)}
      />

      <YesNoToggle
        label="Do you agree to treat hosts and other members with kindness and respect at all times?"
        value={data.agrees_kindness as boolean | null}
        onChange={(v) => updateField("agrees_kindness", v)}
      />

      <YesNoToggle
        label="Are you comfortable participating in mixed international social environments?"
        value={data.agrees_mixed_environments as boolean | null}
        onChange={(v) => updateField("agrees_mixed_environments", v)}
      />

      <YesNoToggle
        label="Do you understand that RSVP'ing to events and not showing up without notice may lead to removal?"
        value={data.understands_rsvp_policy as boolean | null}
        onChange={(v) => updateField("understands_rsvp_policy", v)}
      />

      <YesNoToggle
        label="Do you agree to the 'Save Your Receipts' payment policy (each member pays their own bills and settles shared costs promptly)?"
        value={data.agrees_payment_policy as boolean | null}
        onChange={(v) => updateField("agrees_payment_policy", v)}
      />

      {/* Confirmation checkboxes */}
      <div>
        <p className="text-sm font-medium text-[#2a2018] dark:text-[#f7f2ea]">
          I confirm that:
        </p>
        <div className="mt-3 space-y-2">
          {CONFIRMATIONS.map((item, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-950/10"
            >
              <input
                type="checkbox"
                checked={(data[confirmKeys[i]] as boolean) || false}
                onChange={(e) => updateField(confirmKeys[i], e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-[#5a4f43] dark:text-[#d4c4b4]">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* No misuse checkboxes */}
      <div>
        <p className="text-sm font-medium text-[#2a2018] dark:text-[#f7f2ea]">
          I agree not to use the community groups for:
        </p>
        <div className="mt-3 space-y-2">
          {NO_MISUSE.map((item, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-950/10"
            >
              <input
                type="checkbox"
                checked={((data.agrees_no_misuse as string[]) || []).includes(
                  noMisuseKeys[i],
                )}
                onChange={(e) => {
                  const current = (data.agrees_no_misuse as string[]) || [];
                  if (e.target.checked) {
                    updateField("agrees_no_misuse", [
                      ...current,
                      noMisuseKeys[i],
                    ]);
                  } else {
                    updateField(
                      "agrees_no_misuse",
                      current.filter((v) => v !== noMisuseKeys[i]),
                    );
                  }
                }}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-[#5a4f43] dark:text-[#d4c4b4]">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
