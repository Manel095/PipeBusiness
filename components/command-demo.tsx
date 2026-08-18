"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check } from "lucide-react"

const CLI_COMMANDS = [
  {
    cmd: "/create Marketing webhook https://api.ads.com/hook",
    desc: "Create a Lead Engine with a webhook",
  },
  {
    cmd: "/create Sales api https://crm.io/deals",
    desc: "Create a Cash Engine with CRM API",
  },
  {
    cmd: "/connect Marketing Sales \"Lead Handoff\"",
    desc: "Pipe leads from Marketing to Sales",
  },
  {
    cmd: "/report Sales monthly",
    desc: "Generate a monthly snapshot",
  },
]

export function CommandDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="w-full bg-[#2F062F] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        
        {/* Left Side: Copy */}
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-brand">Command-Driven</span>
          <h2 className="mt-4 text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-white leading-[1.1]">
            Build your business OS from the command bar
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-[#F3EEF0]/80">
            No more clicking through menus. Press <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[13px]">⌘K</code> and type commands to create engines, wire connectors, add webhooks, and generate intelligence reports — all in seconds.
          </p>

          <div className="mt-10">
            <h4 className="text-sm font-bold text-white mb-3">5 core commands</h4>
            <div className="flex flex-wrap gap-2 font-mono text-[13px] text-[#A1828E]">
              <span className="text-brand">/create</span> · <span className="text-brand">/connect</span> · <span className="text-brand">/update</span> · <span className="text-brand">/report</span> · <span className="text-brand">/status</span>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Terminal */}
        <div ref={ref} className="rounded-xl border border-white/10 bg-black/40 p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="ml-4 text-[12px] font-mono text-white/40">PipeBusiness CLI</span>
          </div>

          <div className="space-y-6 font-mono text-[13px]">
            {CLI_COMMANDS.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.8 }}
                className="space-y-2"
              >
                {/* Typed Command */}
                <div className="flex items-center text-white">
                  <span className="text-brand mr-2">❯</span>
                  {/* Simulate typing effect by revealing width or just fading in for now */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: (index * 0.8) + 0.2 }}
                  >
                    {item.cmd}
                  </motion.span>
                </div>
                
                {/* Result / Checkmark */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    delay: (index * 0.8) + 0.6
                  }}
                  className="flex items-center gap-2 text-[#A1828E] pl-4"
                >
                  <Check className="w-4 h-4 text-[#27C93F]" strokeWidth={3} />
                  <span>{item.desc}</span>
                </motion.div>
              </motion.div>
            ))}
            
            {/* Blinking Cursor at the end */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: (CLI_COMMANDS.length * 0.8) + 0.5 }}
              className="flex items-center text-white pt-2"
            >
              <span className="text-brand mr-2">❯</span>
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-white/60"
              />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}
