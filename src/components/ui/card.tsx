import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

function Card({ className, hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-black/10 bg-white p-6 text-start shadow-none dark:border-white/10 dark:bg-[#1a1612]",
        hoverable &&
          "transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary-300/70 hover:bg-white/95 hover:shadow-[0_18px_48px_rgba(20,17,15,0.08)] focus-within:border-primary-300/70 focus-within:shadow-[0_18px_48px_rgba(20,17,15,0.08)] dark:hover:border-primary-500/35 dark:hover:bg-[rgba(60,40,30,0.35)] dark:hover:shadow-none dark:focus-within:border-primary-500/35",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-neutral-500 dark:text-[#99a3ad]", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 flex items-center gap-2", className)} {...props} />
  );
}

function CardImage({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-md", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
};
