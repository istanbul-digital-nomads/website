"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * usePathname, but null until the component has mounted.
 *
 * Active-link styling derived from usePathname during render mismatches
 * the prerendered (PPR) shell: the shell renders with no known pathname
 * (nothing active) while the client's first render knows the real route
 * and adds the active indicator - a structural hydration mismatch that
 * makes React 19 throw #418 and regenerate the tree. Deriving "active"
 * from this hook keeps the first client render identical to the shell;
 * the indicator appears right after mount instead.
 */
export function usePathnameForActive(): string | null {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? pathname : null;
}
