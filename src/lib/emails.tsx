/* eslint-disable @next/next/no-head-element */
import * as React from "react";
import { getTranslations } from "next-intl/server";
import { defaultLocale, isRtl, type Locale } from "@/lib/i18n/config";
import { signUnsubscribe } from "@/lib/newsletter-token";

const brandColors = {
  bg: "#f6f0e9",
  cardBg: "#ffffff",
  ink: "#14110f",
  primary: "#c0392b",
  primaryLight: "#e74c3c",
  text: "#1a1a2e",
  muted: "#6f6259",
  soft: "#fbfaf8",
  border: "#dfd5ca",
  darkBorder: "#302823",
  accent: "#f39c12",
};

const textStyles = {
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  sans: "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

function EmailLayout({
  children,
  previewText,
  locale,
  brandName,
  brandTagline,
  ferryTicker,
  footerTagline,
  footerSiteUrl,
}: {
  children: React.ReactNode;
  previewText: string;
  locale: Locale;
  brandName: string;
  brandTagline: string;
  ferryTicker: string;
  footerTagline: string;
  footerSiteUrl: string;
}) {
  const rtl = isRtl(locale);
  const dir = rtl ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{brandName}</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: brandColors.bg,
          fontFamily: textStyles.sans,
          direction: dir,
        }}
      >
        <span
          style={{
            display: "none",
            maxHeight: 0,
            overflow: "hidden",
            fontSize: 0,
          }}
        >
          {previewText}
        </span>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: brandColors.bg, direction: dir }}
          dir={dir}
        >
          <tr>
            <td align="center" style={{ padding: "40px 16px" }}>
              <table
                role="presentation"
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                style={{ maxWidth: 560, direction: dir }}
                dir={dir}
              >
                <tr>
                  <td
                    style={{
                      padding: "0 0 18px",
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: textStyles.mono,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase" as const,
                      color: brandColors.primary,
                      textAlign: rtl ? ("right" as const) : ("left" as const),
                    }}
                  >
                    {brandName}
                    <span style={{ color: brandColors.muted }}>
                      {" "}
                      / {brandTagline}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: brandColors.cardBg,
                      borderRadius: 14,
                      border: `1px solid ${brandColors.border}`,
                      padding: "0",
                      overflow: "hidden",
                    }}
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellPadding={0}
                      cellSpacing={0}
                      style={{
                        backgroundColor: brandColors.ink,
                        direction: dir,
                      }}
                      dir={dir}
                    >
                      <tr>
                        <td style={{ padding: "18px 28px" }}>
                          <p
                            style={{
                              margin: 0,
                              fontFamily: textStyles.mono,
                              fontSize: 10,
                              lineHeight: "16px",
                              letterSpacing: "0.2em",
                              textTransform: "uppercase" as const,
                              color: "#d8d0c8",
                              textAlign: rtl
                                ? ("right" as const)
                                : ("left" as const),
                            }}
                          >
                            {ferryTicker}
                          </p>
                        </td>
                      </tr>
                    </table>
                    <div style={{ padding: "34px 30px 32px" }}>{children}</div>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      paddingTop: 24,
                      textAlign: "center" as const,
                      fontSize: 12,
                      color: brandColors.muted,
                      lineHeight: "20px",
                    }}
                  >
                    {footerTagline}
                    <br />
                    <a
                      href="https://istanbulnomads.com"
                      style={{
                        color: brandColors.primaryLight,
                        textDecoration: "none",
                      }}
                    >
                      {footerSiteUrl}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 10px",
        fontFamily: textStyles.mono,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: brandColors.primary,
      }}
    >
      {children}
    </p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        margin: "0 0 12px",
        fontSize: 28,
        lineHeight: "32px",
        fontWeight: 800,
        color: brandColors.text,
      }}
    >
      {children}
    </h1>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 24px",
        fontSize: 15,
        color: brandColors.muted,
        lineHeight: "26px",
      }}
    >
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 5px",
        fontFamily: textStyles.mono,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase" as const,
        color: brandColors.muted,
      }}
    >
      {children}
    </p>
  );
}

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 16px",
        fontSize: 15,
        lineHeight: "24px",
        color: brandColors.text,
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  );
}

