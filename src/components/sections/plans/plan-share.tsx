"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useTranslations } from "next-intl";
import {
  Share2,
  Copy,
  Check,
  Download,
  Instagram,
  Loader2,
  X,
} from "lucide-react";
import { showToast } from "@/lib/toast";
import { SlotLabel } from "@/components/ui/slot-label";
import { cn } from "@/lib/utils";

// Rich share sheet for a plan: a short link (copy / native share) plus a
// portrait story image that can be shared straight to Instagram/TikTok stories
// via the Web Share API (files), with a download fallback on desktop.
export function PlanShareButton({
  planId,
  locale,
  title,
  className,
}: {
  planId: string;
  locale: string;
  title: string;
  className?: string;
}) {
  const t = useTranslations("share");
  const [open, setOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busyStory, setBusyStory] = useState(false);

  const storyUrl = `/api/plans/${planId}/story?locale=${locale}`;

  const ensureLink = useCallback(async (): Promise<string | null> => {
    if (shortUrl) return shortUrl;
    setCreating(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "plan",
          entityId: planId,
          path: `/plans/${planId}`,
        }),
      });
      if (!res.ok) throw new Error("share failed");
      const { url } = (await res.json()) as { url: string };
      setShortUrl(url);
      return url;
    } catch {
      showToast.error(t("error"));
      return null;
    } finally {
      setCreating(false);
    }
  }, [planId, shortUrl, t]);

  function openSheet() {
    setOpen(true);
    void ensureLink();
  }

  async function copyLink() {
    const url = await ensureLink();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      // The button label itself rolls to "Copied" - no toast needed.
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast.info(url);
    }
  }

  async function shareLink() {
    const url = await ensureLink();
    if (!url) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* dismissed */
      }
    } else {
      void copyLink();
    }
  }

  async function getStoryFile(): Promise<File | null> {
    const res = await fetch(storyUrl);
    if (!res.ok) throw new Error("story render failed");
    const blob = await res.blob();
    return new File([blob], `istanbul-nomads-plan.png`, { type: "image/png" });
  }

  // Hand the actual image to Instagram. The Web Share API with a file is the
  // ONLY web mechanism that attaches the image: the user taps Instagram in the
  // sheet and the image opens in the story/post composer. Instagram's
  // image-attached deeplink (instagram-stories://share + UIPasteboard custom
  // keys on iOS, com.instagram.share.ADD_TO_STORY intent on Android) is
  // native-app-only - that's what the X app uses; a website can't, and a bare
  // instagram://story-camera deeplink just opens Instagram with no image.
  // Desktop (no file share) falls back to download.
  async function shareStory() {
    if (busyStory) return;
    setBusyStory(true);
    try {
      const file = await getStoryFile();
      if (!file) return;
      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });
      if (canShareFiles) {
        // Files ONLY - adding url/text makes some targets drop the file.
        await navigator.share({ files: [file] }).catch(() => {});
      } else {
        downloadBlob(file);
      }
    } catch {
      showToast.error(t("error"));
    } finally {
      setBusyStory(false);
    }
  }

  async function downloadStory() {
    if (busyStory) return;
    setBusyStory(true);
    try {
      const file = await getStoryFile();
      if (file) downloadBlob(file);
    } catch {
      showToast.error(t("error"));
    } finally {
      setBusyStory(false);
    }
  }

  function downloadBlob(file: File) {
    const href = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = href;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={openSheet}
        aria-label={t("button")}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-ink-3 bg-ink-2/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-paper-dim transition-colors hover:border-ink-4 hover:text-paper",
          className,
        )}
      >
        <Share2 className="h-3.5 w-3.5" aria-hidden />
        {t("button")}
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        transition
        className="relative z-[60]"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm duration-200 ease-out data-[closed]:opacity-0"
        />
        {/* Vertically + horizontally centered on every viewport; scrolls if the
            content is taller than the screen. */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-ink-3 bg-ink-1 p-5 shadow-2xl duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="flex items-center justify-between">
              <DialogTitle className="font-display text-h3 text-paper">
                {t("title")}
              </DialogTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("button")}
                className="text-paper-mute transition-colors hover:text-paper"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {/* Link row */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-ink-3 bg-ink-2/60 p-1.5">
              <span className="min-w-0 flex-1 truncate px-2 font-mono text-xs text-paper-dim">
                {creating ? t("preparing") : (shortUrl ?? `${" "}`)}
              </span>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-ink-3 px-3 py-2 text-xs font-medium text-paper transition-colors hover:bg-ink-4"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-moss" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
                <SlotLabel text={copied ? t("copied") : t("copyLink")} />
              </button>
            </div>
            {typeof navigator !== "undefined" && "share" in navigator ? (
              <button
                type="button"
                onClick={shareLink}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-ink-3 py-2.5 text-sm text-paper transition-colors hover:border-ink-4"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                {t("shareLink")}
              </button>
            ) : null}

            {/* Story image */}
            <div className="mt-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                {t("story")}
              </p>
              <div className="mt-3 flex gap-4">
                {/* Preview (9:16 thumbnail) */}
                <div className="relative h-44 w-[99px] shrink-0 overflow-hidden rounded-lg border border-ink-3 bg-ink-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={storyUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <button
                    type="button"
                    onClick={shareStory}
                    disabled={busyStory}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-terracotta py-2.5 text-sm font-semibold text-[#06101f] transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {busyStory ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Instagram className="h-4 w-4" aria-hidden />
                    )}
                    {t("shareStory")}
                  </button>
                  <button
                    type="button"
                    onClick={downloadStory}
                    disabled={busyStory}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-3 py-2.5 text-sm text-paper transition-colors hover:border-ink-4 disabled:opacity-60"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {t("downloadStory")}
                  </button>
                  <p className="text-xs leading-relaxed text-paper-mute">
                    {t("storyHint")}
                  </p>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
