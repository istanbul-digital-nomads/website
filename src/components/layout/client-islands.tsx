"use client";

import dynamic from "next/dynamic";

// Next 15 disallows `ssr: false` on next/dynamic inside server components.
// Hoist the four post-hydration islands the layout used to wire up into this
// single client wrapper so the server layout stays static.

const BottomTabBar = dynamic(
  () =>
    import("@/components/layout/bottom-tab-bar").then((m) => ({
      default: m.BottomTabBar,
    })),
  { ssr: false },
);

const NavigationProgress = dynamic(
  () =>
    import("@/components/ui/navigation-progress").then((m) => ({
      default: m.NavigationProgress,
    })),
  { ssr: false },
);

const Toaster = dynamic(
  () => import("sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false },
);

const WebMcpRegister = dynamic(
  () =>
    import("@/components/web-mcp-register").then((m) => ({
      default: m.WebMcpRegister,
    })),
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
