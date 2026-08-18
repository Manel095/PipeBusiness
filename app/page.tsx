import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { CoreFeatures } from "@/components/core-features"
import { CommandDemo } from "@/components/command-demo"
import { BiUpsell } from "@/components/bi-upsell"
import { PricingTable } from "@/components/pricing-table"
import { Testimonials } from "@/components/testimonials"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/final-cta"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand selection:text-white">
      <SiteNav />
      <main>
        <Hero />
        <ProblemSection />
        <CoreFeatures />
        <CommandDemo />
        <BiUpsell />
        <PricingTable />
        <Testimonials />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
