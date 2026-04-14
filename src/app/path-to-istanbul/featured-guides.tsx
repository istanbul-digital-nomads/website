import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLocalGuides } from "@/lib/supabase/queries";
import { guideSpecializations } from "@/lib/constants";
import { COUNTRIES, getCountryByCode } from "@/lib/path-to-istanbul";

function specLabel(v: string) {
  return guideSpecializations.find((s) => s.value === v)?.label ?? v;
}

function PopularPaths() {
  const supported = COUNTRIES.filter((c) => c.supported);
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-3xl">
            Popular paths to Istanbul
          </h2>
          <p className="mt-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
            Country playbooks ready to read - pick yours and skip the guesswork.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supported.map((c) => (
          <Link
            key={c.code}
            href={`/path-to-istanbul/${c.slug}`}
            className="group rounded-2xl border border-black/5 bg-white/70 p-5 transition-colors hover:border-primary-300/60 hover:bg-primary-50/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-700/40 dark:hover:bg-primary-950/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {c.flag}
                </span>
                <div>
                  <div className="text-base font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                    {c.name}
                  </div>
                  <div className="text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                    Visa, money, housing, community
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-0.5 dark:text-primary-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function FeaturedGuides() {
  const { data } = await getLocalGuides({ limit: 6 });
  const guides = data ?? [];
  if (guides.length === 0) return <PopularPaths />;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-3xl">
            Meet guides who made the journey
          </h2>
          <p className="mt-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
            Locals and fellow nomads who can help you settle in faster.
          </p>
        </div>
        <Link
          href="/local-guides"
          className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:inline-flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                    {guide.name}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#5d6d7e] dark:text-[#99a3ad]">
                    <Clock className="h-3 w-3" />
                    {guide.years_in_istanbul}y in Istanbul
                  </div>
                </div>
              </div>

              {guide.origin_countries && guide.origin_countries.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {guide.origin_countries
                    .map((code) => getCountryByCode(code))
                    .filter((c): c is NonNullable<typeof c> => Boolean(c))
                    .slice(0, 3)
                    .map((c) => (
                      <span
                        key={c.code}
                        className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] text-primary-700 dark:bg-primary-950/30 dark:text-primary-300"
                      >
                        <span aria-hidden="true">{c.flag}</span>
                        {c.name}
                      </span>
                    ))}
                </div>
              )}

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
