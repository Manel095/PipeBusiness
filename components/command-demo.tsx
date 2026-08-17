"use client"

import { useState } from "react"
import { Search, CornerDownLeft } from "lucide-react"
import { useCompanySim } from "@/hooks/use-company-sim"

export function CommandDemo() {
  const sim = useCompanySim()
  const [active, setActive] = useState(0)

  const commands = [
    {
      cmd: "/benefits",
      label: "Net profit produced by the engine",
      value: `$${sim.benefits}k`,
      delta: `${sim.flow.operations}/tick from operations`,
    },
    {
      cmd: "/leads",
      label: "Leads waiting in the pipeline",
      value: sim.leads.toLocaleString(),
      delta: `+${sim.flow.marketing}/tick from marketing`,
    },
    {
      cmd: "/clients",
      label: "Active clients converted by sales",
      value: sim.clients.toLocaleString(),
      delta: `${sim.projects} projects running`,
    },
    {
      cmd: "/resources",
      label: "Resources left in the tank",
      value: sim.resources.toLocaleString(),
      delta: `- $${sim.maintenanceCost}k maintenance`,
    },
  ]

  const current = commands[active]

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            Ask for any number. Get it in a keystroke.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Hit the command bar, type a slash command, and PipeBusiness pulls the answer
            straight from your process map. Try one:
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          {/* chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {commands.map((c, i) => (
              <button
                key={c.cmd}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full border px-4 py-2 font-mono text-sm transition-colors ${
                  i === active
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.cmd}
              </button>
            ))}
          </div>

          {/* terminal */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="flex items-center gap-3 border-b border-border bg-background px-5 py-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-base text-foreground">{current.cmd}</span>
              <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CornerDownLeft className="h-4 w-4" />
                Enter
              </span>
            </div>
            <div className="px-6 py-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">{current.label}</p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
                {current.value}
              </p>
              <p className="mt-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                {current.delta}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
