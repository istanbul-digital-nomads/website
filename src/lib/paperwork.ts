// Shared paperwork-service helpers - service-type enum, display
// metadata, query helpers. PRODUCT.md §7 surfaces this as
// /paperwork.

import {
  Banknote,
  BadgeCheck,
  FileText,
  Landmark,
  MapPin,
  Receipt,
  Stamp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SERVICE_TYPES = [
  "visa",
  "ikamet",
  "residency_permit",
  "bank_account",
  "notary",
  "gbt",
  "tax_office",
  "other",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export function isServiceType(v: unknown): v is ServiceType {
  return (
    typeof v === "string" && (SERVICE_TYPES as readonly string[]).includes(v)
  );
}

// Per-type Lucide icon for the directory grid + detail header. Falls
// back to FileText for `other`.
export const SERVICE_ICONS: Record<ServiceType, LucideIcon> = {
  visa: Stamp,
  ikamet: BadgeCheck,
  residency_permit: BadgeCheck,
  bank_account: Banknote,
  notary: FileText,
  gbt: MapPin,
  tax_office: Receipt,
  other: Landmark,
};
