import Link from "next/link";
import { MapPin, Calendar, Send, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { socialLinks } from "@/lib/constants";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-[#6b6257] dark:text-[#b8a898]">
          This page doesn&apos;t exist or has been moved. Here are some places
          to go instead:
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full rounded-xl sm:w-auto">
              <Home className="h-4 w-4" />
              Go home
            </Button>
          </Link>
          <Link href="/guides">
            <Button variant="secondary" className="w-full rounded-xl sm:w-auto">
              <MapPin className="h-4 w-4" />
              Browse guides
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" className="w-full rounded-xl sm:w-auto">
              <Calendar className="h-4 w-4" />
              View events
            </Button>
          </Link>
        </div>
        <div className="mt-6">
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#6b6257] transition-colors hover:text-primary-600 dark:text-[#b8a898] dark:hover:text-primary-400"
          >
            <Send className="h-3.5 w-3.5" />
            Or ask in the Telegram group
          </a>
        </div>
      </div>
    </Section>
  );
}
