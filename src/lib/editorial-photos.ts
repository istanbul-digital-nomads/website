import type { Event } from "@/types/models";
import type { BlogCoverImage } from "@/lib/blog-covers";
import { blogCoverImages } from "@/lib/blog-covers";
import type { Neighborhood, NeighborhoodPhoto } from "@/lib/neighborhoods";
import { neighborhoods } from "@/lib/neighborhoods";

export type EditorialPhoto = {
  src: string;
  alt: string;
  credit: string;
  objectPosition?: string;
};

const creditFor = (photo: NeighborhoodPhoto): string =>
  `${photo.credit.author} / ${photo.credit.source}`;

const byNeighborhood = Object.fromEntries(
  neighborhoods.map((neighborhood) => [neighborhood.slug, neighborhood]),
) as Record<Neighborhood["slug"], Neighborhood>;

const fromPhoto = (
  photo: NeighborhoodPhoto,
  objectPosition?: string,
): EditorialPhoto => ({
  src: photo.src,
  alt: photo.alt,
  credit: creditFor(photo),
  objectPosition,
});

const fromBlogCover = (
  photo: BlogCoverImage,
  objectPosition?: string,
): EditorialPhoto => ({
  src: photo.src,
  alt: photo.alt,
  credit: `${photo.credit.author} / ${photo.credit.source}`,
  objectPosition,
});

export const homeHeroPhoto = fromPhoto(
  byNeighborhood.kadikoy.hero,
  "center 48%",
);

export const homeDoorPhotos = {
  planner: fromBlogCover(
    blogCoverImages["best-laptop-friendly-cafes-istanbul"],
    "center 52%",
  ),
  matcher: fromPhoto(byNeighborhood.cihangir.hero, "center 55%"),
  community: fromBlogCover(
    blogCoverImages["espressolab-istanbul-remote-work"],
    "center 50%",
  ),
} satisfies Record<"planner" | "matcher" | "community", EditorialPhoto>;

export const homeGuidePhotos: Record<string, EditorialPhoto> = {
  neighborhoods: fromPhoto(byNeighborhood.galata.gallery[2], "center 50%"),
  housing: fromPhoto(byNeighborhood.cihangir.gallery[2], "center 55%"),
  "cost-of-living": fromBlogCover(
    blogCoverImages["real-cost-of-living-istanbul-2026"],
    "center 50%",
  ),
};

export const eventFallbackPhotos = {
  meetup: fromPhoto(byNeighborhood.kadikoy.gallery[1], "center 50%"),
  coworking: fromPhoto(byNeighborhood.cihangir.gallery[0], "center 45%"),
  workshop: fromPhoto(byNeighborhood.galata.hero, "center 52%"),
  social: fromPhoto(byNeighborhood.besiktas.gallery[0], "center 50%"),
} satisfies Record<Event["type"], EditorialPhoto>;

export function getNeighborhoodPhotoSet(neighborhood: Neighborhood) {
  return {
    hero: fromPhoto(neighborhood.hero, "center 52%"),
    details: neighborhood.gallery.map((photo) =>
      fromPhoto(photo, "center 50%"),
    ),
  };
}

export function getEventPhoto(event: Event): EditorialPhoto {
  if (event.image_url) {
    return {
      src: event.image_url,
      alt: `${event.title} at ${event.location_name}`,
      credit: "Istanbul Nomads",
      objectPosition: "center 50%",
    };
  }

  return eventFallbackPhotos[event.type];
}
