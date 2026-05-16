import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

export async function PlansToneDisclaimer() {
  const t = await getTranslations("plans.tone");

  return (
    <section className="border-b border-ink-3 bg-ink-2 py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
            ↳ {t("kicker")}
          </p>
          <p className="mt-6 font-display text-h2 leading-tight text-paper">
            {t("line1")}{" "}
            <span className="italic text-terracotta">{t("line2")}</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed text-paper-dim">
            {t("body")}
          </p>
        </div>
      </Container>
    </section>
  );
}
