import Link from "next/link";
import { MapPin, Calendar, Send, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { socialLinks } from "@/lib/constants";

export default async function NotFound() {
  const t = await getTranslations("errorPages.notFound");
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">
          {t("code")}
        </p>
        <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-[#5d6d7e] dark:text-[#99a3ad]">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full rounded-xl sm:w-auto">
              <Home className="h-4 w-4" />
              {t("goHome")}
            </Button>
          </Link>
          <Link href="/guides">
            <Button variant="secondary" className="w-full rounded-xl sm:w-auto">
              <MapPin className="h-4 w-4" />
              {t("browseGuides")}
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" className="w-full rounded-xl sm:w-auto">
              <Calendar className="h-4 w-4" />
              {t("viewEvents")}
            </Button>
          </Link>
        </div>
        <div className="mt-6">
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#5d6d7e] transition-colors hover:text-primary-600 dark:text-[#99a3ad] dark:hover:text-primary-400"
          >
            <Send className="h-3.5 w-3.5" />
            {t("askTelegram")}
          </a>
        </div>
      </div>
    </Section>
  );
}
