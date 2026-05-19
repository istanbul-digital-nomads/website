import { getTranslations } from "next-intl/server";

export async function PlansHowItWorks() {
  const t = await getTranslations("plans.howItWorks");
  const steps = ["share", "join", "show"] as const;

  return (
    <section className="relative overflow-hidden bg-deep-water font-grotesk text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #0a1a2f, #06101f 70%, #06101f)",
        }}
      />
      <div className="relative mx-auto max-w-[1320px] px-6 py-20 md:px-10 md:py-28">
        <div className="flex items-center gap-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/65">
          <span>N° 07</span>
          <span
            className="h-px w-7"
            style={{ background: "rgba(244,184,96,0.55)" }}
          />
          <span>{t("eyebrow")}</span>
        </div>
        <h2
          className="mt-5 max-w-3xl font-editorial text-cream"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.04,
            fontWeight: 400,
          }}
        >
          {t("title")}
        </h2>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step}
              className="rounded-2xl border bg-deep-water/40 p-6 backdrop-blur-sm md:p-8"
              style={{ borderColor: "rgba(244,184,96,0.18)" }}
            >
              <span
                className="font-editorial italic leading-none text-gold"
                style={{ fontSize: "3.25rem" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="mt-6 font-editorial text-cream"
                style={{
                  fontSize: "1.625rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                  fontWeight: 400,
                }}
              >
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">
                {t(`steps.${step}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
