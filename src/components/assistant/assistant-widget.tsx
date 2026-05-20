"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import {
  MessageCircle,
  X,
  RotateCcw,
  ArrowRight,
  CalendarDays,
  FileText,
  MapPin,
  Compass,
  type LucideIcon,
} from "lucide-react";
import {
  assistantNodes,
  ASSISTANT_ROOT,
  type AssistantLinkKind,
} from "@/lib/assistant/flows";

// Floating guided assistant. A launcher bubble opens a chat-style panel
// that walks scripted flows (src/lib/assistant/flows.ts): bot message +
// quick-reply chips that advance, and link cards that route into real
// content. Deterministic, no LLM. Transcript + open state persist in
// sessionStorage so it survives navigation. Opened by the launcher or an
// `open-assistant` custom event (e.g. a CTA elsewhere).

const KIND_ICON: Record<AssistantLinkKind, LucideIcon> = {
  plan: CalendarDays,
  paperwork: FileText,
  doc: FileText,
  guide: MapPin,
  space: MapPin,
  page: Compass,
};

type TranscriptItem =
  | { type: "bot"; nodeId: string }
  | { type: "user"; optKey: string };

const STORAGE_KEY = "assistant-state-v1";

export function AssistantWidget() {
  const t = useTranslations("assistant");
  // Routes that don't want the launcher (e.g. the onboarding wizard, whose
  // sticky mobile footer would overlap it) dispatch `assistant-suppress`
  // on mount and `assistant-unsuppress` on unmount. We avoid usePathname
  // here so the widget never forces the static [id] page shells dynamic.
  const [suppressed, setSuppressed] = useState(false);
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([
    { type: "bot", nodeId: ASSISTANT_ROOT },
  ]);
  const [currentId, setCurrentId] = useState<string>(ASSISTANT_ROOT);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore persisted state once on mount. sessionStorage is only
  // available client-side, so this one-time hydration must run in an
  // effect - setting state here is intentional, not a render loop.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.transcript) && s.currentId) {
          /* eslint-disable react-hooks/set-state-in-effect */
          setTranscript(s.transcript);
          setCurrentId(s.currentId);
          setOpen(Boolean(s.open));
          /* eslint-enable react-hooks/set-state-in-effect */
        }
      }
    } catch {
      // ignore corrupt state
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ open, transcript, currentId }),
      );
    } catch {
      // ignore quota / disabled storage
    }
  }, [open, transcript, currentId]);

  // Open via custom event from anywhere on the site; suppress/unsuppress
  // let specific routes hide the launcher without a pathname hook.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onSuppress = () => setSuppressed(true);
    const onUnsuppress = () => setSuppressed(false);
    window.addEventListener("open-assistant", onOpen);
    window.addEventListener("assistant-suppress", onSuppress);
    window.addEventListener("assistant-unsuppress", onUnsuppress);
    return () => {
      window.removeEventListener("open-assistant", onOpen);
      window.removeEventListener("assistant-suppress", onSuppress);
      window.removeEventListener("assistant-unsuppress", onUnsuppress);
    };
  }, []);

  // Esc closes; focus the panel when it opens; return focus to launcher.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the transcript scrolled to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [transcript, open]);

  const advance = useCallback((optKey: string, nextId: string) => {
    setTranscript((prev) => [
      ...prev,
      { type: "user", optKey },
      { type: "bot", nodeId: nextId },
    ]);
    setCurrentId(nextId);
  }, []);

  const restart = useCallback(() => {
    setTranscript([{ type: "bot", nodeId: ASSISTANT_ROOT }]);
    setCurrentId(ASSISTANT_ROOT);
  }, []);

  if (suppressed) return null;

  const node = assistantNodes[currentId];
  const chips = node.options.filter((o) => o.next);
  const cards = node.options.filter((o) => o.href);

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("launcherLabel")}
          className="fixed bottom-5 end-5 z-[90] inline-flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-ink-0 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/60 motion-safe:animate-marker-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-label={t("title")}
          className="fixed bottom-5 end-5 z-[90] flex max-h-[min(620px,calc(100vh-2.5rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink-3 bg-ink-1 shadow-[0_24px_80px_rgba(0,0,0,0.5)] focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-ink-3 bg-ink-0/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span className="font-display text-[15px] text-paper">
                {t("title")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={restart}
                aria-label={t("restart")}
                className="rounded-md p-1.5 text-paper-mute transition-colors hover:bg-ink-2 hover:text-paper"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="rounded-md p-1.5 text-paper-mute transition-colors hover:bg-ink-2 hover:text-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {transcript.map((item, i) =>
              item.type === "bot" ? (
                <div
                  key={i}
                  className="max-w-[85%] rounded-2xl rounded-bs-sm bg-ink-2 px-3.5 py-2.5 text-[13px] leading-relaxed text-paper"
                >
                  {t(`nodes.${item.nodeId}.message`)}
                </div>
              ) : (
                <div
                  key={i}
                  className="ms-auto max-w-[85%] rounded-2xl rounded-be-sm bg-terracotta px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-0"
                >
                  {t(`opt.${item.optKey}`)}
                </div>
              ),
            )}

            {/* Link cards for the current node */}
            {cards.length > 0 && (
              <div className="space-y-2 pt-1">
                {cards.map((opt) => {
                  const Icon = KIND_ICON[opt.kind ?? "page"];
                  return (
                    <Link
                      key={opt.key}
                      href={opt.href!}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 rounded-xl border border-ink-3 bg-ink-2/50 px-3.5 py-2.5 transition-colors hover:border-terracotta/50 hover:bg-ink-2"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-terracotta" />
                      <span className="flex-1 text-[13px] text-paper">
                        {t(`opt.${opt.key}`)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-paper-faint transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick-reply chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-ink-3 p-3">
              {chips.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => advance(opt.key, opt.next!)}
                  className="rounded-full border border-ink-3 bg-ink-2/60 px-3 py-1.5 text-[13px] text-paper transition-colors hover:border-terracotta/60 hover:text-terracotta"
                >
                  {t(`opt.${opt.key}`)}
                </button>
              ))}
            </div>
          )}

          {/* Footer note + restart when at a leaf */}
          {chips.length === 0 && (
            <div className="border-t border-ink-3 p-3">
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-terracotta"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t("restart")}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
