"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { X, Github, Send, Twitter, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, socialLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

interface MobileMenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

const themes = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
  { value: "system" as const, label: "Auto" },
];

const socialIcons = [
  { href: socialLinks.telegram, icon: Send, label: "Telegram" },
  { href: socialLinks.github, icon: Github, label: "GitHub" },
  { href: socialLinks.twitter, icon: Twitter, label: "Twitter" },
  { href: `mailto:${socialLinks.email}`, icon: Mail, label: "Email" },
];

export function MobileMenuOverlay({ open, onClose }: MobileMenuOverlayProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[60] md:hidden">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        aria-hidden="true"
      />
      <DialogPanel className="fixed inset-0 flex flex-col bg-[rgba(255,247,243,0.98)] backdrop-blur-xl transition-transform duration-300 data-[closed]:translate-y-full dark:bg-[rgba(21,16,16,0.98)]">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6"
          style={{
            paddingTop: "max(1rem, env(safe-area-inset-top, 0px))",
          }}
        >
          <div>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              Menu
            </span>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.26em] text-neutral-500 dark:text-[#8a7a6a]">
              Istanbul Digital Nomads
            </p>
          </div>
          <button
            onClick={onClose}
            className="tap-highlight rounded-full border border-black/10 p-2.5 text-neutral-500 hover:bg-primary-50 dark:border-white/10 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 overflow-y-auto px-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={onClose}
                className={cn(
                  "tap-highlight flex items-center rounded-2xl px-4 py-3 text-lg font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-primary-300"
                    : "text-neutral-700 hover:bg-black/5 dark:text-[#b8a898] dark:hover:bg-white/5",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign In */}
          <Link
            href="/login"
            prefetch
            onClick={onClose}
            className="tap-highlight mt-2 flex items-center gap-3 rounded-2xl bg-primary-50 px-4 py-3 text-lg font-medium text-primary-700 transition-colors dark:bg-white/10 dark:text-primary-300"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Sign In
          </Link>

          {/* Theme toggle */}
          <div className="mt-6">
            <p className="px-4 font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 dark:text-[#8a7a6a]">
              Appearance
            </p>
            <div className="mt-3 flex gap-1 rounded-full border border-black/10 bg-white/60 p-1 dark:border-white/10 dark:bg-white/5">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "tap-highlight flex-1 rounded-full py-2.5 text-sm font-medium transition-colors",
                    theme === t.value
                      ? "bg-primary-600 text-white shadow-sm dark:bg-primary-500"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-[#8a7a6a] dark:hover:text-[#d4c4b4]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="mt-6">
            <p className="px-4 font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 dark:text-[#8a7a6a]">
              Connect
            </p>
            <div className="mt-3 flex gap-3 px-4">
              {socialIcons.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-highlight rounded-full border border-black/10 p-3 text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 dark:border-white/10 dark:text-[#b8a898] dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom CTA */}
        <div
          className="px-6 pb-4"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <Button className="w-full rounded-full" size="lg">
              Join on Telegram
            </Button>
          </a>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
