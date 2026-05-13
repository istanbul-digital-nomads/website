"use client";

// Under Next 15 + React 19, `dynamic({ ssr: false })` produces a Suspense
// bailout marker (BAILOUT_TO_CLIENT_SIDE_RENDERING) at the spot the island
// lives. That defers React 19's Document Metadata flush past LCP and tanks
// the Lighthouse meta-description audit. Importing the client components
// directly lets them SSR-render to their initial null state (no DOM cost),
// then hydrate cleanly - no bailout, no Suspense template, metadata in head.

import { Toaster } from "sonner";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { WebMcpRegister } from "@/components/web-mcp-register";

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
