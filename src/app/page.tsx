import { CallToAction } from "@/components/homepage/callToAction";
import { FeaturedProperties } from "@/components/homepage/featuredDestinations";
import { HeroSection } from "@/components/homepage/hero-section";
import { PopularDestinations } from "@/components/homepage/popularDestinations";
import { Testimonials } from "@/components/homepage/testimonials";
import { TrustIndicators } from "@/components/homepage/trustIndicators";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProperties />
      <PopularDestinations />
      <TrustIndicators />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
