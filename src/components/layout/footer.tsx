import Link from "next/link";
import { ArrowRight, Github, Mail, Send, Twitter } from "lucide-react";
import { Container } from "@/components/ui/container";
import { siteConfig, footerNav, socialLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const socialIcons = [
  { href: socialLinks.telegram, icon: Send, label: "Telegram" },
  { href: socialLinks.github, icon: Github, label: "GitHub" },
  { href: socialLinks.twitter, icon: Twitter, label: "Twitter" },
  { href: `mailto:${socialLinks.email}`, icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[rgba(245,239,228,0.72)] dark:border-white/10 dark:bg-[#151010]">
      <Container>
        <div className="grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-black/10 bg-neutral-950 px-6 py-8 text-white dark:border-white/10 dark:bg-white dark:text-neutral-950 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 dark:text-neutral-500">
              Istanbul Digital Nomads
            </p>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold sm:text-4xl">
              Remote life in Istanbul works better when local knowledge moves
              fast.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/72 dark:text-neutral-600">
              Weekly coworking, practical city guides, and a community that
              helps newcomers settle in without wasting their first month.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "Weekly coworking",
                "Neighborhood intelligence",
                "Newcomer-friendly meetups",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/15 px-3 py-2 text-sm text-white/80 dark:border-neutral-300 dark:text-neutral-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button
                  size="lg"
                  className="h-14 w-full rounded-2xl bg-white px-8 text-base font-semibold text-neutral-950 shadow-lg shadow-white/10 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-white dark:shadow-black/20 dark:hover:bg-neutral-800 sm:w-auto"
                >
                  Join on Telegram
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <Link href="/about" className="flex-1 sm:flex-none">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-14 w-full rounded-2xl border border-white/20 px-8 text-base font-medium text-white/90 hover:bg-white/10 hover:text-white dark:border-neutral-300 dark:text-neutral-700 dark:hover:bg-neutral-100 dark:hover:text-neutral-950 sm:w-auto"
                >
                  Learn about the community
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-1">
            <div>
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-950 dark:text-neutral-50"
              >
                {siteConfig.name}
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                Local rhythm, practical guides, and a softer landing for digital
                nomads staying longer in Istanbul.
              </p>
            </div>

            <div className="flex gap-2">
              {socialIcons.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-highlight flex items-center gap-2 rounded-xl border border-black/10 bg-white/60 px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-primary-900/40 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
                  aria-label={label}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ))}
            </div>

            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-3">
              <FooterColumn title="Community" links={footerNav.community} />
              <FooterColumn title="Resources" links={footerNav.resources} />
              <FooterColumn title="Connect" links={footerNav.connect} />
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 py-6 pb-20 md:pb-6 dark:border-white/10">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Built for
            people turning Istanbul into a workable local life.
          </p>
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
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 transition-colors hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-neutral-600 transition-colors hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-300"
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
