"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Route changed - show completion
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // Intercept link clicks to start progress
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        anchor.target === "_blank"
      ) {
        return;
      }

      // Internal navigation detected
      if (href !== pathname) {
        setVisible(true);
        setProgress(15);

        // Gradually increase progress
        if (timerRef.current) clearInterval(timerRef.current);
        let current = 15;
        timerRef.current = setInterval(() => {
          current += Math.random() * 12;
          if (current > 90) {
            current = 90;
            if (timerRef.current) clearInterval(timerRef.current);
          }
          setProgress(current);
        }, 200);
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="nav-progress nav-progress-pulse"
      style={{
        width: `${progress}%`,
        opacity: visible || progress > 0 ? 1 : 0,
      }}
    />
  );
}
