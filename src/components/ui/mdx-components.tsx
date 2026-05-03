import type { ComponentPropsWithoutRef, ReactNode } from "react";
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

export const mdxComponents = {
  h2: ({ children, id, ...props }: Props<"h2">) => (
    <h2
      id={id ?? slugify(children)}
      className="mb-4 mt-10 scroll-mt-24 text-2xl font-bold text-[#1a1a2e] dark:text-[#f2f3f4]"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: Props<"h3">) => (
    <h3
      className="mb-3 mt-8 text-xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: Props<"h4">) => (
    <h4
      className="mb-2 mt-6 text-lg font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: Props<"p">) => (
    <p
      className="mb-4 text-base leading-7 text-[#526e89] dark:text-[#99a3ad]"
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ children, href, ...props }: Props<"a">) => (
    <a
      href={href}
      className="font-medium text-primary-600 underline decoration-primary-300 underline-offset-2 transition-colors hover:text-primary-800 dark:text-primary-400 dark:decoration-primary-700 dark:hover:text-primary-300"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }: Props<"ul">) => (
    <ul
      className="mb-4 ml-6 list-disc space-y-2 text-[#526e89] marker:text-primary-400 dark:text-[#99a3ad]"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: Props<"ol">) => (
    <ol
      className="mb-4 ml-6 list-decimal space-y-2 text-[#526e89] marker:text-primary-400 dark:text-[#99a3ad]"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: Props<"li">) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: Props<"strong">) => (
    <strong
      className="font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]"
      {...props}
    >
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }: Props<"blockquote">) => (
    <blockquote
      className="my-6 rounded-xl border-l-4 border-primary-400 bg-primary-50/50 py-4 pl-6 pr-4 dark:border-primary-700 dark:bg-primary-950/20"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: Props<"table">) => (
    <div className="my-6 overflow-x-auto rounded-md border border-black/10 bg-white/45 dark:border-white/10 dark:bg-white/5">
      <table className="min-w-full text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: Props<"thead">) => (
    <thead
      className="border-b border-black/10 bg-[#f6f1ea] text-xs uppercase text-neutral-700 dark:border-white/10 dark:bg-[#1a1612] dark:text-[#d5dce3]"
      {...props}
    >
      {children}
    </thead>
  ),
  th: ({ children, ...props }: Props<"th">) => (
    <th className="whitespace-nowrap px-4 py-3 font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: Props<"td">) => (
    <td
      className="border-b border-black/5 px-4 py-3 align-top text-[#526e89] last:border-b-0 dark:border-white/5 dark:text-[#99a3ad]"
      {...props}
    >
      {children}
    </td>
  ),
  hr: (props: Props<"hr">) => (
    <hr className="my-8 border-[#e5e8eb]/40 dark:border-[#2c2f3a]" {...props} />
  ),
  code: ({ children, ...props }: Props<"code">) => (
    <code
      className="rounded bg-primary-50 px-1.5 py-0.5 text-sm text-primary-800 dark:bg-primary-950/30 dark:text-primary-200"
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
        <span className="relative block aspect-[3/2] w-full overflow-hidden rounded-2xl bg-primary-50/40 dark:bg-primary-950/20">
          <Image
            src={src}
            alt={plainAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </span>
        {caption && (
          <span className="mt-2 block text-right font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-[#5d6d7e]">
            {caption}
          </span>
        )}
      </span>
    );
  },
};
