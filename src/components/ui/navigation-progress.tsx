"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    setVisible(true);
    setProgress(100);
    const id = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => window.clearTimeout(id);
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
