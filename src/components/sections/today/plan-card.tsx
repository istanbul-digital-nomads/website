"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarStack, hueFor } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { TodayPlanCard } from "./types";

type Props = { plan: TodayPlanCard };

const TONE: Record<string, string> = {
  focus: "#7dd3fc",
  cowork: "#7dd3fc",
  social: "#e87a5d",
  meal: "#fde68a",
  "after-work": "#a78bfa",
  outdoor: "#86efac",
};

/**
 * The Today board card. One per plan, three-column layout:
 *   [time gutter] [body — kind/title/host/agenda] [right rail — seats/budget/CTA]
 * Adapts cleanly from desktop down to a stacked layout on small screens.
 */
export function PlanCard({ plan }: Props) {
  const [expanded, setExpanded] = useState(plan.stops > 1);

  const tone = plan.vibeLabel ? (TONE[plan.vibeLabel] ?? "#f4b860") : "#f4b860";
  const isMine = plan.mine;
  const isGuide = plan.host?.type === "guide";
  const seatsOpen =
    plan.seats != null ? Math.max(0, plan.seats - plan.filled) : null;

  return (
    <div
      className={cn(
        "relative grid gap-6 rounded-2xl border p-5 transition-colors md:grid-cols-[92px_1fr_280px] md:p-6",
      )}
      style={{
        borderColor: isMine
          ? "rgba(244, 184, 96, 1)"
          : "rgba(246, 236, 217, 0.10)",
        background: isMine
          ? "linear-gradient(135deg, rgba(244,184,96,0.05), rgba(232,122,93,0.05))"
          : "#0a1a2f",
      }}
    >
      {/* Time gutter */}
      <div
        className="md:border-r md:pr-4"
        style={{ borderColor: "rgba(246, 236, 217, 0.10)" }}
      >
        <div
          className="font-editorial text-cream"
          style={{ fontSize: 32, lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          {plan.startTime}
        </div>
        <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32">
          → {plan.endTime}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <div
            className="text-[9.5px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: tone }}
          >
            {plan.durationLabel}
          </div>
          <div className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-cream/32">
            {plan.stops} {plan.stops === 1 ? "stop" : "stops"}
          </div>
        </div>
      </div>

      {/* Body */}
      <div>
        {/* Kind / host-type row */}
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          {plan.vibeLabel && (
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{
                background: `${tone}1A`,
                borderColor: `${tone}59`,
                color: tone,
              }}
            >
              {plan.vibeLabel}
            </span>
          )}
          {isMine ? (
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
              ↳ You&apos;re hosting
            </span>
          ) : isGuide ? (
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
              ★ Local guide
            </span>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32">
              Nomad plan
            </span>
          )}
          {plan.hood && (
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32">
              {plan.hood}
            </span>
          )}
        </div>

        <h3
          className="font-editorial text-cream"
          style={{
            fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            margin: 0,
            fontWeight: 400,
          }}
        >
          {plan.title}
        </h3>

        {/* Host row */}
        {plan.host && (
          <div className="mt-4 flex items-center gap-2.5">
            <Avatar
              name={plan.host.name}
              src={plan.host.avatarUrl}
              size={24}
              hue={hueFor(plan.host.name)}
            />
            <span className="text-[13px] text-cream">{plan.host.name}</span>
          </div>
        )}

        {/* Agenda - expanded view */}
        {expanded && plan.agenda.length > 0 && (
          <div
            className="mt-5 border-t pt-4"
            style={{ borderColor: "rgba(246, 236, 217, 0.06)" }}
          >
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/32">
              Agenda
            </div>
            <div>
              {plan.agenda.map((s, i) => (
                <div
                  key={i}
                  className="grid items-start gap-3.5 py-2.5"
                  style={{
                    gridTemplateColumns: "54px 1fr auto",
                    borderTop:
                      i === 0
                        ? "none"
                        : "0.5px solid rgba(246, 236, 217, 0.06)",
                  }}
                >
                  <div className="font-grotesk text-[12px] font-semibold tabular-nums text-gold">
                    {s.time}
                  </div>
                  <div>
                    <div className="font-grotesk text-[13.5px] leading-snug text-cream">
                      {s.title}
                    </div>
                    {s.place && (
                      <div className="mt-1 text-[11px] tracking-[0.04em] text-cream/32">
                        {s.place}
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "font-grotesk text-[11px] font-medium tabular-nums",
                      s.cost === null ? "text-moss" : "text-cream/50",
                    )}
                  >
                    {s.cost ?? "free"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!expanded && plan.stops > 1 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-3.5 inline-flex items-center gap-1.5 font-grotesk text-[11px] font-semibold uppercase tracking-[0.18em] text-gold"
          >
            Expand · {plan.stops} stops <span>↓</span>
          </button>
        )}
      </div>

      {/* Right rail */}
      <aside
        className="flex flex-col gap-4 md:border-l md:pl-6"
        style={{ borderColor: "rgba(246, 236, 217, 0.10)" }}
      >
        {/* Seats */}
        <div>
          <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/32">
            Seats
          </div>
          {plan.seats == null ? (
            <div
              className="font-editorial text-cream"
              style={{ fontSize: 22, letterSpacing: "-0.01em" }}
            >
              Open table
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span
                  className="font-editorial text-cream"
                  style={{
                    fontSize: 32,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {plan.filled}
                </span>
                <span className="font-grotesk text-[14px] text-cream/50">
                  / {plan.seats}
                </span>
                {seatsOpen != null && seatsOpen > 0 && (
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.18em] text-moss">
                    {seatsOpen} open
                  </span>
                )}
              </div>
              <div
                className="mt-3 h-[3px] overflow-hidden rounded"
                style={{ background: "rgba(246, 236, 217, 0.06)" }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${(plan.filled / plan.seats) * 100}%`,
                    background: `linear-gradient(90deg, ${tone}, #f4b860)`,
                  }}
                />
              </div>
              {plan.attendees.length > 0 && (
                <div className="mt-3">
                  <AvatarStack
                    people={plan.attendees.map((a) => ({
                      name: a.name,
                      src: a.avatarUrl,
                    }))}
                    total={plan.filled}
                    size={26}
                    max={5}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Budget */}
        {plan.budgetLabel && (
          <div
            className="border-t pt-3.5"
            style={{ borderColor: "rgba(246, 236, 217, 0.06)" }}
          >
            <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/32">
              Budget
            </div>
            <div
              className={cn(
                "font-editorial",
                plan.budgetLabel === "Free" ? "text-moss" : "text-cream",
              )}
              style={{
                fontSize: 28,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {plan.budgetLabel}
            </div>
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32">
              ↳ transport
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto flex flex-col gap-2">
          {isMine ? (
            <Link
              href={`/plans/${plan.id}`}
              className="inline-flex items-center justify-between gap-2 rounded-full bg-gold px-4 py-3 font-grotesk text-[13px] font-semibold text-[#06101f] transition-colors hover:bg-gold/90"
            >
              Edit plan <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href={`/plans/${plan.id}`}
                className={cn(
                  "inline-flex items-center justify-between gap-2 rounded-full px-4 py-3 font-grotesk text-[13px] font-semibold transition-colors",
                  isGuide
                    ? "bg-gold text-[#06101f] hover:bg-gold/90"
                    : "border border-gold text-cream hover:bg-gold/10",
                )}
              >
                {isGuide ? "Reserve a seat" : "Join plan"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {plan.host && (
                <Link
                  href={`/plans/${plan.id}`}
                  className="inline-flex items-center justify-center rounded-full border px-4 py-2.5 font-grotesk text-[12px] text-cream/70 transition-colors hover:text-cream"
                  style={{ borderColor: "rgba(246, 236, 217, 0.10)" }}
                >
                  See plan
                </Link>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
