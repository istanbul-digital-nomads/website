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
          <div className="rounded-[2rem] border border-primary-700/20 bg-gradient-to-br from-primary-800 to-primary-950 px-6 py-8 text-white dark:border-primary-800/30 dark:from-primary-900 dark:to-[#231a14] sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 dark:text-[#b8a898]">
              Istanbul Digital Nomads
            </p>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold sm:text-4xl">
              The easiest way to settle into Istanbul as a remote worker.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/72 dark:text-white/65">
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
                  className="rounded-full border border-white/15 px-3 py-2 text-sm text-white/80 dark:border-white/15 dark:text-white/70"
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
                  className="h-14 w-full rounded-2xl bg-white px-8 text-base font-semibold text-[#1c1614] shadow-lg shadow-white/10 hover:bg-primary-50 dark:bg-[#f7f2ea] dark:text-[#1c1614] dark:shadow-black/20 dark:hover:bg-[#e8dfd3] sm:w-auto"
                >
                  Join on Telegram
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <Link href="/about" className="flex-1 sm:flex-none">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-14 w-full rounded-2xl border border-white/20 px-8 text-base font-medium text-white/90 hover:bg-white/10 hover:text-white dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white sm:w-auto"
                >
                  About the community
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-1">
            <div>
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-800 dark:text-primary-200"
              >
                {siteConfig.name}
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-7 text-[#6b6257] dark:text-[#b8a898]">
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
                  className="tap-highlight flex items-center gap-2 rounded-xl border border-primary-200/30 bg-white/60 px-3.5 py-2.5 text-sm font-medium text-primary-800 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-[rgba(200,100,60,0.15)] dark:bg-[rgba(28,22,20,0.5)] dark:text-[#d4c4b4] dark:hover:border-primary-700/40 dark:hover:bg-primary-950/30 dark:hover:text-primary-300"
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
            &copy; {new Date().getFullYear()} {siteConfig.name}. Made by remote
            workers, for remote workers in Istanbul.
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
      <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-200">
        {title}
      </h3>
      <ul className="mt-3 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#6b6257] transition-colors hover:text-primary-600 dark:text-[#b8a898] dark:hover:text-primary-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-[#6b6257] transition-colors hover:text-primary-600 dark:text-[#b8a898] dark:hover:text-primary-300"
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
