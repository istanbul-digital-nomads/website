"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, socialLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 md:hidden">
      <div
        className="fixed inset-0 bg-[rgba(104,27,17,0.22)] backdrop-blur-sm"
        aria-hidden="true"
      />
      <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-xs border-l border-primary-200/60 bg-[rgba(255,247,243,0.96)] p-6 shadow-[0_24px_60px_rgba(104,27,17,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(7,17,29,0.96)]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              Menu
            </span>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-400">
              Istanbul Digital Nomads
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 hover:bg-primary-50 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={onClose}
              className={cn(
                "rounded-xl px-3 py-2.5 text-base font-medium transition-colors hover:bg-primary-50 dark:hover:bg-white/10",
                pathname === item.href
                  ? "bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-primary-300"
                  : "text-neutral-700 dark:text-neutral-300",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <Button className="w-full rounded-full">Join Community</Button>
          </a>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
