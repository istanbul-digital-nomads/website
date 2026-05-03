"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Umbrella,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WeatherMood = "sunny" | "cloudy" | "rainy" | "stormy" | "windy";

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
  label: string;
  verb: string;
  note: string;
  cta: string;
  Icon: typeof Cloud;
}

const fallbackWeather: CurrentWeather = {
  time: "2026-01-01T12:00:00+03:00",
  temperature_2m: 17,
  precipitation: 0,
  weather_code: 3,
  wind_speed_10m: 14,
};

const rainDrops = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: `${(index % 9) * -0.18}s`,
  duration: `${0.72 + (index % 5) * 0.08}s`,
  height: `${18 + (index % 4) * 8}px`,
}));

const sparkleDots = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 53) % 100}%`,
  top: `${12 + ((index * 31) % 68)}%`,
  delay: `${(index % 7) * -0.26}s`,
}));

const windLines = Array.from({ length: 9 }, (_, index) => ({
  id: index,
  top: `${18 + index * 8}%`,
  delay: `${index * -0.25}s`,
  width: `${72 + (index % 3) * 42}px`,
}));

const rainSplashes = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${6 + ((index * 23) % 88)}%`,
  delay: `${index * -0.2}s`,
}));

function getMood(current: CurrentWeather): MoodProfile {
  const code = current.weather_code;
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isStorm = code >= 95;
  const isCloudy = code >= 2 && code <= 48;
  const isWindy = current.wind_speed_10m >= 28;

  if (isStorm) {
    return {
      mood: "stormy",
      label: "Storm watch",
      verb: "Bring the serious umbrella.",
      note: "Great cafe day. Pick somewhere with backup seating and stay close to metro.",
      cta: "Cafe-first plan",
      Icon: CloudRain,
    };
  }

  if (isRain) {
    return {
      mood: "rainy",
      label: "Rainy Istanbul",
      verb: "The city is in ferry-window mode.",
      note: "Kadikoy, Karakoy, and Galata still work. Just choose shorter walks and covered tables.",
      cta: "Rain-safe route",
      Icon: Umbrella,
    };
  }

  if (isWindy) {
    return {
      mood: "windy",
      label: "Bosphorus wind",
      verb: "Ferry views, jacket required.",
      note: "Good day for a shorter crossing, then a stable indoor work block.",
      cta: "Wind-aware plan",
      Icon: Wind,
    };
  }

  if (isCloudy) {
    return {
      mood: "cloudy",
      label: "Soft gray city",
      verb: "Long walks, low glare, good focus.",
      note: "A strong day for neighborhood scouting before the evening tables fill up.",
      cta: "Scout a base",
      Icon: Cloud,
    };
  }

  return {
    mood: "sunny",
    label: "Bright Bosphorus",
    verb: "Do the outside part first.",
    note: "Walk the water, take the ferry, then cool down at a laptop-friendly cafe.",
    cta: "Sunny day loop",
    Icon: CloudSun,
  };
}

function formatWeatherTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date(value));
}

