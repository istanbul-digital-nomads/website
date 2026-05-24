import Image from "next/image";
import Link from "next/link";
import { Github, Instagram, Mail, Send, Twitter } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { footerNav, socialLinks, type FooterLinkKey } from "@/lib/constants";
import { NewsletterForm } from "@/components/sections/newsletter-form";

const socialIcons = [
  { href: socialLinks.telegram, icon: Send, key: "telegram" as const },
  { href: socialLinks.instagram, icon: Instagram, key: "instagram" as const },
  { href: socialLinks.github, icon: Github, key: "github" as const },
  { href: socialLinks.twitter, icon: Twitter, key: "twitter" as const },
  { href: `mailto:${socialLinks.email}`, icon: Mail, key: "email" as const },
];

export async function Footer({ locale }: { locale: Locale }) {
  "use cache";
  const tSite = getCachedTranslations(locale, "site");
  const tFooter = getCachedTranslations(locale, "footer");
  const tColumns = getCachedTranslations(locale, "footer.columns");
  const tLinks = getCachedTranslations(locale, "footer.links");

  return (
    <footer className="border-t border-ink-3 bg-ink-1 text-paper">
      <Container>
        {/* Newsletter */}
        <div className="grid gap-5 border-b border-ink-3 py-9 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
              {tFooter("newsletterEyebrow")}
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-h3 text-paper">
              {tFooter("newsletterTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-mute">
              {tFooter("newsletterBody")}
            </p>
          </div>
          <NewsletterForm variant="footer" />
        </div>

        {/* Masthead + link columns */}
        <div className="grid gap-10 border-b border-ink-3 py-12 lg:grid-cols-[1.4fr_2.4fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo-light.png"
                alt={tSite("shortName")}
                width={512}
                height={512}
                className="block"
                style={{ width: 32, height: "auto" }}
              />
              <span className="font-display text-base tracking-tight text-paper">
                {tSite("name")}
              </span>
            </Link>
            <p className="mt-5 max-w-sm font-display text-2xl leading-snug tracking-tight text-paper-dim">
              {tFooter("tagline")}
            </p>
            <div className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-paper-mute">
              <div>Istanbul · 41°00′N 28°58′E</div>
              <div>UTC+3 · TRY ₺ · EN / TR / FA / AR / RU</div>
            </div>
          </div>

          <div className="grid gap-8 min-[480px]:grid-cols-2 md:grid-cols-4">
            <FooterColumn
              title={tColumns("community")}
              links={footerNav.community}
              labelFor={(k) => tLinks(k)}
            />
            <FooterColumn
              title={tColumns("resources")}
              links={footerNav.resources}
              labelFor={(k) => tLinks(k)}
            />
            <FooterColumn
              title={tColumns("connect")}
              links={footerNav.connect}
              labelFor={(k) => tLinks(k)}
            />
            <FooterColumn
              title={tColumns("legal")}
              links={footerNav.legal}
              labelFor={(k) => tLinks(k)}
            />
          </div>
        </div>

        {/* Social */}
        <div className="flex flex-wrap items-center gap-2 border-b border-ink-3 py-5">
          {socialIcons.map(({ href, icon: Icon, key }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center border border-ink-4 text-paper-mute transition-colors hover:border-ink-5 hover:text-paper"
              aria-label={tLinks(key)}
              title={tLinks(key)}
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>

        {/* Colophon */}
        <div className="flex flex-col gap-2 py-6 pb-20 font-mono text-[11px] uppercase leading-5 tracking-wider text-paper-faint md:flex-row md:items-center md:justify-between md:pb-6">
          <p>
            {tFooter("copyright", {
              year: new Date().getFullYear(),
              name: tSite("name"),
            })}
          </p>
          <p>{tFooter("madeIn")}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  labelFor,
}: {
  title: string;
  links: ReadonlyArray<{
    key: FooterLinkKey;
    href: string;
    external?: boolean;
  }>;
  labelFor: (key: FooterLinkKey) => string;
}) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${link.key}-${link.href}`}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-6 text-paper-dim transition-colors hover:text-terracotta"
              >
                {labelFor(link.key)}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm leading-6 text-paper-dim transition-colors hover:text-terracotta"
              >
                {labelFor(link.key)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
