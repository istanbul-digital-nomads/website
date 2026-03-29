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
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
      <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-lg dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">Menu</span>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
              onClick={onClose}
              className={cn(
                "rounded-md px-3 py-2.5 text-base font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                pathname === item.href
                  ? "text-primary-600 dark:text-primary-400"
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
            <Button className="w-full">Join Community</Button>
          </a>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
