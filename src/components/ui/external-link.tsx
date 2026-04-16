import type { AnchorHTMLAttributes, ReactNode } from "react";
import { recommendedRel, type LinkCategory, relForCategory } from "@/lib/external-links";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "rel"> & {
  href: string;
  children: ReactNode;
  /**
   * Override the auto-detected category. Use when the URL belongs to a
   * domain registered with a different default but THIS specific link is
   * sponsored / ugc / etc.
   */
  category?: LinkCategory;
  /**
   * Override the auto-resolved rel entirely. Last resort - prefer
   * `category` so the policy stays centralized.
   */
  rel?: string;
};

/**
 * Use for ALL inline TSX external links (not MDX - MDX handles this
 * automatically via mdx-components.tsx). Auto-applies target="_blank" and
 * the policy-correct rel based on the domain registry.
 *
 * Example:
 *   <ExternalLink href="https://goc.gov.tr">Migration authority</ExternalLink>
 *   <ExternalLink href="https://partner.example" category="sponsored">Get 20% off</ExternalLink>
 */
export function ExternalLink({
  href,
  children,
  category,
  rel,
  target = "_blank",
  ...rest
}: Props) {
  const resolvedRel =
    rel ?? (category ? relForCategory(category) : recommendedRel(href));

  return (
    <a href={href} target={target} rel={resolvedRel} {...rest}>
      {children}
    </a>
  );
}
