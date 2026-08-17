import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CommandDemo } from "@/components/command-demo"
import { GraphBuilder } from "@/components/graph-builder"
import { FinalCta, Footer } from "@/components/final-cta"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero />
        <Features />
        <CommandDemo />
        <GraphBuilder />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
