import { CallToAction } from "@/components/homepage/callToAction";
import { FeaturedProperties } from "@/components/homepage/featuredDestinations";
import { HeroSection } from "@/components/homepage/hero-section";
import { PopularDestinations } from "@/components/homepage/popularDestinations";
import { Testimonials } from "@/components/homepage/testimonials";
import { TrustIndicators } from "@/components/homepage/trustIndicators";
import { Property } from "@/lib/type";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";


export default async function Home() {
  const caller = appRouter.createCaller(await createContext({req: new Request("http://localhost:3000")}));
  const featured:Property[] = await caller.property.getFeatured();
  console.log("featured");
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
