import { cn } from "@/lib/utils";
import { computeNomadScore, type NomadScores } from "@/lib/spaces";

function getScoreColor(score: number) {
  if (score >= 4) return "text-[#2f8f7b] dark:text-[#3db89e]";
  if (score >= 3) return "text-[#d49a45] dark:text-[#e5b366]";
  return "text-[#ff7b61] dark:text-[#ff9580]";
}

function getScoreRingColor(score: number) {
  if (score >= 4) return "ring-[#2f8f7b]/30 dark:ring-[#3db89e]/30";
  if (score >= 3) return "ring-[#d49a45]/30 dark:ring-[#e5b366]/30";
  return "ring-[#ff7b61]/30 dark:ring-[#ff9580]/30";
}

function getScoreBg(score: number) {
  if (score >= 4) return "bg-[#2f8f7b]/10 dark:bg-[#3db89e]/10";
  if (score >= 3) return "bg-[#d49a45]/10 dark:bg-[#e5b366]/10";
  return "bg-[#ff7b61]/10 dark:bg-[#ff9580]/10";
}

export function NomadScoreBadge({
  scores,
  size = "md",
  className,
}: {
  scores: NomadScores;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const score = computeNomadScore(scores);

  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-2xl",
  };

  return (
    <div className={cn("flex flex-col items-center gap-0.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold ring-2",
          sizes[size],
          getScoreColor(score),
          getScoreRingColor(score),
          getScoreBg(score),
        )}
      >
        {score.toFixed(1)}
      </div>
      {size !== "sm" && (
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-[#8a7a6a]">
          Nomad Score
        </span>
      )}
    </div>
  );
}
