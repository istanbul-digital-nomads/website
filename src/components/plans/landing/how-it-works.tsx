import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

export async function PlansHowItWorks() {
  const t = await getTranslations("plans.howItWorks");
  const steps = ["share", "join", "show"] as const;

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-20 lg:py-28">
      <Container>
        <div className="flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          <span className="text-terracotta">N° 07</span>
          <span className="h-px w-7 bg-terracotta" />
          <span>{t("eyebrow")}</span>
        </div>
        <h2 className="mt-6 max-w-2xl font-display text-display-lg leading-tight text-paper">
          {t("title")}
        </h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step} className="border border-ink-3 bg-ink-2 p-6 lg:p-8">
              <span className="font-mono text-4xl leading-none text-terracotta">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-h3 text-paper">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                {t(`steps.${step}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
