import Link from "next/link";
import { getCountryByCode } from "@/lib/path-to-istanbul";
import { cn } from "@/lib/utils";

interface FlagBadgeProps {
  code: string;
  linkToCountryPage?: boolean;
  className?: string;
}

export function FlagBadge({
  code,
  linkToCountryPage = false,
  className,
}: FlagBadgeProps) {
  const country = getCountryByCode(code);
  if (!country) return null;

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-primary-200/60 dark:bg-primary-950/30 dark:text-primary-300 dark:ring-primary-900/40",
        className,
      )}
    >
      <span aria-hidden="true">{country.flag}</span>
      <span>{country.name}</span>
    </span>
  );

  if (linkToCountryPage && country.supported) {
    return (
      <Link
        href={`/path-to-istanbul/${country.slug}`}
        className="transition-opacity hover:opacity-80"
      >
        {content}
      </Link>
    );
  }

  return content;
}
