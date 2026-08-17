import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { CoreFeatures } from "@/components/core-features"
import { Integrations } from "@/components/integrations"
import { BiUpsell } from "@/components/bi-upsell"
import { PricingTable } from "@/components/pricing-table"
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
        <Integrations />
        <BiUpsell />
        <PricingTable />
        <FaqSection />
      </main>
      <Footer />
    </div>
  )
}
