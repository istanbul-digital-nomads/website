"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ExternalLink,
  Link2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  arrivalProfileOptions,
  budgetComfortOptions,
  buildFirstWeekPlan,
  defaultPlannerInput,
  encodePlannerInput,
  socialAppetiteOptions,
  workStyleOptions,
  type BudgetComfort,
  type PlannerInput,
  type PlannerOption,
  type WorkStyle,
  type ArrivalProfile,
  type SocialAppetite,
} from "@/lib/first-week-planner";
import { neighborhoods } from "@/lib/neighborhoods";
import { cn } from "@/lib/utils";

interface Props {
  initialInput: PlannerInput;
}

export function FirstWeekPlanner({ initialInput }: Props) {
  const t = useTranslations("firstWeekPlanner");
  const tWork = useTranslations("firstWeekPlanner.options.workStyle");
  const tBudget = useTranslations("firstWeekPlanner.options.budgetComfort");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState(initialInput);
  const [copied, setCopied] = useState(false);
  const plan = useMemo(() => buildFirstWeekPlan(input), [input]);
  const sharePath = `/tools/first-week-planner?${encodePlannerInput(input)}`;

  function update(next: Partial<PlannerInput>) {
    const nextInput = { ...input, ...next };
    setInput(nextInput);
    startTransition(() => {
      router.replace(
        `/tools/first-week-planner?${encodePlannerInput(nextInput)}`,
        {
          scroll: false,
        },
      );
    });
  }

  async function copyLink() {
    const url = `${window.location.origin}${sharePath}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const workLabel = (value: WorkStyle) =>
    workStyleOptions.some((option) => option.value === value)
      ? tWork(`${value}.label`)
      : t("aside.fallbackWork");

  const budgetLabel = (value: BudgetComfort) =>
    budgetComfortOptions.some((option) => option.value === value)
      ? tBudget(`${value}.label`)
      : t("aside.fallbackBudget");

  return (
    <div className="overflow-hidden">
      <section className="border-b border-black/10 bg-[#fbfaf8] dark:border-white/10 dark:bg-[#14110f]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="eyebrow">{t("hero.eyebrow")}</p>
              <h1 className="mt-4 max-w-2xl font-display text-5xl font-extrabold leading-[0.98] text-neutral-950 sm:text-[4.5rem] dark:text-[#f2f3f4]">
                {t("hero.title")}
              </h1>
              <p className="mt-5 max-w-xl text-body-lg leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {t("hero.body")}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#planner-inputs"
                  className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-[#f2f3f4] dark:text-[#14110f] dark:hover:bg-[#d8d0c8]"
                >
                  {t("hero.buildWeek")}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/guides/neighborhoods"
                  className="inline-flex items-center gap-2 rounded-md border border-black/15 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:border-primary-500/40 hover:bg-white/60 dark:border-white/20 dark:text-[#f2f3f4] dark:hover:bg-white/10"
                >
                  {t("hero.compareNeighborhoods")}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 border-y border-black/10 py-4 text-sm leading-6 text-[#5d6d7e] sm:grid-cols-3 dark:border-white/10 dark:text-[#b7aaa0]">
              <MiniSignal
                label={t("hero.miniSignals.base")}
                value={plan.baseNeighborhood.name}
              />
              <MiniSignal
                label={t("hero.miniSignals.work")}
                value={workLabel(input.workStyle)}
              />
              <MiniSignal
                label={t("hero.miniSignals.budget")}
                value={budgetLabel(input.budgetComfort)}
              />
            </div>
          </div>

          <div className="relative min-h-[380px] overflow-hidden rounded-md border border-black/10 bg-[#14110f] dark:border-white/10">
            <Image
              src={plan.baseNeighborhood.hero.src}
              alt={plan.baseNeighborhood.hero.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 680px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,17,15,0.86)_0%,rgba(20,17,15,0.42)_52%,rgba(20,17,15,0.12)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <div className="max-w-xl rounded-md border border-white/15 bg-[#14110f]/62 p-5 text-white backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 text-primary-200" />
                  <div>
                    <p className="font-display text-2xl font-extrabold">
                      {plan.starterTip}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      {plan.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <aside
            id="planner-inputs"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="rounded-md border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-300">
                    {t("aside.eyebrow")}
                  </p>
                  <p className="mt-1 text-sm text-[#5d6d7e] dark:text-[#b7aaa0]">
                    {t("aside.subtitle")}
                  </p>
                </div>
                <CalendarDays className="h-5 w-5 text-primary-600 dark:text-primary-300" />
              </div>

              <div className="mt-5 space-y-6">
                <OptionGroup<ArrivalProfile>
                  groupKey="arrivalProfile"
                  label={t("aside.labels.arrivalProfile")}
                  value={input.arrivalProfile}
                  options={arrivalProfileOptions}
                  onChange={(arrivalProfile) => update({ arrivalProfile })}
                />

                <NeighborhoodPicker
                  value={input.neighborhood}
                  onChange={(neighborhood) => update({ neighborhood })}
                />

                <OptionGroup<WorkStyle>
                  groupKey="workStyle"
                  label={t("aside.labels.workStyle")}
                  value={input.workStyle}
                  options={workStyleOptions}
                  onChange={(workStyle) => update({ workStyle })}
                />

                <OptionGroup<SocialAppetite>
                  groupKey="socialAppetite"
                  label={t("aside.labels.socialAppetite")}
                  value={input.socialAppetite}
                  options={socialAppetiteOptions}
                  onChange={(socialAppetite) => update({ socialAppetite })}
                />

                <OptionGroup<BudgetComfort>
                  groupKey="budgetComfort"
                  label={t("aside.labels.budgetComfort")}
                  value={input.budgetComfort}
                  options={budgetComfortOptions}
                  onChange={(budgetComfort) => update({ budgetComfort })}
                />
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => update(defaultPlannerInput)}
                  disabled={isPending}
                >
                  {t("aside.reset")}
                </Button>
                <Button type="button" onClick={copyLink}>
                  <Link2 className="h-4 w-4" />
                  {copied ? t("aside.copied") : t("aside.copyLink")}
                </Button>
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="rounded-md border border-black/10 bg-[#f6f1ea] p-5 dark:border-white/10 dark:bg-[#1a1612]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-300">
                    {t("plan.eyebrow")}
                  </p>
                  <h2 className="mt-3 max-w-2xl font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                    {t("plan.title", {
                      neighborhood: plan.baseNeighborhood.name,
                    })}
                  </h2>
                </div>
                <Link
                  href={`/guides/neighborhoods/${plan.baseNeighborhood.slug}`}
                  className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:border-primary-500/40 dark:border-white/10 dark:bg-white/10 dark:text-[#f2f3f4]"
                >
                  {t("plan.baseGuide")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <ol className="space-y-4">
              {plan.days.map((day) => (
                <li
                  key={day.day}
                  className="grid gap-4 rounded-md border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04] md:grid-cols-[5.5rem_1fr]"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
                      {t("plan.dayLabel", { day: day.day })}
                    </p>
                    <p className="mt-2 font-display text-3xl font-extrabold text-primary-700 dark:text-primary-300">
                      {day.day}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary-700 dark:text-primary-300">
                          {day.theme}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
                          {day.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {day.links.map((link) => (
                          <PlannerLink key={link.href} link={link} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-3">
                      <PlanMoment
                        label={t("plan.moments.morning")}
                        text={day.morning}
                      />
                      <PlanMoment
                        label={t("plan.moments.workBlock")}
                        text={day.workBlock}
                      />
                      <PlanMoment
                        label={t("plan.moments.evening")}
                        text={day.evening}
                      />
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-md bg-primary-50/70 p-3 text-sm leading-6 text-primary-950 dark:bg-primary-950/20 dark:text-primary-100">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary-700 dark:text-primary-300" />
                      <p>{day.why}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-md border border-black/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-300">
                  {t("plan.saveLinks")}
                </p>
                <div className="mt-4 grid gap-2">
                  {plan.saveLinks.map((link) => (
                    <PlannerLink key={link.href} link={link} full />
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-black/10 bg-[#1a1612] p-5 text-white dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-200">
                  {t("plan.avoid")}
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/76">
                  {plan.avoid.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
        {label}
      </p>
      <p className="mt-1 font-semibold text-neutral-950 dark:text-[#f2f3f4]">
        {value}
      </p>
    </div>
  );
}

function OptionGroup<T extends string>({
  groupKey,
  label,
  value,
  options,
  onChange,
}: {
  groupKey: "arrivalProfile" | "workStyle" | "socialAppetite" | "budgetComfort";
  label: string;
  value: T;
  options: PlannerOption<T>[];
  onChange: (value: T) => void;
}) {
  const tGroup = useTranslations(`firstWeekPlanner.options.${groupKey}`);
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
        {label}
      </p>
      <div className="mt-2 grid gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "flex min-h-14 items-start gap-3 rounded-md border px-3 py-2 text-left transition-colors",
              value === option.value
                ? "border-primary-600 bg-primary-50 text-neutral-950 dark:border-primary-400 dark:bg-primary-950/30 dark:text-[#f2f3f4]"
                : "border-black/10 bg-white/50 text-[#5d6d7e] hover:border-primary-500/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#b7aaa0]",
            )}
          >
            <span
              className={cn(
                "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                value === option.value
                  ? "border-primary-600 bg-primary-600 text-white dark:border-primary-400 dark:bg-primary-400 dark:text-[#14110f]"
                  : "border-black/20 text-transparent dark:border-white/20",
              )}
            >
              <Check className="h-3 w-3" />
            </span>
            <span>
              <span className="block text-sm font-semibold">
                {tGroup(`${option.value}.label`)}
              </span>
              <span className="mt-0.5 block text-xs leading-5 opacity-80">
                {tGroup(`${option.value}.description`)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NeighborhoodPicker({
  value,
  onChange,
}: {
  value: PlannerInput["neighborhood"];
  onChange: (value: PlannerInput["neighborhood"]) => void;
}) {
  const t = useTranslations("firstWeekPlanner.aside");
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
        {t("labels.baseNeighborhood")}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NeighborhoodButton
          active={value === "help"}
          label={t("helpChoose.label")}
          side={t("helpChoose.recommended")}
          onClick={() => onChange("help")}
        />
        {neighborhoods.map((neighborhood) => (
          <NeighborhoodButton
            key={neighborhood.slug}
            active={value === neighborhood.slug}
            label={neighborhood.name}
            side={t("helpChoose.sideSuffix", { side: neighborhood.side })}
            onClick={() => onChange(neighborhood.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function NeighborhoodButton({
  active,
  label,
  side,
  onClick,
}: {
  active: boolean;
  label: string;
  side: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md border px-3 py-2 text-left transition-colors",
        active
          ? "border-primary-600 bg-primary-50 dark:border-primary-400 dark:bg-primary-950/30"
          : "border-black/10 bg-white/50 hover:border-primary-500/40 hover:bg-white dark:border-white/10 dark:bg-white/5",
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-[#f2f3f4]">
        <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" />
        {label}
      </span>
      <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500 dark:text-[#94877d]">
        {side}
      </span>
    </button>
  );
}

function PlanMoment({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-md border border-black/10 bg-white/70 p-3 dark:border-white/10 dark:bg-[#14110f]/70">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-500 dark:text-[#94877d]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
        {text}
      </p>
    </div>
  );
}

function PlannerLink({
  link,
  full = false,
}: {
  link: { label: string; href: string };
  full?: boolean;
}) {
  const external = link.href.startsWith("http");
  const className = cn(
    "inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-800 transition-colors hover:border-primary-500/40 hover:text-primary-700 dark:border-white/10 dark:bg-white/10 dark:text-[#f2f3f4] dark:hover:border-primary-400/40 dark:hover:text-primary-200",
    full && "justify-between px-3 py-2 text-sm",
  );

  if (external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.label}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
      {full ? <ArrowRight className="h-4 w-4" /> : null}
    </Link>
  );
}
