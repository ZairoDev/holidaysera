import { CallToAction } from "@/components/homepage/callToAction";
import { FeaturedProperties } from "@/components/homepage/featuredDestinations";
import { HeroSection } from "@/components/homepage/hero-section";
import { PopularDestinations } from "@/components/homepage/popularDestinations";
import { Testimonials } from "@/components/homepage/testimonials";
import { TrustIndicators } from "@/components/homepage/trustIndicators";
import { Property } from "@/lib/type";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";

/** Featured listings come from MongoDB — do not prerender at build time (CI has no DB during collect). */
export const dynamic = "force-dynamic";

export default async function Home() {
  let featured: Property[] = [];
  try {
    const caller = appRouter.createCaller(
      await createContext({ req: new Request("http://localhost:3001") })
    );
    featured = await caller.property.getFeatured();
  } catch (error) {
    console.error("Homepage: failed to load featured properties", error);
  }
  // console.log("featured");
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProperties properties={featured}/>
      <PopularDestinations />
      <TrustIndicators />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
