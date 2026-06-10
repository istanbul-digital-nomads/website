import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { LegalDoc, LegalSection } from "@/components/sections/legal/legal-doc";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The ground rules for using Istanbul Nomads - the community, plans, events, and paid tickets.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  setRequestLocale(locale);

  return (
    <LegalDoc
      eyebrow="Terms"
      title="Terms of Use"
      effectiveDate="Effective 10 June 2026"
      intro="These are the ground rules for using Istanbul Nomads. They're meant to be readable, not to trap you. By using the site you agree to them."
    >
      <LegalSection heading="The basics">
        <p>
          Istanbul Nomads is a community platform for digital nomads in
          Istanbul. You can browse most of it without an account; some features
          (joining plans, hosting, your profile) need one. You must be 18 or
          older to create an account.
        </p>
      </LegalSection>

      <LegalSection heading="Your account">
        <p>
          Keep your login details to yourself - you&apos;re responsible for what
          happens under your account. Use a real identity, keep your profile
          accurate, and don&apos;t impersonate anyone. You can delete your
          account any time from your dashboard.
        </p>
      </LegalSection>

      <LegalSection heading="Being a good member">
        <p>
          Don&apos;t post anything illegal, hateful, harassing, or spammy, and
          don&apos;t scrape or abuse the site or other members&apos; details. We
          can remove content or suspend accounts that break these rules or put
          the community at risk. Plans and events are organized by members - use
          your own judgement about who you meet and where you go.
        </p>
      </LegalSection>

      <LegalSection heading="Plans, events & tickets">
        <p>
          Members create plans and events; we don&apos;t run or vet every one.
          Free events usually RSVP through Telegram. For ticketed plans, the
          host sets the price and the terms; when paid checkout is live,
          payments are processed by iyzico and any refund follows the policy
          shown at checkout. We&apos;re not a party to the arrangement between a
          host and an attendee.
        </p>
      </LegalSection>

      <LegalSection heading="Local guides & paperwork">
        <p>
          Local guides and paperwork helpers listed here are independent - they
          aren&apos;t our employees or agents. We don&apos;t give legal,
          immigration, or financial advice, and we can&apos;t guarantee any
          outcome, price, or timeline. Always confirm details directly and bring
          your own documents.
        </p>
      </LegalSection>

      <LegalSection heading="Our content & yours">
        <p>
          The site&apos;s design, guides, and original content are ours. When
          you post (a profile, a plan, a comment), you keep your rights but give
          us permission to show it on the platform. Don&apos;t post things you
          don&apos;t have the right to share.
        </p>
      </LegalSection>

      <LegalSection heading="As-is, and liability">
        <p>
          We work hard to keep the site useful and online, but it&apos;s
          provided &quot;as is&quot; without warranties, and we&apos;re not
          liable for losses from using it, from meeting other members, or from
          third-party services. Nothing here limits liability that can&apos;t be
          limited by law.
        </p>
      </LegalSection>

      <LegalSection heading="Changes & contact">
        <p>
          We may update these terms; we&apos;ll change the date above when we
          do. Questions? Email{" "}
          <a className="underline" href="mailto:hello@istanbulnomads.com">
            hello@istanbulnomads.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
