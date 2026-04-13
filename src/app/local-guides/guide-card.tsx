"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Languages,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { guideSpecializations, istanbulNeighborhoods } from "@/lib/constants";
import type { Database } from "@/types/database";

type LocalGuide = Database["public"]["Tables"]["local_guides"]["Row"];

function getSpecLabel(value: string) {
  return guideSpecializations.find((s) => s.value === value)?.label || value;
}

function getNeighborhoodLabel(value: string) {
  return istanbulNeighborhoods.find((n) => n.value === value)?.label || value;
}

export function GuideCard({ guide }: { guide: LocalGuide }) {
  const [expanded, setExpanded] = useState(false);

  const hasSocials =
    guide.social_instagram ||
    guide.social_linkedin ||
    guide.social_twitter ||
    guide.social_website;

  return (
    <Card hoverable className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            {guide.photo_url ? (
              <Image
                src={guide.photo_url}
                alt={guide.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                {guide.name[0]}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-[#f2f3f4]">
                {guide.name}
              </h3>
              {guide.role_title && (
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {guide.role_title}
                </p>
              )}
              <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-[#85929e]">
                <Clock className="h-3 w-3" />
                {guide.years_in_istanbul}{" "}
                {guide.years_in_istanbul === 1 ? "year" : "years"} in Istanbul
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-[#99a3ad]">
            {expanded ? guide.bio : guide.bio.slice(0, 120)}
            {!expanded && guide.bio.length > 120 && "..."}
          </p>

          {/* Specializations */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {guide.specializations.map((spec) => (
              <Badge key={spec} variant="default">
                {getSpecLabel(spec)}
              </Badge>
            ))}
          </div>

          {/* Neighborhoods + Languages */}
          <div className="mt-3 space-y-1.5">
            {guide.neighborhoods.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-[#85929e]">
                <MapPin className="h-3 w-3 shrink-0" />
                {guide.neighborhoods.map(getNeighborhoodLabel).join(", ")}
              </div>
            )}
            {guide.languages.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-[#85929e]">
                <Languages className="h-3 w-3 shrink-0" />
                {guide.languages.join(", ")}
              </div>
            )}
          </div>

          {/* Expanded section */}
          {expanded && hasSocials && (
            <div className="mt-4 flex gap-2 border-t border-black/5 pt-4 dark:border-white/10">
              {guide.social_instagram && (
                <a
                  href={guide.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-black/10 p-2 text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-primary-400"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {guide.social_linkedin && (
                <a
                  href={guide.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-black/10 p-2 text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-primary-400"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {guide.social_twitter && (
                <a
                  href={guide.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-black/10 p-2 text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-primary-400"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {guide.social_website && (
                <a
                  href={guide.social_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-black/10 p-2 text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-primary-400"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

          {/* Toggle */}
          {(guide.bio.length > 120 || hasSocials) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
