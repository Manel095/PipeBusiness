"use client"

import { useWorkspace, type WidgetConfig } from "@/lib/store"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

export function WidgetRenderer({ widget }: { widget: WidgetConfig }) {
  const workspace = useWorkspace()
  const process = workspace.processes.find(p => p.name.toLowerCase() === (widget.engine || "").toLowerCase())

  if (!process) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-bold text-center">
        Engine "{widget.engine}" not found
      </div>
    )
  }

  if (widget.type === "chart") {
    const ChartComp = widget.chartType === "Line" ? LineChart : widget.chartType === "Area" ? AreaChart : BarChart
    return (
      <div className="flex h-full w-full flex-col p-4">
        <h3 className="text-sm font-bold mb-4">{widget.title || `${process.name} Chart`}</h3>
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComp data={process.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey={widget.xAxis} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => typeof v === 'number' && v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <RechartsTooltip 
                contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                itemStyle={{ color: "var(--foreground)", fontWeight: 700 }}
              />
              {widget.chartType === "Bar" ? (
                <Bar dataKey={widget.yAxis} fill="var(--brand)" radius={[4, 4, 0, 0]} />
              ) : widget.chartType === "Area" ? (
                <Area type="monotone" dataKey={widget.yAxis} fill="var(--brand)" stroke="var(--brand)" strokeWidth={2} />
              ) : (
                <Line type="monotone" dataKey={widget.yAxis} stroke="var(--brand)" strokeWidth={2} />
              )}
            </ChartComp>
          </ResponsiveContainer>
        </div>
      </div>
    )
  } else if (widget.type === "metric") {
    const data = process.data
    const current = data.length > 0 ? Number(data[data.length - 1][widget.field!] ?? 0) : 0
    const previous = data.length > 1 ? Number(data[data.length - 2][widget.field!] ?? current) : current
    
    const delta = previous !== 0 ? ((current - previous) / previous * 100) : 0
    const trend = delta >= 0 ? "up" : "down"
    
    return (
      <div className="flex h-full w-full flex-col justify-center p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{widget.title || widget.field}</p>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-3xl font-black tracking-tight">{current.toLocaleString()}</span>
          <span className={`text-sm font-bold flex items-center gap-1 ${trend === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"} px-1.5 py-0.5 rounded-md`}>
            {trend === "up" ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">vs previous {widget.period || "period"}</p>
      </div>
    )
  }

  return null
}
