import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Send, Twitter } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { footerNav, socialLinks, type FooterLinkKey } from "@/lib/constants";
import { NewsletterForm } from "@/components/newsletter-form";

const socialIcons = [
  { href: socialLinks.telegram, icon: Send, key: "telegram" as const },
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
    <footer className="relative overflow-hidden border-t border-black/10 bg-[#f6f1ea] text-neutral-950 dark:border-white/10 dark:bg-[#14110f] dark:text-[#f2f3f4]">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/neighborhoods/kadikoy/hero-premium-2026.jpg')] bg-cover bg-center opacity-[0.08] dark:opacity-[0.1]" />
      <div className="pointer-events-none absolute inset-0 bg-[#f6f1ea]/88 dark:bg-[#14110f]/88" />

      <Container className="relative">
        <div className="grid gap-5 border-b border-black/10 py-7 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:items-end dark:border-white/10">
          <div>
            <p className="eyebrow text-primary-700 dark:text-primary-200">
              {tFooter("newsletterEyebrow")}
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-h3 text-neutral-950 dark:text-[#f2f3f4]">
              {tFooter("newsletterTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0] sm:text-base sm:leading-7">
              {tFooter("newsletterBody")}
            </p>
          </div>
          <NewsletterForm variant="footer" />
        </div>

        <div className="grid gap-10 border-b border-black/10 py-9 lg:grid-cols-[1.1fr_2.4fr] dark:border-white/10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo-light.png"
                alt={tSite("shortName")}
                width={530}
                height={680}
                className="block dark:hidden"
                style={{ width: 28, height: "auto" }}
              />
              <Image
                src="/images/logo-dark.png"
                alt={tSite("shortName")}
                width={542}
                height={693}
                className="hidden dark:block"
                style={{ width: 28, height: "auto" }}
              />
              <span className="max-w-48 text-sm font-semibold uppercase tracking-[0.2em] text-primary-900 dark:text-primary-100">
                {tSite("name")}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm italic leading-7 text-[#6b6257] dark:text-[#b7aaa0]">
              {tFooter("tagline")}
            </p>
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

        <div className="flex flex-wrap items-center gap-2 border-b border-black/10 py-5 dark:border-white/10">
          {socialIcons.map(({ href, icon: Icon, key }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-highlight inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white/35 text-[#5d4a3e] transition-colors hover:border-primary-500/40 hover:text-primary-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#b7aaa0] dark:hover:border-primary-400/40 dark:hover:text-primary-200"
              aria-label={tLinks(key)}
              title={tLinks(key)}
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-2 py-5 pb-20 font-mono text-[11px] uppercase leading-5 tracking-[0.24em] text-[#7a6b60] md:flex-row md:items-center md:justify-between md:pb-5 dark:text-[#94877d]">
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
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-primary-700 dark:text-primary-200">
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
                className="text-sm leading-6 text-[#5d6d7e] transition-colors hover:text-primary-600 dark:text-[#b7aaa0] dark:hover:text-primary-300"
              >
                {labelFor(link.key)}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm leading-6 text-[#5d6d7e] transition-colors hover:text-primary-600 dark:text-[#b7aaa0] dark:hover:text-primary-300"
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
