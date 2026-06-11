"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { SlotText, type SlotTextProps } from "slot-text/react";

// Arabic and Persian are cursive scripts: slot-text puts every character in
// its own cell, which would break letter joining mid-word.
const CURSIVE_LOCALES = new Set(["ar", "fa"]);

// Tiny label that rolls between texts like a split-flap display (slot-text).
// Falls back to a plain swap on the server pass, for cursive-script locales,
// and for visitors who prefer reduced motion. Screen readers get the label
// exactly once via the sr-only twin - the animated cells are aria-hidden.
export function SlotLabel({ text, options, ...props }: SlotTextProps) {
  const locale = useLocale();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!animate || CURSIVE_LOCALES.has(locale)) {
    return <span {...props}>{text}</span>;
  }

  return (
    <>
      <span className="sr-only">{text}</span>
      <SlotText aria-hidden text={text} options={options} {...props} />
    </>
  );
}
