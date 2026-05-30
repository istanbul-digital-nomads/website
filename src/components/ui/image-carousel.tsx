"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt: string;
}

/**
 * Lightweight, dependency-free image slider. Native CSS scroll-snap drives
 * the swipe/scroll behaviour; an IntersectionObserver tracks which slide is
 * centered so the dots and arrows stay in sync. Single image renders as a
 * plain figure (no chrome). Built to match the design system - no external
 * carousel library.
 */
export function ImageCarousel({
  images,
  className,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 640px) 100vw, 480px",
  rounded = true,
  onImageClick,
}: {
  images: CarouselImage[];
  className?: string;
  /** Tailwind aspect-ratio class for the viewport. */
  aspect?: string;
  sizes?: string;
  rounded?: boolean;
  /** Called with the index when a slide is clicked (e.g. to open a lightbox). */
  onImageClick?: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const multiple = images.length > 1;

  // Track the most-visible slide so dots/arrows reflect the real position
  // after a swipe or keyboard scroll, not just programmatic jumps.
  useEffect(() => {
    if (!multiple) return;
    const root = trackRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = slideRefs.current.indexOf(
            visible.target as HTMLDivElement,
          );
          if (idx >= 0) setActive(idx);
        }
      },
      { root, threshold: 0.6 },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [multiple, images.length]);

  const scrollTo = useCallback((idx: number) => {
    const el = slideRefs.current[idx];
    el?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, []);

  if (images.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        className={cn(
          "flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          multiple && "snap-x snap-mandatory",
          rounded && "overflow-hidden rounded-lg",
        )}
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={cn(
              "relative w-full shrink-0 snap-center bg-ink-2",
              aspect,
            )}
          >
            <button
              type="button"
              onClick={() => onImageClick?.(i)}
              className="absolute inset-0 h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta"
              aria-label={img.alt}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={sizes}
                className="object-cover"
              />
            </button>
          </div>
        ))}
      </div>

      {multiple && (
        <>
          <CarouselArrows
            active={active}
            count={images.length}
            onPrev={() => scrollTo(active - 1)}
            onNext={() => scrollTo(active + 1)}
          />
          <CarouselDots
            images={images}
            active={active}
            onSelect={scrollTo}
            className="absolute inset-x-0 bottom-2"
          />
        </>
      )}
    </div>
  );
}

function CarouselArrows({
  active,
  count,
  onPrev,
  onNext,
  large,
}: {
  active: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  large?: boolean;
}) {
  const size = large ? "h-11 w-11" : "h-8 w-8";
  const icon = large ? "h-6 w-6" : "h-4 w-4";
  return (
    <>
      <button
        type="button"
        aria-label="Previous photo"
        disabled={active === 0}
        onClick={onPrev}
        className={cn(
          "absolute start-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-ink-0/60 text-paper backdrop-blur-sm transition-opacity hover:bg-ink-0/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:pointer-events-none disabled:opacity-0",
          size,
        )}
      >
        <ChevronLeft className={cn(icon, "rtl:rotate-180")} aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next photo"
        disabled={active === count - 1}
        onClick={onNext}
        className={cn(
          "absolute end-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-ink-0/60 text-paper backdrop-blur-sm transition-opacity hover:bg-ink-0/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:pointer-events-none disabled:opacity-0",
          size,
        )}
      >
        <ChevronRight className={cn(icon, "rtl:rotate-180")} aria-hidden />
      </button>
    </>
  );
}

function CarouselDots({
  images,
  active,
  onSelect,
  className,
}: {
  images: CarouselImage[];
  active: number;
  onSelect: (idx: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      {images.map((img, i) => (
        <button
          key={img.src}
          type="button"
          aria-label={`Go to photo ${i + 1}`}
          aria-current={i === active}
          onClick={() => onSelect(i)}
          className={cn(
            "h-1.5 rounded-full transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
            i === active
              ? "w-4 bg-paper"
              : "w-1.5 bg-paper/50 hover:bg-paper/80",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Fullscreen gallery overlay. Opens at `index`, supports arrow keys and
 * Escape, and traps the body scroll while open. Pass `open={false}` to keep
 * it unmounted.
 */
export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: CarouselImage[];
  /** Index to show, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (idx: number) => void;
}) {
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < images.length - 1)
        onIndexChange(index + 1);
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, index, images.length, onClose, onIndexChange]);

  if (!open) return null;
  const current = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute end-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-paper transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <div
        className="relative h-full max-h-[85vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
        {images.length > 1 && (
          <>
            <CarouselArrows
              active={index}
              count={images.length}
              onPrev={() => onIndexChange(index - 1)}
              onNext={() => onIndexChange(index + 1)}
              large
            />
            <CarouselDots
              images={images}
              active={index}
              onSelect={onIndexChange}
              className="absolute inset-x-0 bottom-3"
            />
          </>
        )}
      </div>
    </div>
  );
}
