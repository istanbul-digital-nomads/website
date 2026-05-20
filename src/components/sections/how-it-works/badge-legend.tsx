import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { MEMBER_ROLES, ROLE_TONE } from "@/lib/member-roles";
import { VERIFICATION_LEVELS, VERIFICATION_TONE } from "@/lib/verification";
import { CURRENT_STATUS_OPTIONS, STATUS_TONE } from "@/lib/member-profile";

// Collapsible "what do the badges mean?" legend for /members. Renders
// real badge samples next to one-line meanings so the directory's
// chips + pips are self-documenting. A <details> disclosure keeps it
// out of the way until tapped.

export function BadgeLegend({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "howItWorks.legend");
  const tRoles = getCachedTranslations(
    locale,
    "onboardingPage.steps.interests.memberTypeOptions",
  );
  const tStatus = getCachedTranslations(
    locale,
    "onboardingPage.steps.interests.currentStatusOptions",
  );
  const tVerifyLevels = getCachedTranslations(locale, "verification.levels");
  const tVerifyTips = getCachedTranslations(locale, "verification.tooltips");

  return (
    <details className="mt-8 rounded-xl border border-cream/12 bg-ink-1/40 [&_summary]:cursor-pointer">
      <summary className="flex items-center justify-between px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70">
        {t("title")}
        <span className="text-cream/40" aria-hidden>
          ＋
        </span>
      </summary>

      <div className="space-y-7 border-t border-cream/10 px-5 py-6">
        {/* Roles */}
        <LegendGroup title={t("rolesTitle")}>
          {MEMBER_ROLES.map((r) => (
            <LegendRow
              key={r}
              sample={
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${ROLE_TONE[r].bg} ${ROLE_TONE[r].text}`}
                >
                  {tRoles(r)}
                </span>
              }
              meaning={t(`roles.${r}`)}
            />
          ))}
          <LegendRow
            sample={
              <span className="inline-flex items-center rounded-full bg-moss/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-moss">
                {t("agentLabel")}
              </span>
            }
            meaning={t("agentMeaning")}
          />
        </LegendGroup>

        {/* Verification */}
        <LegendGroup title={t("verifyTitle")}>
          {VERIFICATION_LEVELS.map((lvl) => (
            <LegendRow
              key={lvl}
              sample={
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${VERIFICATION_TONE[lvl].bg} ${VERIFICATION_TONE[lvl].text} ${VERIFICATION_TONE[lvl].ring}`}
                >
                  <span aria-hidden>{VERIFICATION_TONE[lvl].symbol}</span>
                  {tVerifyLevels(lvl)}
                </span>
              }
              meaning={tVerifyTips(lvl)}
            />
          ))}
        </LegendGroup>

        {/* Status pips */}
        <LegendGroup title={t("statusTitle")}>
          {CURRENT_STATUS_OPTIONS.map((s) => (
            <LegendRow
              key={s}
              sample={
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_TONE[s].bg} ${STATUS_TONE[s].text}`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_TONE[s].dotColor}`}
                    aria-hidden
                  />
                  {tStatus(s)}
                </span>
              }
              meaning={t(`status.${s}`)}
            />
          ))}
        </LegendGroup>
      </div>
    </details>
  );
}

function LegendGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/55">
        {title}
      </h3>
      <dl className="mt-3 space-y-2.5">{children}</dl>
    </div>
  );
}

function LegendRow({
  sample,
  meaning,
}: {
  sample: React.ReactNode;
  meaning: string;
}) {
  return (
    <div className="grid grid-cols-[150px_1fr] items-start gap-3">
      <dt className="flex">{sample}</dt>
      <dd className="text-[13px] leading-snug text-cream/65">{meaning}</dd>
    </div>
  );
}
