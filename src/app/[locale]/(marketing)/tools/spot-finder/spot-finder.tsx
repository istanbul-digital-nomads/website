"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  ClipboardPaste,
  Instagram,
  Loader2,
  MapPin,
  Search,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/lib/i18n/routing";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { SpotMap } from "./spot-map-lazy";

// Mirror of the server-side SpotCandidate (resolve.ts is server-only).
interface Candidate {
  label: string;
  lat: number;
  lng: number;
  spaceId?: string;
  neighborhoodSlug?: string;
  source: "curated" | "geocoded";
  confidence: "high" | "medium" | "low";
}

interface DetectResult {
  caption: string | null;
  thumbnail: string | null;
  candidates: Candidate[];
}

const ISTANBUL_CENTER = { lat: 41.015, lng: 29.0 };

interface Pin {
  lat: number;
  lng: number;
  label: string;
  spaceId?: string;
  neighborhoodSlug?: string;
}

export function SpotFinder() {
  const t = useTranslations("spotFinder");
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState<DetectResult | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [pin, setPin] = useState<Pin | null>(null);
  const [recenterKey, setRecenterKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function selectCandidate(c: Candidate, idx: number) {
    setActiveIdx(idx);
    setPin({
      lat: c.lat,
      lng: c.lng,
      label: c.label,
      spaceId: c.spaceId,
      neighborhoodSlug: c.neighborhoodSlug,
    });
    setRecenterKey((k) => k + 1);
  }

  async function runDetect(value: string) {
    const trimmed = value.trim();
    if (!trimmed || detecting) return;
    setDetecting(true);
    setSaved(false);
    setResult(null);
    setPin(null);
    setActiveIdx(null);

    try {
      const res = await fetch("/api/spots/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(json.error ?? t("errors.detect"));
        return;
      }
      const data = json.data as DetectResult;
      setResult(data);
      if (data.candidates.length > 0) {
        selectCandidate(data.candidates[0], 0);
      } else {
        // No auto-match: drop the user at the city center to place a pin.
        setPin({ ...ISTANBUL_CENTER, label: "" });
        setRecenterKey((k) => k + 1);
      }
    } catch {
      showToast.error(t("errors.detect"));
    } finally {
      setDetecting(false);
    }
  }

  function detect(e?: FormEvent) {
    e?.preventDefault();
    void runDetect(url);
  }

  async function pasteFromClipboard() {
    try {
      const text = (await navigator.clipboard.readText())?.trim();
      if (!text) return;
      setUrl(text);
      void runDetect(text);
    } catch {
      showToast.info(t("errors.clipboard"));
    }
  }

  function movePin(lat: number, lng: number) {
    // A manual drag means this is no longer exactly the curated space.
    setPin((p) => (p ? { ...p, lat, lng, spaceId: undefined } : p));
  }

  async function save() {
    if (!pin || saving) return;
    const label = pin.label.trim();
    if (!label) {
      showToast.error(t("errors.needLabel"));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          lat: pin.lat,
          lng: pin.lng,
          source: "instagram",
          sourceUrl: url.trim() || undefined,
          spaceId: pin.spaceId,
          neighborhoodSlug: pin.neighborhoodSlug,
          thumbnailUrl: result?.thumbnail ?? undefined,
        }),
      });
      if (res.status === 401) {
        showToast.info(t("signInToSave"));
        router.push({
          pathname: "/login",
          query: { next: "/tools/spot-finder" },
        });
        return;
      }
      const json = await res.json();
      if (res.status === 409) {
        showToast.info(json.error ?? t("errors.already"));
        setSaved(true);
        return;
      }
      if (!res.ok) {
        showToast.error(json.error ?? t("errors.save"));
        return;
      }
      setSaved(true);
      showToast.success(t("toasts.saved"));
    } catch {
      showToast.error(t("errors.save"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-200">
        <Instagram className="h-3.5 w-3.5" aria-hidden />
        {t("eyebrow")}
      </div>
      <h1 className="mt-3 font-display text-h1 text-paper">{t("heading")}</h1>
      <p className="mt-3 text-paper-dim">{t("subheading")}</p>

      {/* URL input */}
      <form onSubmit={detect} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            type="url"
            inputMode="url"
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("input.placeholder")}
            aria-label={t("input.placeholder")}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={pasteFromClipboard}
            disabled={detecting}
          >
            <ClipboardPaste className="h-4 w-4" />
            {t("input.paste")}
          </Button>
          <Button type="submit" disabled={detecting || !url.trim()}>
            {detecting ? (
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {detecting ? t("input.detecting") : t("input.detect")}
          </Button>
        </div>
      </form>

      {/* Result */}
      {pin && (
        <div className="mt-8 space-y-4">
          {result && (
            <p className="text-sm text-paper-dim">
              {result.candidates.length > 0
                ? t("result.found")
                : t("result.none")}
            </p>
          )}

          {/* Candidate chips */}
          {result && result.candidates.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {result.candidates.map((c, i) => (
                <button
                  key={`${c.label}-${i}`}
                  type="button"
                  onClick={() => selectCandidate(c, i)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    i === activeIdx
                      ? "border-terracotta bg-terracotta/10 text-paper"
                      : "border-ink-3 text-paper-dim hover:border-ink-4 hover:text-paper",
                  )}
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Map - confirm or drag the pin */}
          <SpotMap
            lat={pin.lat}
            lng={pin.lng}
            recenterKey={String(recenterKey)}
            onMove={movePin}
          />
          <p className="text-xs text-paper-mute">{t("map.dragHint")}</p>

          {/* Label + save */}
          <Input
            label={t("label.label")}
            value={pin.label}
            onChange={(e) =>
              setPin((p) => (p ? { ...p, label: e.target.value } : p))
            }
            placeholder={t("label.placeholder")}
          />

          {saved ? (
            <div className="flex flex-wrap items-center gap-3 rounded-md border border-moss/40 bg-moss/10 px-4 py-3 text-sm text-paper">
              <Check className="h-4 w-4 text-moss" aria-hidden />
              {t("toasts.saved")}
              <Link
                href="/dashboard/spots"
                className="font-medium text-terracotta underline-offset-2 hover:underline"
              >
                {t("savedCta")}
              </Link>
            </div>
          ) : (
            <Button onClick={save} disabled={saving || !pin.label.trim()}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              {saving ? t("saving") : t("save")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
