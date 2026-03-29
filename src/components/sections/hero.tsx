import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { socialLinks } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-white dark:from-primary-950/20 dark:via-neutral-950 dark:to-neutral-950" />
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Remote workers in Istanbul
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Your community
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              in Istanbul
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 sm:text-xl">
            Meetups, coworking sessions, city guides, and real connections for
            digital nomads living in or visiting Istanbul.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg">
                Join on Telegram
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <Link href="/guides">
              <Button variant="secondary" size="lg">
                Explore Guides
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
