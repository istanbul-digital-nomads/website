"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode; resetKey?: string };
type State = { hasError: boolean; lastResetKey?: string };

/**
 * Local error boundary for the cinematic map. MapLibre + react-map-gl
 * can throw during rapid client-side navigations (rapid mount/unmount
 * races, WebGL context teardown, etc.). We catch those errors here so
 * the whole homepage doesn't get blown to the layout-level error.tsx.
 * The fallback is the hero chrome without the map - everything else
 * (headline, CTAs, tour callout) keeps rendering. When `resetKey` is
 * passed and changes (e.g. on pathname change), the boundary auto-
 * recovers and re-mounts the children.
 */
export class HeroErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, lastResetKey: this.props.resetKey };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    props: Props,
    state: State,
  ): Partial<State> | null {
    if (props.resetKey !== state.lastResetKey) {
      return { hasError: false, lastResetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[HeroLive] map error caught:", error);
    }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
