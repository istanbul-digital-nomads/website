import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Umbrella,
  Wind,
} from "lucide-react";
import { bcp47, isValidLocale, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { WeatherScene, type WeatherMood } from "./istanbul-today-weather-scene";

interface CurrentWeather {
  time: string;
  temperature_2m: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

interface WeatherApiResponse {
  current?: CurrentWeather;
}

interface MoodProfile {
  mood: WeatherMood;
  Icon: typeof Cloud;
}

const fallbackWeather: CurrentWeather = {
  time: "2026-01-01T12:00:00+03:00",
  temperature_2m: 17,
  precipitation: 0,
  weather_code: 3,
  wind_speed_10m: 14,
};

function getMood(current: CurrentWeather): MoodProfile {
  const code = current.weather_code;
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isStorm = code >= 95;
  const isCloudy = code >= 2 && code <= 48;
  const isWindy = current.wind_speed_10m >= 28;

  if (isStorm) return { mood: "stormy", Icon: CloudRain };
  if (isRain) return { mood: "rainy", Icon: Umbrella };
  if (isWindy) return { mood: "windy", Icon: Wind };
  if (isCloudy) return { mood: "cloudy", Icon: Cloud };
  return { mood: "sunny", Icon: CloudSun };
}

function formatWeatherTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(value));
}

async function fetchCurrentWeather(): Promise<{
  current: CurrentWeather;
  isFallback: boolean;
}> {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=Europe%2FIstanbul&forecast_days=1",
      { next: { revalidate: 600 } },
    );
    if (!response.ok) throw new Error("Weather request failed");
    const payload = (await response.json()) as WeatherApiResponse;
    if (!payload.current) {
      return { current: fallbackWeather, isFallback: true };
    }
    return { current: payload.current, isFallback: false };
  } catch {
    return { current: fallbackWeather, isFallback: true };
  }
}

export async function IstanbulTodayWidget({
  compact = false,
  locale,
}: {
  compact?: boolean;
  locale: Locale;
}) {
  const t = getCachedTranslations(locale, "istanbulToday");
  const { current: weather, isFallback } = await fetchCurrentWeather();
  const profile = getMood(weather);
  const Icon = profile.Icon;

  return (
    <section
      className={cn(
        "border-b border-black/10 bg-[#fbfaf8] dark:border-white/10 dark:bg-[#14110f]",
        compact ? "py-8" : "py-10",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-md border border-black/10 bg-white/65 dark:border-white/10 dark:bg-white/[0.04] lg:grid-cols-[1.06fr_0.94fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[#171310] text-white sm:min-h-[330px]">
            <WeatherScene mood={profile.mood} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,17,15,0.88)_0%,rgba(20,17,15,0.54)_48%,rgba(20,17,15,0.16)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#14110f]/85 via-[#14110f]/28 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary-200">
                    {t("eyebrow")}
                  </p>
                  <h2 className="mt-4 max-w-md font-display text-4xl font-extrabold leading-[1.02] sm:text-h1">
                    {t(`moods.${profile.mood}.verb`)}
                  </h2>
                </div>
                <div className="rounded-md border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <Icon className="h-6 w-6 text-primary-100" />
                </div>
              </div>

              <div className="mt-20 grid gap-3 sm:mt-10 sm:grid-cols-3">
                <WeatherStat
                  label={t("stats.temp")}
                  value={`${Math.round(weather.temperature_2m)}°C`}
                />
                <WeatherStat
                  label={t("stats.rain")}
                  value={`${weather.precipitation.toFixed(1)} mm`}
                />
                <WeatherStat
                  label={t("stats.wind")}
                  value={`${Math.round(weather.wind_speed_10m)} km/h`}
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-200">
                  {t(`moods.${profile.mood}.label`)}
                </p>
                <p className="mt-1 text-sm text-[#5d6d7e] dark:text-[#b7aaa0]">
                  {t("updated", {
                    time: formatWeatherTime(weather.time, bcp47[locale]),
                  })}
                  {isFallback ? t("fallbackSuffix") : ""}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-md bg-[#f6f1ea] px-3 py-1.5 text-xs font-medium text-neutral-800 dark:bg-white/10 dark:text-[#f2f3f4]">
                <Droplets className="h-3.5 w-3.5 text-primary-600 dark:text-primary-200" />
                {t("liveSky")}
              </span>
            </div>

            <p className="mt-5 text-body-lg leading-8 text-neutral-800 dark:text-[#d8d0c8]">
              {t(`moods.${profile.mood}.note`)}
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <MiniCue
                label={t("bestMove")}
                value={t(`moods.${profile.mood}.cta`)}
              />
              <MiniCue
                label={t("nomadHint")}
                value={
                  profile.mood === "rainy" || profile.mood === "stormy"
                    ? t("hints.backupCafe")
                    : t("hints.ferry")
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WeatherStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/18 bg-[#1b1714]/45 px-3 py-2 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-md">
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/55">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-extrabold">{value}</p>
    </div>
  );
}

function MiniCue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 bg-[#f6f1ea]/70 p-4 dark:border-white/10 dark:bg-white/[0.06]">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-600 dark:text-[#bdb1a6]">
        {label}
      </p>
      <p className="mt-2 font-semibold text-neutral-950 dark:text-[#f2f3f4]">
        {value}
      </p>
    </div>
  );
}
