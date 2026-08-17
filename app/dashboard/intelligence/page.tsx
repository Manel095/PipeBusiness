"use client"

import { useState, useMemo } from "react"
import { useWorkspace } from "@/lib/store"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, AlertCircle, Activity, ArrowRight } from "lucide-react"

const TIME_RANGES = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
]

export default function IntelligencePage() {
  const workspace = useWorkspace()
  const [timeRange, setTimeRange] = useState("30d")
  const days = TIME_RANGES.find((t) => t.key === timeRange)?.days ?? 30

  // 1. Calculate Conversion Rates based on Connections
  const conversions = useMemo(() => {
    return workspace.connections.map(conn => {
      const fromProc = workspace.processes.find(p => p.id === conn.from)
      const toProc = workspace.processes.find(p => p.id === conn.to)
      
      if (!fromProc || !toProc || fromProc.data.length === 0 || toProc.data.length === 0) return null

      // Get data for the selected time range
      const fromData = fromProc.data.slice(-days)
      const toData = toProc.data.slice(-days)

      // Naive primary metric selection (first non-date key)
      const fromMetric = Object.keys(fromData[0]).find(k => k !== "date") || ""
      const toMetric = Object.keys(toData[0]).find(k => k !== "date") || ""

      // Sum volumes
      const fromTotal = fromData.reduce((acc, row) => acc + Number(row[fromMetric] || 0), 0)
      const toTotal = toData.reduce((acc, row) => acc + Number(row[toMetric] || 0), 0)

      const conversionRate = fromTotal > 0 ? (toTotal / fromTotal) * 100 : 0
      
      // Dynamic threshold: If conversion is < 15%, flag as bottleneck
      const isBottleneck = conversionRate < 15 && fromTotal > 0

      return {
        id: conn.id,
        fromProc,
        toProc,
        fromMetric,
        toMetric,
        fromTotal,
        toTotal,
        conversionRate,
        isBottleneck
      }
    }).filter(Boolean) as any[]
  }, [workspace.connections, workspace.processes, days])

  // 2. Aggregate Entity Flow Trends (Primary charts)
  const charts = useMemo(() => {
    return workspace.processes.map(proc => {
      if (proc.data.length === 0) return null
      const sliced = proc.data.slice(-days)
      const primaryMetric = Object.keys(sliced[0]).find(k => k !== "date") || ""
      
      // Calculate delta
      const latest = Number(sliced[sliced.length - 1]?.[primaryMetric] ?? 0)
      const prev = Number(sliced[0]?.[primaryMetric] ?? latest)
      const delta = prev !== 0 ? ((latest - prev) / prev) * 100 : 0

      return { proc, primaryMetric, data: sliced, latest, delta }
    }).filter(Boolean) as any[]
  }, [workspace.processes, days])

  return (
    <div className="h-full overflow-y-auto bg-surface/30">
      {/* Header */}
      <div className="border-b border-border bg-background px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Business Intelligence</h1>
          <p className="mt-2 text-muted-foreground">
            Dynamic bottleneck analysis and entity flow across your connected processes.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {TIME_RANGES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTimeRange(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                timeRange === t.key
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-10">

        {/* Conversion Analysis Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-brand" />
            <h2 className="text-xl font-bold">Conversion Analysis</h2>
          </div>
          
          {conversions.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-10 text-center bg-background">
              <p className="text-muted-foreground">Connect processes in the workspace to see conversion bottlenecks.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversions.map(conv => (
                <div key={conv.id} className={`rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md ${conv.isBottleneck ? 'border-red-500/30' : 'border-border'}`}>
                  
                  {/* Nodes header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface border border-border text-lg shadow-sm">
                        {conv.fromProc.icon}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface border border-border text-lg shadow-sm">
                        {conv.toProc.icon}
                      </div>
                    </div>
                    {conv.isBottleneck ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" /> Bottleneck
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <TrendingUp className="w-3.5 h-3.5" /> Healthy
                      </span>
                    )}
                  </div>

                  {/* Flow Data */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground capitalize">{conv.fromMetric.replace(/_/g, " ")} (In)</span>
                      <span className="font-bold">{conv.fromTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground capitalize">{conv.toMetric.replace(/_/g, " ")} (Out)</span>
                      <span className="font-bold">{conv.toTotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-sm font-semibold">Conversion Rate</span>
                      <span className={`text-2xl font-extrabold ${conv.isBottleneck ? 'text-red-500' : 'text-emerald-600'}`}>
                        {conv.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Entity Flow Trends */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-brand" />
            <h2 className="text-xl font-bold">Entity Flow Trends</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {charts.map(chart => (
              <div key={chart.proc.id} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-border text-xl">
                      {chart.proc.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{chart.proc.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize tracking-wide">{chart.primaryMetric.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold">{chart.latest.toLocaleString()}</div>
                    <div className={`text-xs font-bold flex items-center justify-end gap-1 ${chart.delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {chart.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(chart.delta).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="h-48 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chart.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`gradient-${chart.proc.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chart.proc.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={chart.proc.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)' }}
                        itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                        labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={chart.primaryMetric} 
                        stroke={chart.proc.color} 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill={`url(#gradient-${chart.proc.id})`} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
