import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white shadow-[0_10px_25px_rgba(192,57,43,0.18)] hover:bg-primary-700 focus-visible:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400 dark:shadow-[0_10px_25px_rgba(192,57,43,0.2)]",
  secondary:
    "border border-primary-200/60 bg-primary-50/80 text-primary-800 hover:bg-primary-100 dark:border-[rgba(44,62,80,0.3)] dark:bg-[rgba(44,62,80,0.12)] dark:text-primary-100 dark:hover:bg-[rgba(44,62,80,0.2)]",
  ghost:
    "text-[#5d6d7e] hover:bg-primary-50 hover:text-primary-700 dark:text-[#99a3ad] dark:hover:bg-[rgba(44,62,80,0.12)] dark:hover:text-primary-200",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:ring-red-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps };
