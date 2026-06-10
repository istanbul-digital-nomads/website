import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

// Shared chrome for the legal pages (privacy / terms / cookies). Editorial
// register that matches the rest of the site: eyebrow, serif title, an
// effective-date line, then prose. Content is authored in English; the
// surrounding header/footer localize via the marketing layout.
export function LegalDoc({
  eyebrow,
  title,
  effectiveDate,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper-faint">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl text-paper md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-[13px] text-paper-mute">{effectiveDate}</p>
        <p className="mt-6 text-[15px] leading-relaxed text-paper-dim">
          {intro}
        </p>
        <div className="mt-10 space-y-9">{children}</div>
      </div>
    </Container>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-lg text-paper">{heading}</h2>
      <div className="mt-3 space-y-3 text-[14.5px] leading-relaxed text-paper-dim">
        {children}
      </div>
    </section>
  );
}
