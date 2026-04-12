import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Reveal } from "./reveal";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  container?: boolean;
}

function Section({
  className,
  container = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)} {...props}>
      {container ? (
        <Container>
          <Reveal>{children}</Reveal>
        </Container>
      ) : (
        <Reveal>{children}</Reveal>
      )}
    </section>
  );
}

function SectionHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto mb-12 max-w-2xl text-center", className)}
      {...props}
    />
  );
}

function SectionTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-3xl font-bold tracking-tight sm:text-4xl", className)}
      {...props}
    />
  );
}

function SectionDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-4 text-lg text-neutral-600 dark:text-[#b8a898]",
        className,
      )}
      {...props}
    />
  );
}

export { Section, SectionHeader, SectionTitle, SectionDescription };
