import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { type EventType } from "@/lib/constants";

type BadgeVariant = EventType | "default";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-neutral-100 text-neutral-700 dark:bg-[rgba(44,62,80,0.1)] dark:text-[#99a3ad]",
  meetup:
    "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
  coworking:
    "bg-[rgba(39,174,96,0.12)] text-[rgb(33,106,92)] dark:bg-[rgba(39,174,96,0.22)] dark:text-[rgb(144,222,204)]",
  workshop:
    "bg-[rgba(243,156,18,0.16)] text-[rgb(138,89,40)] dark:bg-[rgba(243,156,18,0.22)] dark:text-[rgb(243,203,162)]",
  social:
    "bg-[rgba(231,76,60,0.18)] text-[rgb(154,64,44)] dark:bg-[rgba(231,76,60,0.2)] dark:text-[rgb(255,204,194)]",
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
