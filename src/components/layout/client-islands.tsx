"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { WebMcpRegister } from "@/components/layout/web-mcp-register";
import type { SearchItem } from "@/lib/search";

// Sonner's Toaster calls `useState(document.hidden)` at render time. On a
// server render `document` is undefined, which throws and shows up as React
// error #418 (hydration mismatch on the html root). dynamic({ssr:false}) is
// allowed here because this module is itself a "use client" boundary, so the
// dynamic import only runs on the client. Other islands SSR-render fine - they
// return null on first render and hydrate from there.
const Toaster = dynamic(
  () => import("sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false },
);

export function NavProgressIsland() {
  return <NavigationProgress />;
}

export function BottomTabBarIsland() {
  return <BottomTabBar />;
}

export function ToasterIsland() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{ className: "toast-brand", duration: 4000 }}
      gap={8}
      visibleToasts={3}
    />
  );
}

export function WebMcpRegisterIsland() {
  return <WebMcpRegister />;
}

// The Cmd-K command menu and the floating assistant are site-wide overlays,
// but neither is needed for first paint - the menu opens on Cmd-K / the header
// search button, the assistant on its launcher. Statically mounting them put
// their JS (cmdk + the assistant flow graph) on the initial hydration path of
// EVERY page, inflating Total Blocking Time. We defer both off the critical
// path: mount on the first engagement signal (movement / key / scroll) or when
// the main thread goes idle, whichever comes first. Movement reliably precedes
// the actual click/keypress, so the feature is ready by the time it's used.
const CommandMenu = dynamic(
  () => import("@/components/ui/command-menu").then((m) => m.CommandMenu),
  { ssr: false },
);
const AssistantWidget = dynamic(
  () =>
    import("@/components/assistant/assistant-widget").then(
      (m) => m.AssistantWidget,
    ),
  { ssr: false },
);

function useDeferredMount(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    const opts: AddEventListenerOptions = { once: true, passive: true };
    const events = [
      "pointermove",
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
      "open-command-menu",
      "open-assistant",
    ];
    events.forEach((e) => window.addEventListener(e, load, opts));
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const ric = w.requestIdleCallback
      ? w.requestIdleCallback(load, { timeout: 2000 })
      : window.setTimeout(load, 1500);
    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      if (w.cancelIdleCallback) w.cancelIdleCallback(ric);
      else window.clearTimeout(ric);
    };
  }, []);
  return ready;
}

export function CommandMenuIsland({ items }: { items: SearchItem[] }) {
  const ready = useDeferredMount();
  return ready ? <CommandMenu items={items} /> : null;
}

export function AssistantWidgetIsland() {
  const ready = useDeferredMount();
  return ready ? <AssistantWidget /> : null;
}
