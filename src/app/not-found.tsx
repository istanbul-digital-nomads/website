import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
          <Link href="/guides">
            <Button variant="secondary">Browse guides</Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
