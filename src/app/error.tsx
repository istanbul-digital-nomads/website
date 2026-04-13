"use client";

import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">
          Oops
        </p>
        <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-[#5d6d7e] dark:text-[#99a3ad]">
          Don&apos;t worry, it&apos;s not you. Try refreshing, or head back
          home.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full rounded-xl sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <a href="/">
            <Button variant="secondary" className="w-full rounded-xl sm:w-auto">
              <Home className="h-4 w-4" />
              Go home
            </Button>
          </a>
        </div>
      </div>
    </Section>
  );
}
