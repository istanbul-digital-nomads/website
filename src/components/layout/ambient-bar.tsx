import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import {
  getFerryStatus,
  getFxRate,
  getIstanbulTime,
  getMemberCount,
  getTimeOfDay,
  getWeather,
} from "@/lib/ambient";

/**
 * Design System v2 - the AmbientBar. A thin (38px) monospace strip across
 * the top of every page carrying the city's living signals: local time,
 * weather + time-of-day, the next ferry, the USD/TRY rate, and the member
 * count. Server-rendered; every data source is `use cache` with a static
 * fallback, so the bar never blocks or breaks a page render.
 *
 * "Made in Kadıköy" - the chrome itself reads like a film-camera timestamp.
 */
export async function AmbientBar({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "ambient");

  const [time, weather, ferry, fx, members, tod] = await Promise.all([
    getIstanbulTime(),
    getWeather(),
    getFerryStatus(),
    getFxRate(),
    getMemberCount(),
    getTimeOfDay(),
  ]);

  return (
    <div className="flex items-stretch overflow-x-auto border-b border-ink-3 bg-ink-0 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
      <Cell className="border-e border-ink-3">
        <Dot live />
        <span className="text-paper">{t("liveFrom")}</span>
      </Cell>

      <Cell className="border-e border-ink-3">
        <span className="text-paper tabular-nums" dir="ltr">
          {time}
        </span>
        <span className="text-paper-faint" dir="ltr">
          UTC+3
        </span>
      </Cell>

      <Cell className="border-e border-ink-3">
        <span className="text-paper tabular-nums" dir="ltr">
          {weather.temp}°
        </span>
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-tod"
          style={{ boxShadow: "0 0 8px rgb(var(--tod-accent))" }}
        />
        <span className="text-tod">{t(`tod.${tod}`)}</span>
      </Cell>

      <Cell className="hidden border-e border-ink-3 sm:flex">
        <span className="text-paper-faint">{t("ferry")}</span>
        <span className="text-paper" dir="ltr">
          {ferry.route}
        </span>
        {ferry.running ? (
          <span className="text-ferry-yellow" dir="ltr">
            ↗ {ferry.next}
          </span>
        ) : (
          <span className="text-paper-faint" dir="ltr">
            {ferry.next}
          </span>
        )}
      </Cell>

      <Cell className="hidden border-e border-ink-3 sm:flex">
        <span className="text-paper-faint" dir="ltr">
          1 USD
        </span>
        <span className="text-paper tabular-nums" dir="ltr">
          ₺{fx.usdTry}
        </span>
      </Cell>

      <div className="flex-1" />

      {members !== null ? (
        <Cell className="border-s border-ink-3">
          <Dot live />
          {/* Data numerals stay Western/LTR even in RTL locales, matching
              the time and FX cells (design rule). */}
          <span className="text-paper tabular-nums" dir="ltr">
            {members.toLocaleString("en-US")}
          </span>
          <span className="text-paper-faint">{t("members")}</span>
        </Cell>
      ) : null}
    </div>
  );
}

function Cell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-2.5 px-4 py-2.5 ${className}`}
    >
      {children}
    </div>
  );
}

function Dot({ live = false }: { live?: boolean }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-[#7ab880]"
      style={live ? { boxShadow: "0 0 8px #7ab880" } : undefined}
    />
  );
}
