import type { ComponentPropsWithoutRef } from "react";

type Props<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

export const mdxComponents = {
  h2: ({ children, ...props }: Props<"h2">) => (
    <h2
      className="mb-4 mt-10 text-2xl font-bold text-[#2a2018] dark:text-[#f7f2ea]"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: Props<"h3">) => (
    <h3
      className="mb-3 mt-8 text-xl font-semibold text-[#2a2018] dark:text-[#f7f2ea]"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: Props<"h4">) => (
    <h4
      className="mb-2 mt-6 text-lg font-semibold text-[#2a2018] dark:text-[#f7f2ea]"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: Props<"p">) => (
    <p
      className="mb-4 text-base leading-7 text-[#5a4f43] dark:text-[#d4c4b4]"
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
      className="mb-4 ml-6 list-disc space-y-2 text-[#5a4f43] marker:text-primary-400 dark:text-[#d4c4b4]"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: Props<"ol">) => (
    <ol
      className="mb-4 ml-6 list-decimal space-y-2 text-[#5a4f43] marker:text-primary-400 dark:text-[#d4c4b4]"
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
      className="font-semibold text-[#2a2018] dark:text-[#f7f2ea]"
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
    <div className="my-6 overflow-x-auto rounded-xl border border-primary-200/40 dark:border-[rgba(200,100,60,0.12)]">
      <table className="w-full text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: Props<"thead">) => (
    <thead
      className="border-b border-primary-200/40 bg-primary-50/60 text-xs uppercase tracking-wider text-primary-800 dark:border-[rgba(200,100,60,0.12)] dark:bg-primary-950/20 dark:text-primary-200"
      {...props}
    >
      {children}
    </thead>
  ),
  th: ({ children, ...props }: Props<"th">) => (
    <th className="px-4 py-3 font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: Props<"td">) => (
    <td
      className="border-b border-primary-100/30 px-4 py-3 text-[#5a4f43] dark:border-[rgba(200,100,60,0.06)] dark:text-[#d4c4b4]"
      {...props}
    >
      {children}
    </td>
  ),
  hr: (props: Props<"hr">) => (
    <hr
      className="my-8 border-primary-200/30 dark:border-[rgba(200,100,60,0.1)]"
      {...props}
    />
  ),
  code: ({ children, ...props }: Props<"code">) => (
    <code
      className="rounded bg-primary-50 px-1.5 py-0.5 text-sm text-primary-800 dark:bg-primary-950/30 dark:text-primary-200"
      {...props}
    >
      {children}
    </code>
  ),
};
