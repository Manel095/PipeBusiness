import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { Footer } from "@/components/final-cta"
import { UseCasesContent } from "@/components/use-cases/use-cases-content"

export const metadata: Metadata = {
  title: "Use Cases — PipeBusiness | Visual Workflow & KPI Tracking by Industry",
  description:
    "Discover how PipeBusiness helps E-Commerce, SaaS, Agencies, Logistics, and Finance teams map every process, connect data sources, and track KPIs in one visual canvas.",
  openGraph: {
    title: "Use Cases — PipeBusiness",
    description:
      "See how teams across industries use PipeBusiness to map operations, automate data flows, and track KPIs visually.",
    type: "website",
    url: "/use-cases",
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases — PipeBusiness",
    description:
      "See how teams across industries use PipeBusiness to map operations, automate data flows, and track KPIs visually.",
  },
}

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand selection:text-white">
      <SiteNav />
      <main>
        <UseCasesContent />
      </main>
      <Footer />
    </div>
  )
}
