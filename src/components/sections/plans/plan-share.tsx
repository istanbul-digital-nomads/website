"use client";

import { useCallback, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast.success(t("copied"));
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

  // Reliable two-step flow, because there is NO web way to auto-load an image
  // into an Instagram story: the image-attached share (instagram-stories://share
  // + iOS UIPasteboard keys / Android ADD_TO_STORY intent) is native-app-only
  // (that's what the X app uses), and iOS Safari's Web Share -> Instagram is
  // unreliable (often drops the file / opens the camera empty). So we let the
  // user (1) save the image, then (2) open Instagram and add it.
  function platform() {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isAndroid = /Android/i.test(ua);
    const isIOS =
      /iP(hone|ad|od)/i.test(ua) ||
      (typeof navigator !== "undefined" &&
        navigator.maxTouchPoints > 1 &&
        /Macintosh/i.test(ua));
    return { isAndroid, isIOS, isMobile: isAndroid || isIOS };
  }

  // Step 1: get the image onto the device. iOS <a download> just opens the
  // image (can't write to Photos), so there we use the share sheet, which has a
  // "Save Image" action; everywhere else a direct download is cleanest.
  async function saveImage() {
    if (busyStory) return;
    setBusyStory(true);
    try {
      const file = await getStoryFile();
      if (!file) return;
      const { isIOS } = platform();
      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });
      if (isIOS && canShareFiles) {
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

  // Step 2: open Instagram's story camera (mobile) or instagram.com (desktop).
  function openInstagram() {
    const { isAndroid, isIOS } = platform();
    if (isAndroid) {
      window.location.assign(
        "intent://story-camera#Intent;package=com.instagram.android;scheme=instagram;S.browser_fallback_url=https%3A%2F%2Fwww.instagram.com;end",
      );
    } else if (isIOS) {
      window.location.assign("instagram://story-camera");
    } else {
      window.open("https://www.instagram.com", "_blank", "noopener");
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
        className="relative z-[60]"
      >
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden
        />
        <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <DialogPanel className="w-full max-w-md rounded-t-2xl border border-ink-3 bg-ink-1 p-5 shadow-2xl sm:rounded-2xl">
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
                {t("copyLink")}
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
                    onClick={saveImage}
                    disabled={busyStory}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-terracotta py-2.5 text-sm font-semibold text-[#06101f] transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {busyStory ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Download className="h-4 w-4" aria-hidden />
                    )}
                    {t("saveImage")}
                  </button>
                  <button
                    type="button"
                    onClick={openInstagram}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-ink-3 py-2.5 text-sm text-paper transition-colors hover:border-ink-4"
                  >
                    <Instagram className="h-4 w-4" aria-hidden />
                    {t("openInstagram")}
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
