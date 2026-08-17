"use client"

import { useState, useMemo } from "react"
import { useWorkspace } from "@/lib/store"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Plus, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

const TIME_RANGES = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: 9999 },
]

const CHART_TYPES = ["area", "line", "bar"] as const
type ChartType = (typeof CHART_TYPES)[number]

const ACCENT_COLORS = ["#FF0083", "#6366F1", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6"]

export default function IntelligencePage() {
  const workspace = useWorkspace()
  const [timeRange, setTimeRange] = useState("30d")
  const [charts, setCharts] = useState<{ id: string; processId: string; metric: string; type: ChartType }[]>(() => {
    // Auto-generate initial charts from available data
    const initial: { id: string; processId: string; metric: string; type: ChartType }[] = []
    workspace.processes.forEach((proc, i) => {
      if (proc.data.length === 0) return
      const keys = Object.keys(proc.data[0]).filter((k) => k !== "date")
      if (keys[0]) {
        initial.push({
          id: `chart-${i}`,
          processId: proc.id,
          metric: keys[0],
          type: i % 3 === 0 ? "area" : i % 3 === 1 ? "line" : "bar",
        })
      }
    })
    return initial
  })

  const days = TIME_RANGES.find((t) => t.key === timeRange)?.days ?? 30

  // Summary stats
  const summaryStats = useMemo(() => {
    return workspace.processes.map((proc) => {
      if (proc.data.length === 0) return null
      const keys = Object.keys(proc.data[0]).filter((k) => k !== "date")
      const mainKey = keys[0]
      if (!mainKey) return null
      const sliced = proc.data.slice(-days)
      const latest = Number(sliced[sliced.length - 1]?.[mainKey] ?? 0)
      const first = Number(sliced[0]?.[mainKey] ?? latest)
      const delta = first !== 0 ? ((latest - first) / first) * 100 : 0
      return { proc, mainKey, latest, delta }
    }).filter(Boolean) as { proc: typeof workspace.processes[0]; mainKey: string; latest: number; delta: number }[]
  }, [workspace.processes, days])

  const addChart = () => {
    const proc = workspace.processes.find((p) => p.data.length > 0)
    if (!proc) return
    const keys = Object.keys(proc.data[0]).filter((k) => k !== "date")
    if (keys.length === 0) return
    setCharts((prev) => [
      ...prev,
      {
        id: `chart-${Date.now()}`,
        processId: proc.id,
        metric: keys[Math.floor(Math.random() * keys.length)],
        type: CHART_TYPES[Math.floor(Math.random() * CHART_TYPES.length)],
      },
    ])
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Business Intelligence</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dynamic charts and reports from your connected processes
        </p>
      </div>

      {/* Time range selector */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {TIME_RANGES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTimeRange(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                timeRange === t.key
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={addChart}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Add chart
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 px-6 pt-5 md:grid-cols-3 lg:grid-cols-5">
        {summaryStats.map((stat) => (
          <div
            key={stat.proc.id}
            className="rounded-2xl border border-border bg-background p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{stat.proc.icon}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {stat.proc.name}
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-foreground">
              {stat.latest.toLocaleString()}
            </p>
            <div className="mt-1 flex items-center gap-1">
              {stat.delta >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-semibold ${
                  stat.delta >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {stat.delta >= 0 ? "+" : ""}
                {stat.delta.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground capitalize">{stat.mainKey.replace(/_/g, " ")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="bi-grid mt-2">
        {charts.map((chart, chartIdx) => {
          const proc = workspace.processes.find((p) => p.id === chart.processId)
          if (!proc || proc.data.length === 0) return null
          const sliced = proc.data.slice(-days)
          const color = ACCENT_COLORS[chartIdx % ACCENT_COLORS.length]
          const config = { [chart.metric]: { label: chart.metric.replace(/_/g, " "), color } }
          const allMetrics = Object.keys(proc.data[0]).filter((k) => k !== "date")

          return (
            <div key={chart.id} className="bi-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span>{proc.icon}</span>
                  <div>
                    <p className="text-sm font-semibold capitalize">{chart.metric.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">{proc.name}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {/* Metric selector */}
                  <select
                    value={chart.metric}
                    onChange={(e) => {
                      setCharts((prev) =>
                        prev.map((c) =>
                          c.id === chart.id ? { ...c, metric: e.target.value } : c
                        )
                      )
                    }}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs"
                  >
                    {allMetrics.map((m) => (
                      <option key={m} value={m}>
                        {m.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  {/* Chart type selector */}
                  <div className="flex gap-0.5 rounded-lg border border-border bg-surface p-0.5">
                    {CHART_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setCharts((prev) =>
                            prev.map((c) => (c.id === chart.id ? { ...c, type: t } : c))
                          )
                        }
                        className={`rounded-md px-2 py-1 text-[10px] font-semibold capitalize transition-colors ${
                          chart.type === t
                            ? "bg-brand text-brand-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current value */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-extrabold text-foreground">
                  {Number(sliced[sliced.length - 1]?.[chart.metric] ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">latest</span>
              </div>

              <ChartContainer config={config} className="h-[200px] w-full">
                {chart.type === "area" ? (
                  <AreaChart data={sliced} margin={{ left: 0, right: 8, top: 4 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                    <YAxis tickLine={false} axisLine={false} width={40} fontSize={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <defs>
                      <linearGradient id={`fill-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey={chart.metric}
                      type="monotone"
                      stroke={color}
                      strokeWidth={2}
                      fill={`url(#fill-${chart.id})`}
                      isAnimationActive={false}
                      dot={false}
                    />
                  </AreaChart>
                ) : chart.type === "line" ? (
                  <LineChart data={sliced} margin={{ left: 0, right: 8, top: 4 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                    <YAxis tickLine={false} axisLine={false} width={40} fontSize={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      dataKey={chart.metric}
                      type="monotone"
                      stroke={color}
                      strokeWidth={2}
                      isAnimationActive={false}
                      dot={false}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={sliced} margin={{ left: 0, right: 8, top: 4 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                    <YAxis tickLine={false} axisLine={false} width={40} fontSize={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey={chart.metric} fill={color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                )}
              </ChartContainer>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {charts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold text-foreground">No charts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first chart to start visualizing your business data
          </p>
          <button
            type="button"
            onClick={addChart}
            className="mt-4 flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground"
          >
            <Plus className="h-4 w-4" />
            Add chart
          </button>
        </div>
      )}
    </div>
  )
}
