import Image from "next/image";
import { cn } from "@/lib/utils";
import type { NeighborhoodPhoto } from "@/lib/neighborhoods";

interface Props {
  photo: NeighborhoodPhoto;
  priority?: boolean;
  sizes?: string;
  rounded?: string;
  aspect?: string;
  className?: string;
  showCredit?: boolean;
}

export function NeighborhoodPhotoImage({
  photo,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  rounded = "rounded-2xl",
  aspect = "aspect-[3/2]",
  className,
  showCredit = true,
}: Props) {
  return (
    <figure className={cn("group relative", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-primary-50/40 dark:bg-primary-950/20",
          aspect,
          rounded,
        )}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      {showCredit && (
        <figcaption className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-[#5d6d7e]">
          Photo:{" "}
          <a
            href={photo.credit.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-primary-600 dark:hover:text-primary-300"
          >
            {photo.credit.author}
          </a>{" "}
          / {photo.credit.source} ({photo.credit.license})
        </figcaption>
      )}
    </figure>
  );
}
