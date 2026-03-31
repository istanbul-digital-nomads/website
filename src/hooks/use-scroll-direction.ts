"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const directionRef = useRef<"up" | "down">("up");

  const onScroll = useCallback(() => {
    const DEAD_ZONE = 5;
    const y = window.scrollY;
    const delta = y - lastY.current;

    let newDirection = directionRef.current;
    if (Math.abs(delta) > DEAD_ZONE) {
      newDirection = delta > 0 ? "down" : "up";
      directionRef.current = newDirection;
      lastY.current = y;
    }

    setState({
      direction: newDirection,
      scrolled: y > threshold,
      atTop: y <= 0,
    });
  }, [threshold]);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return state;
}
