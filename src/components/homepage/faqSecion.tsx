"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How does the Holidays Era work?",
    answer: (
      <>
        <p className="mb-3">
          Holidays Era is a premier marketplace for short-term holiday rentals,
          designed to bridge the gap between reliable guests and quality
          homeowners. Unlike traditional commission-based platforms, we operate on
          a direct-connection model, allowing personalized communication and the
          establishment of trust before a reservation is even made. We prioritise
          transparency, efficiency, and maximum profitability for our hosts.
        </p>
        <p className="mb-3">
          We empower guests to contact homeowners directly and pay directly.
          However, we also allow guests to book through our website—all payments
          go to the homeowner&apos;s bank account they updated while creating
          their profile.
        </p>
        <p>
          Holidays Era works as a source to connect potential guests to
          homeowners who have properties for short-term stay. Our focus is
          simple: to connect guests with the property they desire and to
          connect homeowners to the guests they admire.
        </p>
      </>
    ),
  },
  {
    question:
      "Are there any specific requirements for property owners who wish to list structures?",
    answer: (
      <>
        <p className="mb-3">
          Yes. To join our platform as an owner and list your property, you must
          meet the following criteria:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Ownership Rights:</strong> Proof
            of property ownership or authorized management rights.
          </li>
          <li>
            <strong className="text-foreground">Property Assets:</strong>{" "}
            Address, property details, and high-quality photos.
          </li>
          <li>
            <strong className="text-foreground">Financial Setup:</strong> A bank
            account to receive payments.
          </li>
          <li>
            <strong className="text-foreground">Contact:</strong> An active phone
            number and email for guest communication.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "How do I list my property with the Holidays Era?",
    answer: (
      <>
        <p className="mb-3">
          Registration and listing with Holidays Era is a simple, convenient
          process designed to get your property live and generate leads quickly.
        </p>
        <ul className="list-none space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Account Creation:</strong> Sign
            up as an &quot;Owner Account&quot; on our website.
          </li>
          <li>
            <strong className="text-foreground">Package Selection:</strong>{" "}
            Choose the subscription tier that fits your business goals.
          </li>
          <li>
            <strong className="text-foreground">Property Listing:</strong>{" "}
            Upload your property details, pricing, and availability—or our
            account manager may do this for you with your authorization.
          </li>
          <li>
            <strong className="text-foreground">Verification & Activation:</strong>{" "}
            The team reviews the listing (and may arrange a photoshoot) before
            the property goes live.
          </li>
          <li>
            <strong className="text-foreground">Live Status:</strong> Once
            approved, your property is published to our international audience.
          </li>
          <li>
            <strong className="text-foreground">Lead Generation:</strong>{" "}
            Inquiries from prospective renters will come directly to your inbox
            or phone.
          </li>
          <li>
            <strong className="text-foreground">Direct Management:</strong> You
            have full control—communicate with guests, finalize the booking, and
            collect payment. There are no middleman fees or further
            &quot;per-booking&quot; steps with us.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "How properties are promoted in the Holidays Era?",
    answer: (
      <>
        <p className="mb-3">
          Properties are promoted through a &quot;Lead Generation&quot; strategy
          rather than a simple booking engine. Because you pay a flat fee, the
          platform&apos;s primary job is to drive high-intent international
          traffic to your listing so guests contact you directly.
        </p>
        <div className="space-y-3 text-muted-foreground">
          <div>
            <strong className="text-foreground">1. Global SEO and Search Visibility:</strong>{" "}
            We invest in SEO so when travelers search for holiday rentals in your
            region, our platform appears at the top of Google results, bringing
            global &quot;warm leads&quot; to your property page.
          </div>
          <div>
            <strong className="text-foreground">2. Strategic Lead Generation:</strong>{" "}
            The platform encourages guests to inquire, connecting you with direct
            inquiries (email or phone) and verified traffic that matches your
            property with the right traveler.
          </div>
          <div>
            <strong className="text-foreground">3. Professional Storefront Display:</strong>{" "}
            Your property is presented as a professional brand with
            high-resolution media and owner-direct branding to build trust.
          </div>
          <div>
            <strong className="text-foreground">4. Peak Season Targeting:</strong>{" "}
            We adjust marketing to coincide with global holiday seasons
            (Summer, Christmas, Easter) so your property gets maximum visibility
            when people are most likely to book.
          </div>
          <div>
            <strong className="text-foreground">5. Multi-Channel Exposure:</strong>{" "}
            Depending on your package: social media spotlights (Instagram,
            Facebook) and email newsletters to our database of past travelers
            and high-intent subscribers.
          </div>
        </div>
      </>
    ),
  },
  {
    question:
      "How does the Holiday Era select guests and ensure they are “high-value” and reliable?",
    answer: (
      <>
        <p className="mb-3">
          We employ several vetting and filtering layers. Holidays Era uses a
          rigorous verification process before a booking is finalized:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Government ID Matching:</strong>{" "}
            Guests must upload a valid passport or national ID.
          </li>
          <li>
            <strong className="text-foreground">Rental Agreements:</strong>{" "}
            Guests sign a legally binding digital contract outlining house rules
            (no parties, no smoking, noise limits) before receiving check-in
            instructions.
          </li>
          <li>
            <strong className="text-foreground">Account History:</strong> We
            prioritise repeat premium travelers with high ratings.
          </li>
          <li>
            <strong className="text-foreground">Security Deposits:</strong> We
            often require a pre-authorized damage deposit as a deterrent against
            property damage.
          </li>
          <li>
            <strong className="text-foreground">Biometric &quot;Selfie&quot; Checks:</strong>{" "}
            The system may require a real-time photo to match the person with
            the ID, preventing identity fraud and proxy bookings.
          </li>
          <li>
            <strong className="text-foreground">Manual Review:</strong> If a
            guest is flagged (e.g. VPN from a high-risk area, burner number),
            your account manager or support can manually review the booking.
          </li>
        </ul>
      </>
    ),
  },
  {
    question:
      "Is it possible to manage property's availability and rates directly by Homeowners?",
    answer: (
      <>
        <p className="mb-3">
          Yes. With Holidays Era, homeowners have full direct control over
          property availability and rates.
        </p>
        <ul className="list-none space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Direct Management (API Sync):</strong>{" "}
            If you use a PMS or Channel Manager, we can sync it to your dashboard
            via API key or Channel Manager.
          </li>
          <li>
            <strong className="text-foreground">Owner Dashboard:</strong> Once
            your account is active, you can log in and make real-time updates on
            rates, availability, minimum stay, or offers. No approval needed for
            standard changes.
          </li>
          <li>
            <strong className="text-foreground">Automation (iCal / API Sync):</strong>{" "}
            We support sync with Channel Managers (e.g. Lodgify, Hostaway,
            Guesty) to prevent double booking. If you list elsewhere (e.g.
            Booking.com or Airbnb), you don&apos;t have to update Holidays Era
            manually every time.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "Is there any commission on bookings?",
    answer: (
      <>
        <p className="mb-3">
          No. There is no commission on bookings. Holidays Era operates
          differently from other booking platforms. Our goal is to maximise your
          property&apos;s global reach while you stay in the driver&apos;s seat.
        </p>
        <p className="mb-3">
          Instead of acting as a middleman that takes a commission on every
          booking, we function as a lead-generation partner. Our model is built
          on direct connection: we bring prospective guests from around the
          world straight to you, and you manage the booking and receive payments
          directly. You keep 100% of your rental income without hidden fees.
        </p>
      </>
    ),
  },
  {
    question:
      "How much is the Subscription fee to list the property with the Holidays Era?",
    answer: (
      <>
        <p className="mb-3">
          Holidays Era offers three flat-fee subscription tiers, designed for
          predictable costs and a strong return on investment. Since we
          don&apos;t charge per-booking commission, the revenue paid by the
          guest stays with you.
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
          <li>
            <strong className="text-foreground">12-Month Listing:</strong>{" "}
            Consistent year-round presence.
          </li>
          <li>
            <strong className="text-foreground">18-Month Listing:</strong>{" "}
            Mid-tier option covering multiple peak seasons.
          </li>
          <li>
            <strong className="text-foreground">24-Month Listing:</strong>{" "}
            Best-value package for long-term exposure and maximum ROI.
          </li>
        </ul>
        <p className="mt-3">
          We typically provide custom quotes based on the property&apos;s
          location and potential lead volume. For more information or a custom
          quote, contact our Sales Team.
        </p>
      </>
    ),
  },
  {
    question: "How the Holidays Era Ensures Return on Investment?",
    answer: (
      <>
        <p className="mb-3">
          Holidays Era ensures ROI by shifting the financial advantage back to
          the homeowner. Unlike commission-based sites, we use a fixed-fee
          model designed to pay for itself through one or two successful
          bookings.
        </p>
        <div className="space-y-3 text-muted-foreground">
          <div>
            <strong className="text-foreground">1. Zero-Commission Advantage:</strong>{" "}
            With traditional sites, a €5,000 rental with 15–20% commission costs
            €750–€1,000. With Holidays Era you keep the full €5,000; for many
            owners, savings from one or two bookings exceed the subscription
            cost.
          </div>
          <div>
            <strong className="text-foreground">2. Global Lead Generation:</strong>{" "}
            We invest in targeted advertising and SEO so the platform ranks for
            global holiday rental searches and brings warm leads to you.
          </div>
          <div>
            <strong className="text-foreground">3. Direct Booking & Repeat Guests:</strong>{" "}
            You own the relationship: you get the guest&apos;s email and phone,
            and can invite them to book again without extra fees.
          </div>
          <div>
            <strong className="text-foreground">4. Tiered Exposure Packages:</strong>{" "}
            12–24 month exposure ensures your property is visible in every peak
            season.
          </div>
          <div>
            <strong className="text-foreground">5. Verified Lead Quality:</strong>{" "}
            The focus is on leads who have already shown interest in your type
            of property, reducing time spent on window shoppers.
          </div>
        </div>
      </>
    ),
  },
  {
    question:
      "How many photos homeowners can upload in a property listing?",
    answer: (
      <>
        <p className="mb-3">
          Holidays Era typically allows up to <strong className="text-foreground">25 high-quality photos</strong>{" "}
          per property listing. We encourage you to use this space to tell a
          complete visual story.
        </p>
        <p className="mb-2 font-medium text-foreground">Recommended photo checklist:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-3">
          <li><strong className="text-foreground">Cover Image (1):</strong> Best exterior or view.</li>
          <li><strong className="text-foreground">Living Areas (4–6):</strong> Lounge, dining, indoor relaxation.</li>
          <li><strong className="text-foreground">Kitchen & Dining (3–4):</strong> High-end appliances, homely feel.</li>
          <li><strong className="text-foreground">Bedrooms (2 per room):</strong> Beds and storage.</li>
          <li><strong className="text-foreground">Bathrooms (1 per room):</strong> Clean, well-lit, luxury features.</li>
          <li><strong className="text-foreground">Outdoor/Amenities (5–10):</strong> Pool, garden, BBQ, terrace, scenery.</li>
        </ul>
        <p className="mb-2 font-medium text-foreground">Pro tips:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Use high-resolution images (at least 1920×1080 px).</li>
          <li>The first 5 photos matter most for global travelers.</li>
          <li>Avoid watermarks for a clean, professional look.</li>
        </ul>
      </>
    ),
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-2 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Everything you need to know about listing and booking with Holidays Era
          </p>
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden"
          >
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border px-4 md:px-6 data-[state=open]:bg-muted/20 transition-colors"
              >
                <AccordionTrigger className="text-left py-5 font-semibold text-foreground hover:no-underline hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
