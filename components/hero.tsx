"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Hero() {
  const [cycle, setCycle] = useState(0)

  // Counter and pulsing effect to simulate data flow
  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((c) => c + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="top" className="relative w-full overflow-hidden bg-gradient-to-r from-[#F8E9C3] via-[#FFDAB9] to-[#FDFDFD] pt-24 pb-16 md:pt-32 md:pb-20">
      {/* Ambient drifting background layer */}
      <motion.div 
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(252,221,104,0.1)_0%,transparent_50%)]"
        animate={{
          x: ["-5%", "5%", "-5%"],
          y: ["-5%", "5%", "-5%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 flex flex-col items-center text-center">
        {/* Headings */}
        <h1 className="max-w-[700px] font-serif text-[42px] font-bold leading-[1.1] text-foreground md:text-[52px]">
          Advanced Visual Workflow & Data Mapping for Operations
        </h1>
        <p className="mt-6 max-w-[550px] text-base leading-relaxed text-foreground/80 md:text-lg">
          Go beyond static dashboards. Map corporate processes, track entity lifecycles, and connect department data in an interactive, automated canvas.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-[24px] bg-brand px-8 py-3.5 text-base font-bold text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:shadow-[0_8px_24px_rgba(47,6,47,0.12)] active:scale-95"
          >
            Start mapping
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-[24px] border-2 border-foreground bg-transparent px-8 py-3.5 text-base font-bold text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:bg-foreground/5 active:scale-95"
          >
            See how it works
          </a>
        </div>

        {/* Directional cue */}
        <p className="mt-8 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          Explore the canvas below
        </p>

        {/* Realistic Dashboard Node Graph Component */}
        <div className="relative mt-8 w-full max-w-[1000px] rounded-[16px] border border-border bg-[#FDFDFD] shadow-[0_12px_40px_rgba(47,6,47,0.08)] overflow-hidden">
          {/* Dot Grid Background */}
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#A1828E 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          
          <div className="relative flex flex-col md:flex-row h-auto md:h-[480px] w-full items-center justify-center gap-8 md:gap-16 px-4 md:px-12 py-12 md:py-0">
            
            {/* SVG Connector Paths */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none hidden md:block" preserveAspectRatio="none">
              {/* Marketing to Sales */}
              <path
                d="M 330 240 C 420 240, 420 240, 500 240"
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
              />
              <circle cx="500" cy="240" r="4" fill="var(--border)" />
              {/* Sales to Operations */}
              <path
                d="M 680 240 C 760 240, 760 240, 840 240"
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
              />
              <circle cx="840" cy="240" r="4" fill="var(--border)" />
            </svg>

            {/* Traveling Data Packet 1 */}
            <motion.div
              className="absolute z-20 hidden h-3 w-3 rounded-full bg-[#FF0083] shadow-[0_0_10px_#FF0083] md:block"
              animate={{ left: ["330px", "500px", "500px"] }}
              transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              style={{ top: "240px", translateY: "-50%", translateX: "-50%" }}
            />

            {/* Traveling Data Packet 2 */}
            <motion.div
              className="absolute z-20 hidden h-3 w-3 rounded-full bg-[#0052CC] shadow-[0_0_10px_#0052CC] md:block"
              animate={{ left: ["680px", "680px", "840px"] }}
              transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              style={{ top: "240px", translateY: "-50%", translateX: "-50%" }}
            />

            {/* Node 1: Marketing */}
            <motion.div 
              className="relative z-10 w-[240px] flex flex-col rounded-[14px] border border-border bg-white shadow-sm"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.4, delay: 0, repeat: Infinity, repeatDelay: 3.6 }}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] font-bold text-[14px]" style={{ background: "rgba(255,0,131,0.1)", color: "#FF0083" }}>M</div>
                  <div>
                    <h3 className="font-sans text-[14px] font-bold text-foreground leading-tight">Marketing</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Lead Engine</p>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground font-medium">Leads Captured</span>
                  <span className="font-mono font-bold text-foreground">{75 + cycle}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground font-medium">Cost per Lead</span>
                  <span className="font-mono font-bold text-foreground">$15.4</span>
                </div>
              </div>
            </motion.div>

            {/* Node 2: Sales */}
            <motion.div 
              className="relative z-10 w-[240px] flex flex-col rounded-[14px] border border-border bg-white shadow-sm"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.4, delay: 1, repeat: Infinity, repeatDelay: 3.6 }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 shadow-sm flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                Lead Handoff
              </div>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] font-bold text-[14px]" style={{ background: "rgba(0,82,204,0.1)", color: "#0052CC" }}>S</div>
                  <div>
                    <h3 className="font-sans text-[14px] font-bold text-foreground leading-tight">Sales</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Cash Engine</p>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground font-medium">Deals Won</span>
                  <span className="font-mono font-bold text-foreground">{2 + Math.floor(cycle / 2)}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground font-medium">Revenue</span>
                  <span className="font-mono font-bold text-foreground">${21014 + (Math.floor(cycle / 2) * 1250)}</span>
                </div>
              </div>
            </motion.div>

            {/* Node 3: Operations */}
            <motion.div 
              className="relative z-10 w-[240px] flex flex-col rounded-[14px] border border-border bg-white shadow-sm"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.4, delay: 2, repeat: Infinity, repeatDelay: 3.6 }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 shadow-sm flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                Project Pipeline
              </div>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] font-bold text-[14px]" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>O</div>
                  <div>
                    <h3 className="font-sans text-[14px] font-bold text-foreground leading-tight">Operations</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Project Engine</p>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground font-medium">Active Projects</span>
                  <span className="font-mono font-bold text-foreground">{15 + Math.floor(cycle / 2)}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground font-medium">Efficiency</span>
                  <span className="font-mono font-bold text-foreground">83.8%</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
