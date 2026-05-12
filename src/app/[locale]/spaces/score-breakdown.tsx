import { SCORE_LABELS, type NomadScores } from "@/lib/spaces";

export function ScoreBreakdown({ scores }: { scores: NomadScores }) {
  return (
    <div className="space-y-2">
      {(Object.keys(SCORE_LABELS) as (keyof NomadScores)[]).map((key) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-xs text-neutral-500 dark:text-[#85929e]">
            {SCORE_LABELS[key]}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            {scores[key] != null && (
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500"
                style={{ width: `${(scores[key]! / 5) * 100}%` }}
              />
            )}
          </div>
          <span className="w-4 text-right text-xs font-medium text-neutral-700 dark:text-[#99a3ad]">
            {scores[key] ?? "-"}
          </span>
        </div>
      ))}
    </div>
  );
}