function InfoPanel({ children }: { children: React.ReactNode }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{
        backgroundColor: brandColors.soft,
        border: `1px solid ${brandColors.border}`,
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <tr>
        <td style={{ padding: "18px 20px 4px" }}>{children}</td>
      </tr>
    </table>
  );
}

function PrimaryButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        padding: "14px 26px",
        backgroundColor: brandColors.text,
        color: "#ffffff",
        fontSize: 15,
        fontWeight: 700,
        borderRadius: 10,
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
}

function LinkCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "16px 18px",
        marginBottom: 10,
        backgroundColor: brandColors.soft,
        border: `1px solid ${brandColors.border}`,
        borderRadius: 12,
        textDecoration: "none",
        color: brandColors.text,
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 15,
          fontWeight: 800,
          color: brandColors.text,
        }}
      >
        {title}
      </span>
      <span
        style={{
          display: "block",
          fontSize: 13,
          lineHeight: "21px",
          color: brandColors.muted,
          marginTop: 3,
        }}
      >
        {desc}
      </span>
    </a>
  );
}

async function getSharedChrome(locale: Locale) {
  const tShared = await getTranslations({
    locale,
    namespace: "emails.shared",
  });
  const tSite = await getTranslations({ locale, namespace: "site" });
  return {
    brandName: tShared("brandName"),
    brandTagline: tSite("tagline"),
    ferryTicker: tShared("ferryTicker"),
    footerTagline: tShared("footerTagline"),
    footerSiteUrl: tShared("footerSiteUrl"),
  };
}

export async function ContactFormEmail({
  name,
  email,
  message,
  locale = defaultLocale,
}: {
  name: string;
  email: string;
  message: string;
  locale?: Locale;
}) {
  const t = await getTranslations({
    locale,
    namespace: "emails.contactForm",
  });
  const chrome = await getSharedChrome(locale);
  return (
    <EmailLayout
      previewText={t("previewTextTemplate", { name })}
      locale={locale}
      {...chrome}
    >
      <Kicker>{t("kicker")}</Kicker>
      <Heading>{t("headingTemplate", { name })}</Heading>
      <BodyText>{t("intro")}</BodyText>

      <InfoPanel>
        <FieldLabel>{t("fromLabel")}</FieldLabel>
        <FieldValue>{name}</FieldValue>
        <FieldLabel>{t("emailLabel")}</FieldLabel>
        <FieldValue>
          <a
            href={`mailto:${email}`}
            style={{
              color: brandColors.primary,
              textDecoration: "none",
            }}
          >
            {email}
          </a>
        </FieldValue>
      </InfoPanel>

      <FieldLabel>{t("messageLabel")}</FieldLabel>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: "26px",
          color: brandColors.text,
          whiteSpace: "pre-wrap" as const,
        }}
      >
        {message}
      </p>

      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${brandColors.border}`,
          margin: "28px 0",
        }}
      />
      <PrimaryButton href={`mailto:${email}`}>
        {t("replyCtaTemplate", { name })}
      </PrimaryButton>
    </EmailLayout>
  );
}

export async function NewsletterWelcomeEmail({
  email = "",
  locale = defaultLocale,
}: {
  email?: string;
  locale?: Locale;
}) {
  const t = await getTranslations({
    locale,
    namespace: "emails.newsletterWelcome",
  });
  const chrome = await getSharedChrome(locale);
  // Sign the email so the link can only unsubscribe this address (not an
  // arbitrary one typed into the URL). The unsubscribe API re-verifies it.
  const unsubscribeHref = email
    ? `https://istanbulnomads.com/unsubscribe?email=${encodeURIComponent(
        email,
      )}&token=${signUnsubscribe(email)}`
    : "https://istanbulnomads.com/unsubscribe";

  return (
    <EmailLayout previewText={t("previewText")} locale={locale} {...chrome}>
      <Kicker>{t("kicker")}</Kicker>
      <Heading>{t("heading")}</Heading>
      <BodyText>{t("body")}</BodyText>

      <InfoPanel>
        <FieldLabel>{t("firstWeekLabel")}</FieldLabel>
        <FieldValue>{t("firstWeekValue")}</FieldValue>
        <FieldLabel>{t("firstStepLabel")}</FieldLabel>
        <FieldValue>{t("firstStepValue")}</FieldValue>
      </InfoPanel>

      <Kicker>{t("startHereKicker")}</Kicker>

      {[
        {
          title: t("links.neighborhoodsTitle"),
          desc: t("links.neighborhoodsDesc"),
          href: "https://istanbulnomads.com/guides/neighborhoods",
        },
        {
          title: t("links.costTitle"),
          desc: t("links.costDesc"),
          href: "https://istanbulnomads.com/guides/cost-of-living",
        },
        {
          title: t("links.coworkingTitle"),
          desc: t("links.coworkingDesc"),
          href: "https://istanbulnomads.com/guides/coworking",
        },
      ].map((link) => (
        <LinkCard key={link.href} {...link} />
      ))}

      <table
        role="presentation"
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{ marginTop: 28 }}
      >
        <tr>
          <td align="center">
            <PrimaryButton href="https://t.me/istanbul_digital_nomads">
              {t("ctaJoin")}
            </PrimaryButton>
          </td>
        </tr>
      </table>

      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${brandColors.border}`,
          margin: "28px 0",
        }}
      />
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: brandColors.muted,
          lineHeight: "20px",
          textAlign: "center" as const,
        }}
      >
        {t("unsubscribeNote")}{" "}
        <a
          href={unsubscribeHref}
          style={{ color: brandColors.primaryLight, textDecoration: "none" }}
        >
          {t("unsubscribeLink")}
        </a>
      </p>
    </EmailLayout>
  );
}

