import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      <Container className="relative">
        {/* Animated loading bar */}
        <div className="mb-6 h-1.5 w-24 overflow-hidden rounded-full bg-neutral-200 sm:mb-10 sm:w-32 dark:bg-neutral-700">
          <div className="loading-bar h-full w-full rounded-full bg-gradient-to-r from-primary-500 via-accent-warm to-accent-green" />
        </div>

        {/* Eyebrow */}
        <div className="h-3 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700" />

        {/* Title skeleton */}
        <div className="mt-5 space-y-2.5 sm:space-y-3">
          <div className="h-8 w-[75%] max-w-[280px] rounded-xl bg-neutral-200 sm:h-12 sm:max-w-lg dark:bg-neutral-700" />
          <div className="h-8 w-[50%] max-w-[180px] rounded-xl bg-neutral-200/80 sm:h-12 sm:max-w-sm dark:bg-neutral-700/70" />
        </div>

        {/* Description lines */}
        <div className="mt-5 space-y-2.5">
          <div className="h-4 w-[85%] max-w-[300px] rounded-full bg-neutral-200/80 sm:max-w-xl dark:bg-neutral-700/60" />
          <div className="h-4 w-[65%] max-w-[240px] rounded-full bg-neutral-200/70 sm:max-w-lg dark:bg-neutral-700/50" />
        </div>

        {/* Action buttons */}
        <div className="mt-7 flex gap-3 sm:mt-8">
          <div className="h-11 w-36 rounded-full bg-neutral-200 sm:w-40 dark:bg-neutral-700" />
          <div className="h-11 w-32 rounded-full bg-neutral-200/80 sm:w-36 dark:bg-neutral-700/70" />
        </div>

        {/* Content cards - stacked on mobile, side by side on desktop */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
          <div className="h-32 rounded-2xl border border-neutral-200 bg-neutral-100/50 sm:h-36 dark:border-neutral-700 dark:bg-neutral-800/50" />
          <div className="h-32 rounded-2xl border border-neutral-200 bg-neutral-100/50 sm:h-36 dark:border-neutral-700 dark:bg-neutral-800/50" />
        </div>

        <span className="sr-only">Loading page content</span>
      </Container>
    </div>
  );
}
