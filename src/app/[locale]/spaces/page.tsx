import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Headphones, MapPin, PlugZap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { spaces } from "@/lib/spaces";
import { SpacesDirectory } from "./spaces-directory";

export const metadata: Metadata = {
  title: "Nomad Spaces",
  description:
    "Find the best cafes and coworking spaces in Istanbul for remote work. Each spot is rated with a Nomad Score based on wifi, power, comfort, noise, value, and vibe.",
};

export default function SpacesPage() {
  const openSpaces = spaces.filter((space) => space.status !== "closed");
  const neighborhoods = new Set(spaces.map((space) => space.neighborhood)).size;

  return (
    <div className="overflow-hidden">
      <section className="border-b border-black/10 bg-[#fbfaf8] py-12 dark:border-white/10 dark:bg-[#14110f] lg:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="eyebrow">Nomad Spaces</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[0.98] text-neutral-950 sm:text-[4.5rem] dark:text-[#f2f3f4]">
                Find the right table for today.
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                Choose calls, quiet focus, rain-safe backup, late work, budget,
                or first-visit mode. The finder ranks Istanbul cafes and
                coworking spaces by what actually matters for remote work.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#space-finder"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-[#f2f3f4] dark:text-[#14110f] dark:hover:bg-[#d8d0c8]"
                >
                  Open finder
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/tools/first-week-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/15 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:border-primary-500/40 hover:bg-white/60 dark:border-white/20 dark:text-[#f2f3f4] dark:hover:bg-white/10"
                >
                  Plan week one
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroSignal
                icon={PlugZap}
                label="Work-ready"
                value={`${openSpaces.length} spaces`}
                detail="Cafes and coworking spots with laptop signals."
              />
              <HeroSignal
                icon={MapPin}
                label="Coverage"
                value={`${neighborhoods} areas`}
                detail="Asian and European side options in one comparison."
              />
              <HeroSignal
                icon={Headphones}
                label="Decision labels"
                value="Calls / quiet / rain"
                detail="Same-day filters instead of generic listings."
              />
              <HeroSignal
                icon={Clock3}
                label="Reality check"
                value="Partial scores shown"
                detail="Unverified fields stay honest and visible."
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="space-finder" className="py-12 lg:py-16">
        <Container>
          <SpacesDirectory spaces={spaces} />
        </Container>
      </section>
    </div>
  );
}

function HeroSignal({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof PlugZap;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
        <Icon className="h-4 w-4 text-primary-600 dark:text-primary-300" />
        {label}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
        {detail}
      </p>
    </div>
  );
}
