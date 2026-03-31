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
    <footer className="border-t border-black/5 bg-[rgba(245,239,228,0.72)] dark:border-white/10 dark:bg-[#07111d]">
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

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full rounded-full bg-white px-6 text-neutral-950 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800 sm:w-auto"
                >
                  Join the Telegram
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <Link
                href="/guides"
                className="text-sm font-medium text-white/80 transition-colors hover:text-white dark:text-neutral-600 dark:hover:text-neutral-950"
              >
                Start with the city guides
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

            <div className="flex gap-3">
              {socialIcons.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-black/10 p-2 text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
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
