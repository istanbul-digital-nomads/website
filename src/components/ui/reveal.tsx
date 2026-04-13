"use client";

import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: 0 | 1 | 2 | 3 | 4;
}

function Reveal({ className, delay = 0, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"idle" | "hidden" | "visible">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already in viewport on mount - no animation needed
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      return;
    }

    // Below viewport - hide it, then reveal on scroll
    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "40px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        state === "hidden" && "reveal-hidden",
        state === "hidden" && `reveal-delay-${delay}`,
        state === "visible" && "reveal-hidden reveal-visible",
        state === "visible" && `reveal-delay-${delay}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Reveal };