export async function GuideApplicationEmail({
  name,
  email,
  specializations,
  neighborhoods,
  languages,
  years_in_istanbul,
  bio,
  motivation,
  sample_tip,
  locale = defaultLocale,
}: {
  name: string;
  email: string;
  specializations: string[];
  neighborhoods: string[];
  languages: string[];
  years_in_istanbul: number;
  bio: string;
  motivation: string;
  sample_tip?: string;
  locale?: Locale;
}) {
  const t = await getTranslations({
    locale,
    namespace: "emails.guideApplication",
  });
  const chrome = await getSharedChrome(locale);
  return (
    <EmailLayout
      previewText={t("previewTextTemplate", { name })}
      locale={locale}
      {...chrome}
    >
      <Kicker>{t("kicker")}</Kicker>
      <Heading>{t("headingTemplate", { name })}</Heading>
      <BodyText>{t("intro")}</BodyText>

      <InfoPanel>
        <FieldLabel>{t("experienceLabel")}</FieldLabel>
        <FieldValue>
          {t("experienceValueTemplate", { years: years_in_istanbul })}
        </FieldValue>
        <FieldLabel>{t("specializationsLabel")}</FieldLabel>
        <FieldValue>{specializations.join(", ")}</FieldValue>
        <FieldLabel>{t("neighborhoodsLabel")}</FieldLabel>
        <FieldValue>{neighborhoods.join(", ")}</FieldValue>
        <FieldLabel>{t("languagesLabel")}</FieldLabel>
        <FieldValue>{languages.join(", ")}</FieldValue>
      </InfoPanel>

      <FieldLabel>{t("bioLabel")}</FieldLabel>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 15,
          lineHeight: "26px",
          color: brandColors.text,
        }}
      >
        {bio.slice(0, 200)}
        {bio.length > 200 ? "..." : ""}
      </p>

      {sample_tip ? (
        <>
          <FieldLabel>{t("sampleTipLabel")}</FieldLabel>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 15,
              lineHeight: "26px",
              color: brandColors.text,
            }}
          >
            {sample_tip.slice(0, 220)}
            {sample_tip.length > 220 ? "..." : ""}
          </p>
        </>
      ) : null}

      <FieldLabel>{t("motivationLabel")}</FieldLabel>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: "26px",
          color: brandColors.text,
        }}
      >
        {motivation.slice(0, 200)}
        {motivation.length > 200 ? "..." : ""}
      </p>

      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${brandColors.border}`,
          margin: "28px 0",
        }}
      />
      <PrimaryButton href={`mailto:${email}`}>
        {t("replyCtaTemplate", { name })}
      </PrimaryButton>
    </EmailLayout>
  );
}
