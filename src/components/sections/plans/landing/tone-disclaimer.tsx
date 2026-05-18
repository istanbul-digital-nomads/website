import { getTranslations } from "next-intl/server";

export async function PlansToneDisclaimer() {
  const t = await getTranslations("plans.tone");

  return (
    <section className="relative overflow-hidden bg-deep-water font-grotesk text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(600px 320px at 50% 50%, rgba(232,122,93,0.08), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1320px] px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/55">
            ↳ {t("kicker")}
          </p>
          <p
            className="mt-6 font-editorial text-cream"
            style={{
              fontSize: "clamp(1.875rem, 4vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              fontWeight: 400,
            }}
          >
            {t("line1")}{" "}
            <span className="italic text-gold">{t("line2")}</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed text-cream/70">
            {t("body")}
          </p>
        </div>
      </div>
    </section>
  );
}
