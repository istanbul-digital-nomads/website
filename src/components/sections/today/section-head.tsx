import { Eyebrow } from "@/components/ui/eyebrow";

type Props = {
  label: string; // "Morning · N° 01"
  kickerLead: string; // "Before the second coffee." - first sentence in italic gold
  kickerRest?: string; // optional trailing sentence in cream
  range: string; // "06:00 → 12:00 · 5 plans"
};

/**
 * Section divider for the morning / afternoon / evening groups on the
 * Today board. Gold-italic lead sentence, then a hairline, then the time
 * range right-aligned.
 */
export function SectionHead({ label, kickerLead, kickerRest, range }: Props) {
  return (
    <div
      className="mb-4 grid items-baseline gap-6 border-b pb-4 pt-8 md:grid-cols-[auto_1fr_auto]"
      style={{ borderColor: "rgba(246, 236, 217, 0.10)" }}
    >
      <div>
        <Eyebrow label={label} />
        <h2
          className="mt-2.5 font-editorial text-cream"
          style={{
            fontSize: "clamp(1.625rem, 3vw, 2.375rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            margin: 0,
            fontWeight: 400,
          }}
        >
          <em className="italic text-gold">{kickerLead}</em>
          {kickerRest && <span> {kickerRest}</span>}
        </h2>
      </div>
      <span aria-hidden />
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/32 md:text-end">
        {range}
      </div>
    </div>
  );
}
