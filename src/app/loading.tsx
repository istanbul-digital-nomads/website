import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <div className="relative overflow-hidden py-12 sm:py-16">
      <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-15" />

      <Container className="relative">
        <div className="mb-8 h-1.5 w-28 overflow-hidden rounded-full bg-black/10 dark:bg-white/10 sm:mb-10 sm:w-32">
          <div className="loading-bar h-full w-full rounded-full bg-gradient-to-r from-primary-500 via-accent-warm to-accent-green" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow">Loading next page</p>
            <div className="mt-5 space-y-3 sm:space-y-4">
              <div className="h-12 w-full max-w-2xl rounded-2xl bg-black/8 dark:bg-white/8 sm:h-14" />
              <div className="h-12 w-full max-w-xl rounded-2xl bg-black/8 dark:bg-white/8 sm:h-14" />
            </div>
            <div className="mt-5 h-5 w-full max-w-2xl rounded-full bg-black/8 dark:bg-white/8 sm:mt-6 sm:h-6" />
            <div className="mt-3 h-5 w-full max-w-xl rounded-full bg-black/8 dark:bg-white/8 sm:h-6" />

            <div className="mt-6 flex gap-3 sm:mt-8">
              <div className="h-11 w-40 rounded-full bg-black/8 dark:bg-white/8" />
              <div className="h-11 w-36 rounded-full bg-black/8 dark:bg-white/8" />
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-5 sm:p-6">
            <div className="h-8 w-40 rounded-full bg-black/8 dark:bg-white/8" />
            <div className="mt-5 grid gap-3">
              <div className="surface-subtle h-24 rounded-[1.5rem]" />
              <div className="surface-subtle h-24 rounded-[1.5rem]" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="surface-subtle h-32 rounded-[1.5rem]" />
              <div className="surface-subtle h-32 rounded-[1.5rem]" />
            </div>
          </div>
        </div>

        <span className="sr-only">Loading page content</span>
      </Container>
    </div>
  );
}
