/* eslint-disable @next/next/no-head-element */
import * as React from "react";

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
}: {
  children: React.ReactNode;
  previewText: string;
}) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Istanbul Digital Nomads</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: brandColors.bg,
          fontFamily: textStyles.sans,
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
          style={{ backgroundColor: brandColors.bg }}
        >
          <tr>
            <td align="center" style={{ padding: "40px 16px" }}>
              <table
                role="presentation"
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                style={{ maxWidth: 560 }}
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
                    }}
                  >
                    Istanbul Digital Nomads
                    <span style={{ color: brandColors.muted }}>
                      {" "}
                      / remote life, local rhythm
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
                      style={{ backgroundColor: brandColors.ink }}
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
                            }}
                          >
                            Kadikoy 09:10 / Karakoy 10:25 / Galata 18:30
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
                    Istanbul Digital Nomads - ferry-first city notes for remote
                    workers
                    <br />
                    <a
                      href="https://istanbulnomads.com"
                      style={{
                        color: brandColors.primaryLight,
                        textDecoration: "none",
                      }}
                    >
                      istanbulnomads.com
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

export function ContactFormEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return (
    <EmailLayout previewText={`New message from ${name}`}>
      <Kicker>Inbox note</Kicker>
      <Heading>{name} sent a message</Heading>
      <BodyText>
        A new contact form message came in from the website. Reply directly to
        continue the thread from your inbox.
      </BodyText>

      <InfoPanel>
        <FieldLabel>From</FieldLabel>
        <FieldValue>{name}</FieldValue>
        <FieldLabel>Email</FieldLabel>
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

      <FieldLabel>Message</FieldLabel>
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
      <PrimaryButton href={`mailto:${email}`}>Reply to {name}</PrimaryButton>
    </EmailLayout>
  );
}

export function NewsletterWelcomeEmail({ email = "" }: { email?: string }) {
  const unsubscribeHref = `https://istanbulnomads.com/unsubscribe${
    email ? `?email=${encodeURIComponent(email)}` : ""
  }`;

  return (
    <EmailLayout previewText="Your ferry-first Istanbul starter map is here">
      <Kicker>Welcome aboard</Kicker>
      <Heading>Make Istanbul workable, one good route at a time.</Heading>
      <BodyText>
        You&apos;re on the list. We send practical city notes for remote
        workers: where to base yourself, which tables are laptop-safe, what a
        month really costs, and when the community is meeting next.
      </BodyText>

      <InfoPanel>
        <FieldLabel>Your first-week loop</FieldLabel>
        <FieldValue>Kadikoy base / ferry reset / Galata evening</FieldValue>
        <FieldLabel>What to do first</FieldLabel>
        <FieldValue>
          Pick a neighborhood before picking a monthly rental
        </FieldValue>
      </InfoPanel>

      <Kicker>Start here</Kicker>

      {[
        {
          title: "Neighborhoods guide",
          desc: "Choose Kadikoy, Moda, Cihangir, Besiktas, or Galata with real tradeoffs.",
          href: "https://istanbulnomads.com/guides/neighborhoods",
        },
        {
          title: "Cost of living breakdown",
          desc: "See monthly budgets before Istanbul starts negotiating with your wallet.",
          href: "https://istanbulnomads.com/guides/cost-of-living",
        },
        {
          title: "Coworking and laptop cafes",
          desc: "Find reliable tables for calls, focus days, and backup plans.",
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
              Join the workweek
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
        No noise. Just useful Istanbul notes.{" "}
        <a
          href={unsubscribeHref}
          style={{ color: brandColors.primaryLight, textDecoration: "none" }}
        >
          Unsubscribe
        </a>
      </p>
    </EmailLayout>
  );
}

export function GuideApplicationEmail({
  name,
  email,
  specializations,
  neighborhoods,
  languages,
  years_in_istanbul,
  bio,
  motivation,
  sample_tip,
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
}) {
  return (
    <EmailLayout previewText={`New guide application from ${name}`}>
      <Kicker>Local guide candidate</Kicker>
      <Heading>{name} wants to guide nomads in Istanbul</Heading>
      <BodyText>
        Review their neighborhoods, languages, sample tip, and motivation. If
        the fit looks strong, reply directly from this email.
      </BodyText>

      <InfoPanel>
        <FieldLabel>Experience</FieldLabel>
        <FieldValue>{years_in_istanbul} years in Istanbul</FieldValue>
        <FieldLabel>Specializations</FieldLabel>
        <FieldValue>{specializations.join(", ")}</FieldValue>
        <FieldLabel>Neighborhoods</FieldLabel>
        <FieldValue>{neighborhoods.join(", ")}</FieldValue>
        <FieldLabel>Languages</FieldLabel>
        <FieldValue>{languages.join(", ")}</FieldValue>
      </InfoPanel>

      <FieldLabel>Bio</FieldLabel>
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
          <FieldLabel>Sample tip</FieldLabel>
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

      <FieldLabel>Motivation</FieldLabel>
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
      <PrimaryButton href={`mailto:${email}`}>Reply to {name}</PrimaryButton>
    </EmailLayout>
  );
}
