import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: 0 | 1 | 2 | 3 | 4;
}

function Reveal({
  className,
  delay: _delay = 0,
  children,
  ...props
}: RevealProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export { Reveal };
