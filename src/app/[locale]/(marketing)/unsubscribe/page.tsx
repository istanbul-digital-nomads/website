import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { UnsubscribeForm } from "./unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  setRequestLocale(locale);
  const { email = "", token = "" } = await searchParams;
  const t = await getTranslations("unsubscribe");

  return (
    <Container className="py-20 md:py-28">
      <div className="mx-auto max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper-faint">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-2xl text-paper md:text-3xl">
          {t("title")}
        </h1>
        <UnsubscribeForm email={email} token={token} />
      </div>
    </Container>
  );
}
