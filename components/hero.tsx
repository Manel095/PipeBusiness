"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Database, Webhook, Activity, Zap, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Phase 0: Node 1 fades in
  const node1Opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  const node1Y = useTransform(scrollYProgress, [0, 0.15], [50, 0])

  // Phase 0.5: Webhook modal pops up briefly
  const webhookOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.3, 0.35], [0, 1, 1, 0])
  const webhookScale = useTransform(scrollYProgress, [0.15, 0.2, 0.3, 0.35], [0.8, 1, 1, 0.8])

  // Phase 1: Node 2 fades in
  const node2Opacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1])
  const node2X = useTransform(scrollYProgress, [0.35, 0.45], [50, 0])

  // Phase 1.5: Connection line draws and Data mapping modal appears
  const lineWidth = useTransform(scrollYProgress, [0.45, 0.55], ["0%", "100%"])
  const mappingOpacity = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0])
  const mappingScale = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0.8, 1, 1, 0.8])

  // Phase 2: Data starts flowing
  const flowOpacity = useTransform(scrollYProgress, [0.75, 0.8], [0, 1])

  // Phase 3: BI Dashboard drops in
  const biOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1])
  const biY = useTransform(scrollYProgress, [0.85, 0.95], [50, 0])

  // Text fading out as animation starts
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.1], [0, -50])

  return (
    <section id="top" className="w-full relative bg-background">
      {/* 1. Static Intro Section - Takes up full viewport initially */}
      <div className="relative mx-auto max-w-6xl px-5 pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center text-center z-10 bg-background">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          The Modern Operating System for Business
        </span>

        <h1 className="mt-8 text-balance text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
          Advanced Visual Workflow & Data Mapping for Operations
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Go beyond static dashboards. Map corporate processes, track entity lifecycles, and connect department data in an interactive, automated canvas.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#D4006D] hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Mapping for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* 2. Scrollytelling Interactive Section */}
      <div ref={containerRef} className="relative h-[400vh] w-full">
        {/* Sticky container that holds the canvas elements in the center of the screen */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

          {/* Intro Text fading out to reveal canvas (helps transition) */}
          <motion.div 
            style={{ opacity: introOpacity, y: introY }}
            className="absolute top-1/4 text-center px-4 w-full text-muted-foreground font-medium text-xl md:text-2xl"
          >
            Scroll down to see the magic happen ↓
          </motion.div>

          <div className="relative w-full max-w-5xl h-[500px] flex items-center justify-center mt-20">
            
            {/* Connection Line */}
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-64 md:w-96 h-1.5 flex items-center justify-start z-0 overflow-hidden rounded-full bg-surface border border-border">
              <motion.div 
                style={{ width: lineWidth }}
                className="h-full bg-gradient-to-r from-brand via-purple-500 to-blue-500 rounded-full"
              />
              
              {/* Animated Data Packets (Glowing Dots) */}
              <motion.div 
                style={{ opacity: flowOpacity }}
                className="absolute inset-0 flex items-center overflow-hidden"
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ x: ["-100%", "500%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.5
                    }}
                    className="w-16 h-1.5 rounded-full bg-white/80 shadow-[0_0_12px_3px_#FF0083] absolute left-0"
                  />
                ))}
              </motion.div>
            </div>

            {/* Nodes Container */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-3xl gap-20 md:gap-0 px-4">
              
              {/* Node 1: Marketing */}
              <motion.div 
                style={{ opacity: node1Opacity, y: node1Y }}
                className="relative w-64 rounded-2xl border border-border bg-background p-5 shadow-2xl shadow-brand/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center text-sm font-extrabold uppercase">
                    M
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Marketing</h3>
                    <p className="text-xs text-muted-foreground">Lead Engine</p>
                  </div>
                </div>
                
                {/* Simulated Data Row */}
                <motion.div 
                  style={{ opacity: flowOpacity }}
                  className="space-y-2 border-t border-border pt-4"
                >
                  <div className="text-xs flex justify-between">
                    <span className="text-muted-foreground">lead_id</span>
                    <span className="font-mono">usr_9821</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span className="text-muted-foreground">source</span>
                    <span className="font-mono text-brand font-semibold">Google Ads</span>
                  </div>
                </motion.div>

                {/* Webhook Modal Pop-up */}
                <motion.div 
                  style={{ opacity: webhookOpacity, scale: webhookScale }}
                  className="absolute -top-16 -right-5 md:-right-16 bg-surface border border-border rounded-xl p-3 shadow-xl z-20 w-52"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Webhook className="w-4 h-4 text-purple-500" />
                    <span className="text-[11px] font-bold tracking-tight">Webhook Connected</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">
                    Listening on /api/ingest...
                  </div>
                </motion.div>
              </motion.div>

              {/* Center Mapping Modal Pop-up */}
              <motion.div
                style={{ opacity: mappingOpacity, scale: mappingScale }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[120px] md:-translate-y-[140px] bg-surface border border-border rounded-xl p-4 shadow-2xl z-30 w-56 flex flex-col items-center"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-brand" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Schema Mapping</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono bg-background border border-border px-3 py-2 rounded-lg w-full justify-center">
                  <span className="text-muted-foreground">lead_id</span>
                  <ArrowRight className="w-3 h-3 text-brand" />
                  <span className="text-foreground font-bold">client_id</span>
                </div>
              </motion.div>

              {/* Node 2: Sales */}
              <motion.div 
                style={{ opacity: node2Opacity, x: node2X }}
                className="relative w-64 rounded-2xl border border-border bg-background p-5 shadow-2xl shadow-blue-500/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm font-extrabold uppercase">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Sales</h3>
                    <p className="text-xs text-muted-foreground">Cash Engine</p>
                  </div>
                </div>

                <motion.div 
                  style={{ opacity: flowOpacity }}
                  className="space-y-2 border-t border-border pt-4"
                >
                  <div className="text-xs flex justify-between">
                    <span className="text-muted-foreground">client_id</span>
                    <span className="font-mono">usr_9821</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span className="text-muted-foreground">pipeline</span>
                    <span className="font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3"/> Won
                    </span>
                  </div>
                </motion.div>
              </motion.div>

            </div>

            {/* BI Dashboard Drops In */}
            <motion.div 
              style={{ opacity: biOpacity, y: biY }}
              className="absolute -bottom-10 md:-bottom-20 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl bg-background border border-border rounded-2xl p-6 shadow-2xl z-40"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand" />
                  <h3 className="font-bold text-sm">Live Intelligence</h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Real-time
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-xl border border-border p-4">
                  <div className="text-xs text-muted-foreground mb-1">Leads (In)</div>
                  <div className="text-2xl font-extrabold">2,401</div>
                </div>
                <div className="bg-surface rounded-xl border border-border p-4">
                  <div className="text-xs text-muted-foreground mb-1">Deals (Out)</div>
                  <div className="text-2xl font-extrabold">842</div>
                </div>
                <div className="bg-surface rounded-xl border border-border p-4 md:col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">Conversion Rate</div>
                  <div className="text-2xl font-extrabold text-emerald-600 flex items-center gap-2">
                    35.1% <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="mt-2 w-full h-1 bg-border rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[35.1%] rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
