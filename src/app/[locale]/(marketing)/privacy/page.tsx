import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { LegalDoc, LegalSection } from "@/components/sections/legal/legal-doc";
import { Link } from "@/lib/i18n/routing";
import { socialLinks } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Istanbul Nomads collects, why, who we share it with, and how to access, export, or delete your data.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  setRequestLocale(locale);

  return (
    <LegalDoc
      eyebrow="Privacy"
      title="Privacy Policy"
      effectiveDate="Effective 10 June 2026"
      intro="Istanbul Nomads is a community for digital nomads in Istanbul. We keep the data we hold about you small and only collect what a feature actually needs. Here's the plain version of what we store, why, and the controls you have."
    >
      <LegalSection heading="Who we are">
        <p>
          Istanbul Nomads (&quot;we&quot;) runs istanbulnomads.com. For data
          protection law - the EU/UK GDPR and Turkey&apos;s KVKK - we&apos;re
          the data controller for the personal data described here. Questions go
          to{" "}
          <a className="underline" href="mailto:hello@istanbulnomads.com">
            hello@istanbulnomads.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="What we collect">
        <p>
          <strong>If you create an account:</strong> your email, display name,
          and anything you choose to add to your profile (bio, photo,
          neighborhood, skills, website, Telegram handle, and optional fields
          like birthday, gender, nationality, or a WhatsApp number). You decide
          what&apos;s public via the directory opt-in.
        </p>
        <p>
          <strong>If you use a form:</strong> the newsletter takes your email;
          the contact form takes your name, email, and message; the
          surprise-event waitlist takes your first name and email; a local-guide
          application takes the details on that form (including phone, photo,
          and social links); the relocation agent takes the preferences you
          enter (budget, duration, origin country, notes).
        </p>
        <p>
          <strong>Automatically:</strong> a consent choice, your theme and
          language, and - only if you allow analytics - aggregate usage data
          (see our{" "}
          <Link className="underline" href="/cookies">
            Cookie Policy
          </Link>
          ). We rate-limit some endpoints by IP address to prevent abuse.
        </p>
      </LegalSection>

      <LegalSection heading="Why we use it (and the legal basis)">
        <p>
          To run your account and the community features you ask for
          (performance of a contract). To send the newsletter and load analytics
          (your consent, which you can withdraw any time). To keep the service
          secure and prevent spam (our legitimate interest). We don&apos;t sell
          your data, and we don&apos;t run ads.
        </p>
      </LegalSection>

      <LegalSection heading="Who we share it with">
        <p>
          We use a small set of processors to run the site, each handling only
          what their job needs: Supabase (database, auth, and file storage),
          Resend (sending email), Vercel (hosting and privacy-friendly traffic
          measurement), Google Tag Manager and Analytics (consent-gated usage
          analytics), Upstash (rate-limiting), and Sentry (server error
          reports). If you connect Telegram, your messages with our bot are
          handled by Telegram. Payments, when live, will run through iyzico.
        </p>
      </LegalSection>

      <LegalSection heading="How long we keep it">
        <p>
          Account data stays until you delete your account. Newsletter emails
          stay until you unsubscribe. Form submissions are kept while we act on
          them and then for a reasonable period for our records. Analytics data
          follows the retention set in Google Analytics.
        </p>
      </LegalSection>

      <LegalSection heading="Your controls">
        <p>
          <strong>Edit:</strong> change your profile any time in your dashboard.
          <br />
          <strong>Delete:</strong> remove your account and everything tied to it
          from Dashboard &rarr; Account &rarr; Delete account. It&apos;s
          immediate and can&apos;t be undone.
          <br />
          <strong>Unsubscribe:</strong> every newsletter has a one-click
          unsubscribe link.
          <br />
          <strong>Analytics:</strong> change your choice any time from the
          cookie settings.
        </p>
        <p>
          Under the GDPR and KVKK you can also ask us to access, correct,
          export, or restrict your data, and you can complain to your local data
          protection authority. Email{" "}
          <a className="underline" href="mailto:hello@istanbulnomads.com">
            hello@istanbulnomads.com
          </a>{" "}
          and we&apos;ll sort it out.
        </p>
      </LegalSection>

      <LegalSection heading="Changes & contact">
        <p>
          If we change this policy we&apos;ll update the date above. For
          anything privacy-related, reach us at{" "}
          <a className="underline" href="mailto:hello@istanbulnomads.com">
            hello@istanbulnomads.com
          </a>{" "}
          or on{" "}
          <a
            className="underline"
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
