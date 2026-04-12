/* eslint-disable @next/next/no-head-element */
import * as React from "react";

const brandColors = {
  bg: "#f5efe4",
  cardBg: "#ffffff",
  primary: "#8a2a1a",
  primaryLight: "#e34b32",
  text: "#2a2018",
  muted: "#6b6257",
  border: "#e8e0d4",
  accent: "#d49a45",
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
          fontFamily:
            "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
                      paddingBottom: 24,
                      textAlign: "center" as const,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase" as const,
                      color: brandColors.primary,
                    }}
                  >
                    Istanbul Digital Nomads
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: brandColors.cardBg,
                      borderRadius: 16,
                      border: `1px solid ${brandColors.border}`,
                      padding: "36px 32px",
                    }}
                  >
                    {children}
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
                    Istanbul Digital Nomads - Remote life, local rhythm
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
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: 22,
          fontWeight: 700,
          color: brandColors.text,
        }}
      >
        New contact form message
      </h1>
      <p
        style={{
          margin: "0 0 24px",
          fontSize: 14,
          color: brandColors.muted,
          lineHeight: "22px",
        }}
      >
        Someone reached out through istanbulnomads.com
      </p>

      <table
        role="presentation"
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{
          backgroundColor: brandColors.bg,
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <tr>
          <td style={{ padding: "16px 20px" }}>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: brandColors.muted,
              }}
            >
              From
            </p>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 15,
                color: brandColors.text,
                fontWeight: 600,
              }}
            >
              {name}
            </p>

            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: brandColors.muted,
              }}
            >
              Email
            </p>
            <p style={{ margin: "0", fontSize: 15, color: brandColors.text }}>
              <a
                href={`mailto:${email}`}
                style={{
                  color: brandColors.primaryLight,
                  textDecoration: "none",
                }}
              >
                {email}
              </a>
            </p>
          </td>
        </tr>
      </table>

      <p
        style={{
          margin: "0 0 8px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: brandColors.muted,
        }}
      >
        Message
      </p>
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
      <p style={{ margin: 0, fontSize: 13, color: brandColors.muted }}>
        Reply directly to this email to respond to {name}.
      </p>
    </EmailLayout>
  );
}

export function NewsletterWelcomeEmail() {
  return (
    <EmailLayout previewText="Welcome to Istanbul Digital Nomads - here's what to check first">
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: 22,
          fontWeight: 700,
          color: brandColors.text,
        }}
      >
        Welcome to Istanbul Digital Nomads
      </h1>
      <p
        style={{
          margin: "0 0 28px",
          fontSize: 15,
          color: brandColors.muted,
          lineHeight: "26px",
        }}
      >
        You&apos;re in. We&apos;ll send you the occasional update - new guides,
        upcoming events, and things worth knowing about Istanbul as a remote
        worker.
      </p>

      <p
        style={{
          margin: "0 0 12px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: brandColors.primary,
        }}
      >
        Start here
      </p>

      {[
        {
          title: "Neighborhoods guide",
          desc: "Find the right area for your pace and budget",
          href: "https://istanbulnomads.com/guides/neighborhoods",
        },
        {
          title: "Cost of living breakdown",
          desc: "Real monthly budgets at three comfort levels",
          href: "https://istanbulnomads.com/guides/cost-of-living",
        },
        {
          title: "Internet & SIM cards",
          desc: "Get online fast without overpaying",
          href: "https://istanbulnomads.com/guides/internet",
        },
      ].map((link) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            display: "block",
            padding: "14px 20px",
            marginBottom: 8,
            backgroundColor: brandColors.bg,
            borderRadius: 12,
            textDecoration: "none",
            color: brandColors.text,
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: 15,
              fontWeight: 600,
              color: brandColors.text,
            }}
          >
            {link.title}
          </span>
          <span
            style={{
              display: "block",
              fontSize: 13,
              color: brandColors.muted,
              marginTop: 2,
            }}
          >
            {link.desc}
          </span>
        </a>
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
            <a
              href="https://t.me/istanbul_digital_nomads"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                backgroundColor: brandColors.primary,
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              Join the Telegram group
            </a>
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
        Don&apos;t want these emails?{" "}
        <a
          href="https://istanbulnomads.com/unsubscribe?email={email}"
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
}: {
  name: string;
  email: string;
  specializations: string[];
  neighborhoods: string[];
  languages: string[];
  years_in_istanbul: number;
  bio: string;
  motivation: string;
}) {
  return (
    <EmailLayout previewText={`New guide application from ${name}`}>
      <h1
        style={{
          margin: "0 0 8px",
          fontSize: 22,
          fontWeight: 700,
          color: brandColors.text,
        }}
      >
        New local guide application
      </h1>
      <p
        style={{
          margin: "0 0 24px",
          fontSize: 14,
          color: brandColors.muted,
          lineHeight: "22px",
        }}
      >
        Someone applied to become a local guide on istanbulnomads.com
      </p>

      <table
        role="presentation"
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{
          backgroundColor: brandColors.bg,
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <tr>
          <td style={{ padding: "16px 20px" }}>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: brandColors.muted,
              }}
            >
              From
            </p>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 15,
                color: brandColors.text,
                fontWeight: 600,
              }}
            >
              {name} - {years_in_istanbul} years in Istanbul
            </p>

            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: brandColors.muted,
              }}
            >
              Specializations
            </p>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 15,
                color: brandColors.text,
              }}
            >
              {specializations.join(", ")}
            </p>

            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: brandColors.muted,
              }}
            >
              Neighborhoods
            </p>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 15,
                color: brandColors.text,
              }}
            >
              {neighborhoods.join(", ")}
            </p>

            <p
              style={{
                margin: "0 0 4px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: brandColors.muted,
              }}
            >
              Languages
            </p>
            <p style={{ margin: 0, fontSize: 15, color: brandColors.text }}>
              {languages.join(", ")}
            </p>
          </td>
        </tr>
      </table>

      <p
        style={{
          margin: "0 0 8px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: brandColors.muted,
        }}
      >
        Bio
      </p>
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

      <p
        style={{
          margin: "0 0 8px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: brandColors.muted,
        }}
      >
        Motivation
      </p>
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
      <p style={{ margin: 0, fontSize: 13, color: brandColors.muted }}>
        Reply to this email to reach {name} at{" "}
        <a
          href={`mailto:${email}`}
          style={{ color: brandColors.primaryLight, textDecoration: "none" }}
        >
          {email}
        </a>
      </p>
    </EmailLayout>
  );
}
