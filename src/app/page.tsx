import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { FeaturedEvents } from "@/components/sections/featured-events";
import { GuideHighlights } from "@/components/sections/guide-highlights";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedEvents />
      <GuideHighlights />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
