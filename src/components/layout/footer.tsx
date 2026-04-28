import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Send, Twitter } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig, footerNav, socialLinks } from "@/lib/constants";
import { NewsletterForm } from "@/components/newsletter-form";

const socialIcons = [
  { href: socialLinks.telegram, icon: Send, label: "Telegram" },
  { href: socialLinks.github, icon: Github, label: "GitHub" },
  { href: socialLinks.twitter, icon: Twitter, label: "X/Twitter" },
  { href: `mailto:${socialLinks.email}`, icon: Mail, label: "Mail" },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-[#f6f1ea] text-neutral-950 dark:border-white/10 dark:bg-[#14110f] dark:text-[#f2f3f4]">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/neighborhoods/kadikoy/hero-2026.jpg')] bg-cover bg-center opacity-[0.08] dark:opacity-[0.1]" />
      <div className="pointer-events-none absolute inset-0 bg-[#f6f1ea]/88 dark:bg-[#14110f]/88" />

      <Container className="relative">
        <div className="grid gap-5 border-b border-black/10 py-7 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:items-end dark:border-white/10">
          <div>
            <p className="eyebrow text-primary-700 dark:text-primary-300">
              Sunday letter
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-h3 text-neutral-950 dark:text-[#f2f3f4]">
              Get the Sunday letter
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0] sm:text-base sm:leading-7">
              Practical city notes, fresh guides, and low-noise community
              updates from Istanbul.
            </p>
          </div>
          <NewsletterForm variant="footer" />
        </div>

        <div className="grid gap-10 border-b border-black/10 py-9 lg:grid-cols-[1.1fr_2.4fr] dark:border-white/10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo-light.png"
                alt="Istanbul Nomads"
                width={530}
                height={680}
                className="block dark:hidden"
                style={{ width: 28, height: "auto" }}
              />
              <Image
                src="/images/logo-dark.png"
                alt="Istanbul Nomads"
                width={542}
                height={693}
                className="hidden dark:block"
                style={{ width: 28, height: "auto" }}
              />
              <span className="max-w-48 text-sm font-semibold uppercase tracking-[0.2em] text-primary-900 dark:text-primary-100">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm italic leading-7 text-[#6b6257] dark:text-[#b7aaa0]">
              Local rhythm, practical guides, and a softer landing for digital
              nomads staying longer in Istanbul.
            </p>
          </div>

          <div className="grid gap-8 min-[480px]:grid-cols-2 md:grid-cols-4">
            <FooterColumn title="Community" links={footerNav.community} />
            <FooterColumn title="Resources" links={footerNav.resources} />
            <FooterColumn title="Connect" links={footerNav.connect} />
            <FooterColumn title="Legal" links={footerNav.legal} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-black/10 py-5 dark:border-white/10">
          {socialIcons.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-highlight inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white/35 text-[#5d4a3e] transition-colors hover:border-primary-500/40 hover:text-primary-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#b7aaa0] dark:hover:border-primary-400/40 dark:hover:text-primary-200"
              aria-label={label}
              title={label}
            >
              <Icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-2 py-5 pb-20 font-mono text-[11px] uppercase leading-5 tracking-[0.24em] text-[#7a6b60] md:flex-row md:items-center md:justify-between md:pb-5 dark:text-[#94877d]">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>Made in Kadikoy · v1.14.0</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string; external?: boolean }>;
}) {
  return (
    <div>
      <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-primary-700 dark:text-primary-300">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-6 text-[#5d6d7e] transition-colors hover:text-primary-600 dark:text-[#b7aaa0] dark:hover:text-primary-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm leading-6 text-[#5d6d7e] transition-colors hover:text-primary-600 dark:text-[#b7aaa0] dark:hover:text-primary-300"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