export function IstanbulTodayWidget({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=Europe%2FIstanbul&forecast_days=1",
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Weather request failed");

        const payload = (await response.json()) as WeatherApiResponse;
        setCurrent(payload.current ?? fallbackWeather);
        setIsFallback(!payload.current);
      } catch (error) {
        if (controller.signal.aborted) return;
        setCurrent(fallbackWeather);
        setIsFallback(true);
      }
    }

    loadWeather();

    return () => controller.abort();
  }, []);

  const weather = current ?? fallbackWeather;
  const profile = useMemo(() => getMood(weather), [weather]);
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
                    Istanbul today
                  </p>
                  <h2 className="mt-4 max-w-md font-display text-4xl font-extrabold leading-[1.02] sm:text-h1">
                    {profile.verb}
                  </h2>
                </div>
                <div className="rounded-md border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <Icon className="h-6 w-6 text-primary-100" />
                </div>
              </div>

              <div className="mt-20 grid gap-3 sm:mt-10 sm:grid-cols-3">
                <WeatherStat
                  label="Temp"
                  value={`${Math.round(weather.temperature_2m)}°C`}
                />
                <WeatherStat
                  label="Rain"
                  value={`${weather.precipitation.toFixed(1)} mm`}
                />
                <WeatherStat
                  label="Wind"
                  value={`${Math.round(weather.wind_speed_10m)} km/h`}
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-300">
                  {profile.label}
                </p>
                <p className="mt-1 text-sm text-[#5d6d7e] dark:text-[#b7aaa0]">
                  Updated {formatWeatherTime(weather.time)}
                  {isFallback ? " with fallback mood" : ""}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-md bg-[#f6f1ea] px-3 py-1.5 text-xs font-medium text-neutral-800 dark:bg-white/10 dark:text-[#f2f3f4]">
                <Droplets className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" />
                Live sky
              </span>
            </div>

            <p className="mt-5 text-body-lg leading-8 text-neutral-800 dark:text-[#d8d0c8]">
              {profile.note}
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <MiniCue label="Best move" value={profile.cta} />
              <MiniCue
                label="Nomad hint"
                value={
                  profile.mood === "rainy" || profile.mood === "stormy"
                    ? "Save one backup cafe"
                    : "Leave room for a ferry"
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
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
        {label}
      </p>
      <p className="mt-2 font-semibold text-neutral-950 dark:text-[#f2f3f4]">
        {value}
      </p>
    </div>
  );
}

function WeatherScene({ mood }: { mood: WeatherMood }) {
  const rainy = mood === "rainy" || mood === "stormy";
  const sunny = mood === "sunny";
  const windy = mood === "windy";
  const cloudy = mood === "cloudy" || mood === "windy";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#171310]">
      <Image
        src="/images/weather/istanbul-rainy-bosphorus-2026.png"
        alt=""
        fill
        priority={false}
        sizes="(max-width: 1024px) 100vw, 680px"
        className="object-cover object-[56%_50%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.86)_0%,rgba(10,9,8,0.5)_43%,rgba(10,9,8,0.1)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#14110f]/78 via-[#14110f]/24 to-transparent" />
      <div
        className={cn(
          "absolute inset-0 mix-blend-soft-light",
          sunny && "bg-[#f4a35d]/35",
          rainy && "bg-[#1a2330]/45",
          cloudy && "bg-[#6e7782]/35",
        )}
      />
      <div className="istanbul-window-glow absolute inset-y-0 right-0 w-[45%] bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.16)_45%,transparent_64%)] opacity-70" />
      <div className="istanbul-haze absolute left-[-8%] top-[35%] h-24 w-[116%] rounded-full bg-white/10 blur-2xl" />

      {sunny && (
        <>
          <div className="istanbul-sun absolute right-10 top-8 h-24 w-24 rounded-full bg-[#ffd37a]" />
          {sparkleDots.map((dot) => (
            <span
              key={dot.id}
              className="istanbul-spark absolute h-1.5 w-1.5 rounded-full bg-white/70"
              style={{
                left: dot.left,
                top: dot.top,
                animationDelay: dot.delay,
              }}
            />
          ))}
        </>
      )}

      {cloudy && (
        <>
          <div className="istanbul-cloud absolute left-[12%] top-10 h-16 w-36 rounded-full bg-white/18 blur-sm" />
          <div className="istanbul-cloud-slow absolute right-[8%] top-20 h-20 w-44 rounded-full bg-white/14 blur-sm" />
        </>
      )}

      {rainy && (
        <>
          {rainDrops.map((drop) => (
            <span
              key={drop.id}
              className="istanbul-rain absolute top-[-40px] w-px rotate-12 rounded-full bg-primary-100/70"
              style={{
                left: drop.left,
                height: drop.height,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
              }}
            />
          ))}
          {rainSplashes.map((splash) => (
            <span
              key={splash.id}
              className="istanbul-rain-splash absolute bottom-[20%] h-1 w-5 rounded-full border border-white/25"
              style={{
                left: splash.left,
                animationDelay: splash.delay,
              }}
            />
          ))}
        </>
      )}

      {windy &&
        windLines.map((line) => (
          <span
            key={line.id}
            className="istanbul-wind absolute left-[-30%] h-px rounded-full bg-white/35"
            style={{
              top: line.top,
              width: line.width,
              animationDelay: line.delay,
            }}
          />
        ))}
    </div>
  );
}
