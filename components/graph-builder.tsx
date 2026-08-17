"use client"

import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useCompanySim } from "@/hooks/use-company-sim"

const METRICS = [
  { key: "benefits", label: "Benefits", prefix: "$", suffix: "k" },
  { key: "leads", label: "Leads", prefix: "", suffix: "" },
  { key: "clients", label: "Clients", prefix: "", suffix: "" },
  { key: "resources", label: "Resources", prefix: "", suffix: "" },
  { key: "projects", label: "Projects", prefix: "", suffix: "" },
] as const

const TYPES = ["area", "line", "bar"] as const
type MetricKey = (typeof METRICS)[number]["key"]
type ChartType = (typeof TYPES)[number]

export function GraphBuilder() {
  const sim = useCompanySim()
  const [metric, setMetric] = useState<MetricKey>("benefits")
  const [type, setType] = useState<ChartType>("area")

  const active = METRICS.find((m) => m.key === metric)!
  const config = { [metric]: { label: active.label, color: "var(--brand)" } }
  const data = sim.history

  return (
    <section id="graphs" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            Build any graph from the same live data
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Every number the engine produces is chartable. Pick a metric, choose a shape, and get
            a custom graph that updates in real time.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-surface p-4 md:p-6">
          {/* controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMetric(m.key)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    metric === m.key
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 rounded-full border border-border bg-background p-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                    type === t ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* current value */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">
              {active.prefix}
              {(sim[metric] as number).toLocaleString()}
              {active.suffix}
            </span>
            <span className="text-sm font-medium text-muted-foreground">live {active.label.toLowerCase()}</span>
          </div>

          {/* chart */}
          <ChartContainer config={config} className="mt-4 h-[280px] w-full">
            {type === "area" ? (
              <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="t" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} width={34} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey={metric}
                  type="monotone"
                  stroke="var(--brand)"
                  strokeWidth={2.5}
                  fill="url(#fillMetric)"
                  isAnimationActive={false}
                  dot={false}
                />
              </AreaChart>
            ) : type === "line" ? (
              <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="t" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} width={34} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey={metric}
                  type="monotone"
                  stroke="var(--brand)"
                  strokeWidth={2.5}
                  isAnimationActive={false}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="t" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} width={34} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey={metric} fill="var(--brand)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            )}
          </ChartContainer>
        </div>
      </div>
    </section>
  )
}
