"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type WeatherMood = "sunny" | "cloudy" | "rainy" | "stormy" | "windy";

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

export function WeatherScene({ mood }: { mood: WeatherMood }) {
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
