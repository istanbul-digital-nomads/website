"use client";

import dynamic from "next/dynamic";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { WebMcpRegister } from "@/components/web-mcp-register";

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
