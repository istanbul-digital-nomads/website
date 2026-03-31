"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollState {
  direction: "up" | "down";
  scrolled: boolean;
  atTop: boolean;
}

export function useScrollDirection(threshold = 12): ScrollState {
  const [state, setState] = useState<ScrollState>({
    direction: "up",
    scrolled: false,
    atTop: true,
  });
  const lastY = useRef(0);

  useEffect(() => {
    const DEAD_ZONE = 5;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setState({
        direction: Math.abs(delta) > DEAD_ZONE ? (delta > 0 ? "down" : "up") : state.direction,
        scrolled: y > threshold,
        atTop: y <= 0,
      });

      if (Math.abs(delta) > DEAD_ZONE) {
        lastY.current = y;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  return state;
}
