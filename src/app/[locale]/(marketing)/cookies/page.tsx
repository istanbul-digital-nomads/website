import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { LegalDoc, LegalSection } from "@/components/sections/legal/legal-doc";
import { Link } from "@/lib/i18n/routing";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies Istanbul Nomads uses, what each one does, and how to change your choice.",
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  setRequestLocale(locale);

  return (
    <LegalDoc
      eyebrow="Cookies"
      title="Cookie Policy"
      effectiveDate="Effective 10 June 2026"
      intro="We use as few cookies as we can get away with. Here's exactly what's set and why - and you can change your analytics choice any time."
    >
      <LegalSection heading="Essential (always on)">
        <p>
          These keep the site working and don&apos;t need consent: your consent
          choice itself (<code>in_consent</code>), your theme and language
          preference, and - once you sign in - the Supabase cookies that keep
          you logged in. We can&apos;t turn these off, but none of them track
          you across other sites.
        </p>
      </LegalSection>

      <LegalSection heading="Analytics (only with your consent)">
        <p>
          If you accept analytics, Google Analytics (loaded through Google Tag
          Manager) sets cookies so we can see which pages and features get used,
          in aggregate. We use Google Consent Mode v2, so nothing analytics-
          related runs until you allow it - and outside the EEA/UK/Switzerland
          it stays off until you choose. We don&apos;t use advertising cookies
          at all.
        </p>
      </LegalSection>

      <LegalSection heading="Changing your choice">
        <p>
          You picked accept or reject on the banner the first time you visited.
          To change it, clear the site&apos;s cookies (or use your
          browser&apos;s site settings) and the banner will ask again. Rejecting
          keeps the essential cookies above and nothing else.
        </p>
      </LegalSection>

      <LegalSection heading="More">
        <p>
          For the full picture of what we collect and your rights, see our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          . Questions go to{" "}
          <a className="underline" href="mailto:hello@istanbulnomads.com">
            hello@istanbulnomads.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
