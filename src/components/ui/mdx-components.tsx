import type { ComponentPropsWithoutRef, JSX, ReactNode } from "react";
import Image from "next/image";

type Props<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

function slugify(children: ReactNode): string {
  const text = typeof children === "string" ? children : String(children ?? "");
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Long-form MDX renderer shared by guides, blog, neighborhoods,
// path-to-istanbul, and help. Everything here uses the cinematic design
// tokens (paper / ink / gold / terracotta) so the body matches the rest of
// the site instead of the old slate+red v1 palette. Headings inherit the
// Fraunces serif from the global h1-h6 rule, so they stay at the editorial
// 400-500 weight rather than `font-bold`.
export const mdxComponents = {
  h2: ({ children, id, ...props }: Props<"h2">) => (
    <h2
      id={id ?? slugify(children)}
      className="mb-4 mt-12 scroll-mt-24 font-display text-[1.7rem] leading-tight text-paper"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: Props<"h3">) => (
    <h3 className="mb-3 mt-9 font-display text-xl text-paper" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: Props<"h4">) => (
    <h4 className="mb-2 mt-7 font-display text-lg text-paper" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: Props<"p">) => (
    <p className="mb-5 text-[16px] leading-[1.8] text-paper-dim" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }: Props<"a">) => (
    <a
      href={href}
      className="font-medium text-gold-ink underline decoration-gold-ink/30 underline-offset-2 transition-colors hover:decoration-gold-ink"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }: Props<"ul">) => (
    <ul
      className="mb-5 ms-5 list-disc space-y-2 text-paper-dim marker:text-gold/70"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: Props<"ol">) => (
    <ol
      className="mb-5 ms-5 list-decimal space-y-2 text-paper-dim marker:text-gold/70"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: Props<"li">) => (
    <li className="leading-[1.8] ps-1" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: Props<"strong">) => (
    <strong className="font-semibold text-paper" {...props}>
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }: Props<"blockquote">) => (
    <blockquote
      className="my-7 rounded-xl border-s-2 border-gold/60 bg-ink-2/40 py-4 pe-4 ps-6 text-paper-dim [&>p]:mb-0"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: Props<"table">) => (
    <div className="my-7 overflow-x-auto rounded-xl border border-ink-3 bg-ink-2/40">
      <table className="min-w-full text-start text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: Props<"thead">) => (
    <thead
      className="border-b border-ink-3 bg-ink-2/60 text-[11px] uppercase tracking-wider text-paper-mute"
      {...props}
    >
      {children}
    </thead>
  ),
  th: ({ children, ...props }: Props<"th">) => (
    // Wrap content in <bdi> so Latin runs like "20 GB" don't get
    // bidi-flipped to "GB 20" inside RTL tables, while keeping the cell
    // text-align: start (= right in RTL) so the whole table stays
    // visually right-aligned for fa/ar readers.
    <th
      className="whitespace-nowrap px-4 py-3 text-start font-semibold text-paper"
      {...props}
    >
      <bdi>{children}</bdi>
    </th>
  ),
  td: ({ children, ...props }: Props<"td">) => (
    <td
      className="border-b border-ink-3/60 px-4 py-3 align-top text-paper-dim last:border-b-0"
      {...props}
    >
      <bdi>{children}</bdi>
    </td>
  ),
  hr: (props: Props<"hr">) => <hr className="my-10 border-ink-3" {...props} />,
  code: ({ children, ...props }: Props<"code">) => (
    <code
      className="rounded bg-ink-2 px-1.5 py-0.5 font-mono text-[0.85em] text-gold-ink"
      {...props}
    >
      {children}
    </code>
  ),
  // Alt text may include a caption after " | " for attribution.
  // Example: ![Ferry docking at Kadikoy | Photo: Contributor / Wikimedia Commons (CC-BY-SA)](/images/...)
  // Note: markdown wraps `![]()` in <p>. We avoid nested block elements
  // (figure/div/figcaption) to prevent hydration errors - use spans only.
  img: ({ src, alt }: Props<"img">) => {
    if (!src || typeof src !== "string") return null;
    const [plainAlt, ...captionParts] = (alt ?? "").split(" | ");
    const caption = captionParts.join(" | ").trim();
    return (
      <span className="my-8 block">
        <span className="relative block aspect-[3/2] w-full overflow-hidden rounded-2xl bg-ink-2/40">
          <Image
            src={src}
            alt={plainAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </span>
        {caption && (
          <span className="mt-2 block text-end font-mono text-[10px] uppercase tracking-[0.2em] text-paper-faint">
            {caption}
          </span>
        )}
      </span>
    );
  },
};
