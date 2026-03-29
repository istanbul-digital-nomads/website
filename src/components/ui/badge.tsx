import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { type EventType } from "@/lib/constants";

type BadgeVariant = EventType | "default";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  meetup:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  coworking:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  workshop:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  social:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge, type BadgeProps };
