"use client";

import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: 0 | 1 | 2 | 3 | 4;
}

function Reveal({ className, delay = 0, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const checkedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || checkedRef.current) {
      return;
    }
    checkedRef.current = true;

    // Check if already in viewport on mount (above-the-fold content)
    // This runs synchronously before paint to prevent CLS
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "40px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal",
        `reveal-delay-${delay}`,
        visible && "reveal-visible",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Reveal };
