import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocalGuides } from "@/lib/supabase/queries";
import type { Country } from "@/lib/path-to-istanbul";
import { guideSpecializations, istanbulNeighborhoods } from "@/lib/constants";

function specLabel(v: string) {
  return guideSpecializations.find((s) => s.value === v)?.label ?? v;
}
function neighborhoodLabel(v: string) {
  return istanbulNeighborhoods.find((n) => n.value === v)?.label ?? v;
}

export async function GuidesFromCountry({ country }: { country: Country }) {
  // Tier 1: guides with exact origin-country match
  const { data: originMatches } = await getLocalGuides({
    originCountry: country.code,
    limit: 6,
  });

  let guides = originMatches ?? [];
  let tier: "origin" | "language" | "empty" = "origin";

  // Tier 2: fall back to language match for these countries
  const languageByCode: Record<string, string> = {
    IR: "Persian",
    RU: "Russian",
    IN: "Hindi",
    PK: "Urdu",
    NG: "English",
  };

  if (guides.length === 0) {
    const lang = languageByCode[country.code];
    if (lang) {
      const { data: allGuides } = await getLocalGuides({ limit: 24 });
      guides = (allGuides ?? []).filter((g) => g.languages?.includes(lang));
      if (guides.length > 0) tier = "language";
    }
  }

  if (guides.length === 0) tier = "empty";

  return (
    <div className="rounded-2xl border border-primary-200/60 bg-primary-50/40 p-6 dark:border-primary-900/30 dark:bg-primary-950/10 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
            Guides from {country.name}
          </h2>
          <p className="mt-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
            {tier === "origin"
              ? `People who made the same journey and can help you settle in.`
              : tier === "language"
                ? `No ${country.name}-born guides yet, but these locals speak the language.`
                : `We don't have a guide from ${country.name} yet. Want to be the first?`}
          </p>
        </div>
        <span aria-hidden="true" className="text-3xl">
          {country.flag}
        </span>
      </div>

      {tier === "empty" ? (
        <div className="mt-6 rounded-xl border border-dashed border-primary-300/40 bg-white/60 p-6 text-center dark:border-primary-800/40 dark:bg-[#1a1a2e]/40">
          <p className="text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
            Local guides from {country.name} help newcomers skip the hardest
            parts of moving. Be the person you wish you&apos;d met when you
            arrived.
          </p>
          <Link href="/local-guides/join" className="mt-4 inline-block">
            <Button size="sm" className="rounded-full">
              Apply to be a guide <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Card key={guide.id} hoverable>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  {guide.photo_url ? (
                    <Image
                      src={guide.photo_url}
                      alt={guide.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                      {guide.name[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {guide.name}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#5d6d7e] dark:text-[#99a3ad]">
                      <Clock className="h-3 w-3" />
                      {guide.years_in_istanbul}y in Istanbul
                    </div>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#5d6d7e] dark:text-[#99a3ad]">
                  {guide.bio}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {guide.specializations.slice(0, 2).map((s) => (
                    <Badge key={s} variant="default">
                      {specLabel(s)}
                    </Badge>
                  ))}
                </div>

                {guide.neighborhoods.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-[#5d6d7e] dark:text-[#99a3ad]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {guide.neighborhoods
                        .slice(0, 2)
                        .map(neighborhoodLabel)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tier !== "empty" && (
        <div className="mt-6 text-center">
          <Link
            href="/local-guides"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Browse all local guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
