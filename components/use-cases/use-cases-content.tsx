"use client"

import { motion, type Variants } from "framer-motion"
import { ArrowRight, ChevronRight, Zap, BarChart3, GitBranch } from "lucide-react"
import { USE_CASES, type UseCase } from "./use-cases-data"

/* ─── Animation variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

/* ─── Mini node flow diagram ─── */
function FlowDiagram({ uc }: { uc: UseCase }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-4 px-1">
      {uc.nodes.map((node, i) => (
        <div key={node.label} className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-white px-4 py-3 shadow-sm min-w-[120px]"
            style={{ borderTopColor: uc.color, borderTopWidth: 2 }}
          >
            <span className="text-[12px] font-bold text-foreground whitespace-nowrap">{node.label}</span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{node.sub}</span>
          </div>
          {i < uc.nodes.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Single use-case card ─── */
function UseCaseSection({ uc, index }: { uc: UseCase; index: number }) {
  const Icon = uc.icon
  const isEven = index % 2 === 0

  return (
    <motion.section
      id={uc.id}
      className="scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className={`grid md:grid-cols-12 gap-8 md:gap-12 items-start ${isEven ? "" : "direction-rtl"}`}>
        {/* ─ Left: Copy ─ */}
        <motion.div
          className={`md:col-span-5 ${isEven ? "md:order-1" : "md:order-2"}`}
          style={{ direction: "ltr" }}
          custom={0}
          variants={fadeUp}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ background: uc.colorBg, color: uc.color }}
          >
            <Icon className="h-3.5 w-3.5" />
            {uc.badge}
          </div>

          <h2 className="text-[28px] md:text-[36px] font-serif font-bold tracking-tight text-foreground leading-[1.1]">
            {uc.title}
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-foreground/80">
            {uc.subtitle}
          </p>

          {/* Pain point */}
          <div className="mt-6 rounded-[12px] bg-muted p-5">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              The Problem
            </h4>
            <p className="text-[14px] leading-relaxed text-foreground/80">
              {uc.pain}
            </p>
          </div>

          {/* Solution */}
          <div className="mt-4">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              How PipeBusiness Solves It
            </h4>
            <p className="text-[14px] leading-relaxed text-foreground/80">
              {uc.description}
            </p>
          </div>

          <a
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-[24px] bg-foreground px-6 py-3 text-sm font-bold text-white transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:shadow-[0_8px_24px_rgba(47,6,47,0.12)] active:scale-95"
          >
            Start with this template <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        {/* ─ Right: Visual card ─ */}
        <motion.div
          className={`md:col-span-7 ${isEven ? "md:order-2" : "md:order-1"}`}
          style={{ direction: "ltr" }}
          custom={1}
          variants={fadeUp}
        >
          <div className="rounded-[12px] border border-border bg-white shadow-[0_8px_24px_rgba(47,6,47,0.06)] overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 w-full" style={{ background: uc.color }} />

            {/* Flow diagram */}
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                  Process Flow
                </span>
              </div>
              <FlowDiagram uc={uc} />
            </div>

            {/* Connectors */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                  Connectors
                </span>
              </div>
              <div className="space-y-2">
                {uc.connectors.map((c) => (
                  <div key={c} className="flex items-start gap-2 text-[13px] text-foreground/80">
                    <ChevronRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: uc.color }} />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Grid */}
            <div className="px-6 py-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                  Key Metrics
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {uc.kpis.map((kpi) => (
                  <div key={kpi.name} className="rounded-lg border border-border bg-white p-3">
                    <span className="block text-[11px] font-medium text-muted-foreground">{kpi.name}</span>
                    <span className="block text-[16px] font-bold text-foreground font-mono mt-0.5">{kpi.example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

/* ─── Main exported component ─── */
export function UseCasesContent() {
  return (
    <>
      {/* ─ Hero ─ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#F8E9C3] via-[#FFDAB9] to-[#FDFDFD] pt-24 pb-16 md:pt-32 md:pb-20">
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(252,221,104,0.1)_0%,transparent_50%)]"
          animate={{ x: ["-5%", "5%", "-5%"], y: ["-5%", "5%", "-5%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 mx-auto max-w-[800px] px-5 text-center">
          <span className="inline-block text-[12px] font-bold uppercase tracking-wider text-brand-foreground/60 mb-4">
            Use Cases
          </span>
          <h1 className="font-serif text-[42px] md:text-[52px] font-bold leading-[1.1] tracking-tight text-foreground">
            Built for how your business actually works
          </h1>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/80 max-w-[600px] mx-auto">
            Every industry has unique operational flows. PipeBusiness gives you the visual canvas, data connectors, and KPI engines to map them all — without writing code or stitching together five different tools.
          </p>

          {/* Quick-jump pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon
              return (
                <a
                  key={uc.id}
                  href={`#${uc.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-[13px] font-semibold text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-brand"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: uc.color }} />
                  {uc.badge}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─ Use case sections ─ */}
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24 space-y-24 md:space-y-32">
        {USE_CASES.map((uc, i) => (
          <UseCaseSection key={uc.id} uc={uc} index={i} />
        ))}
      </div>

      {/* ─ CTA banner ─ */}
      <section className="bg-gradient-to-b from-white via-[#FFDAB9]/30 to-[#FDFDFD] py-16 md:py-20">
        <div className="mx-auto max-w-[700px] px-5 text-center">
          <h2 className="text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-foreground leading-[1.1]">
            Don&apos;t see your industry?
          </h2>
          <p className="mt-4 text-[16px] text-foreground/80 leading-relaxed">
            PipeBusiness is a general-purpose operations canvas. If your business has processes, data sources, and metrics — it works for you. Start from a blank canvas or request a custom template.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="flex items-center gap-2 rounded-[24px] bg-brand px-8 py-3.5 text-base font-bold text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:shadow-[0_8px_24px_rgba(47,6,47,0.12)] active:scale-95"
            >
              Start free trial
            </a>
            <a
              href="/#pricing"
              className="flex items-center gap-2 rounded-[24px] border-2 border-foreground bg-transparent px-8 py-3.5 text-base font-bold text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:bg-foreground/5 active:scale-95"
            >
              View pricing
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
