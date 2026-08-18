"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useWorkspace } from "@/lib/store"
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts"

export function MarkdownRenderer({ content }: { content: string }) {
  const workspace = useWorkspace()

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "")
          const lang = match ? match[1] : ""
          
          const isInline = !match
          
          if (!isInline && (lang === "chart" || lang === "metric")) {
            try {
              const config = JSON.parse(String(children).replace(/\n$/, ""))
              const process = workspace.processes.find(p => p.name.toLowerCase() === (config.engine || "").toLowerCase())
              
              if (!process) {
                return <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-bold my-4">Engine &quot;{config.engine}&quot; not found</div>
              }

              if (lang === "chart") {
                // Render Chart
                const ChartComp = config.type === "Line" ? LineChart : config.type === "Area" ? AreaChart : BarChart
                
                return (
                  <div className="my-6 p-6 rounded-xl border border-border bg-surface h-[340px] w-full">
                    <h3 className="text-sm font-bold mb-4">{config.title || `${process.name} Chart`}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <ChartComp data={process.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey={config.xAxis} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => typeof v === 'number' && v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                        <RechartsTooltip 
                          contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                          itemStyle={{ color: "var(--foreground)", fontWeight: 700 }}
                        />
                        {config.type === "Bar" ? (
                          <Bar dataKey={config.yAxis} fill="var(--brand)" radius={[4, 4, 0, 0]} />
                        ) : config.type === "Area" ? (
                          <Area type="monotone" dataKey={config.yAxis} fill="var(--brand)" stroke="var(--brand)" strokeWidth={2} />
                        ) : (
                          <Line type="monotone" dataKey={config.yAxis} stroke="var(--brand)" strokeWidth={2} />
                        )}
                      </ChartComp>
                    </ResponsiveContainer>
                  </div>
                )
              } else if (lang === "metric") {
                // Render comparative metric box
                const data = process.data
                const current = data.length > 0 ? Number(data[data.length - 1][config.field] ?? 0) : 0
                const previous = data.length > 1 ? Number(data[data.length - 2][config.field] ?? current) : current
                
                const delta = previous !== 0 ? ((current - previous) / previous * 100) : 0
                const trend = delta >= 0 ? "up" : "down"
                
                return (
                  <div className="my-4 p-5 rounded-2xl border border-border bg-surface inline-block min-w-[220px] shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{config.title || config.field}</p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="text-3xl font-black tracking-tight">{current.toLocaleString()}</span>
                      <span className={`text-sm font-bold flex items-center gap-1 ${trend === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"} px-1.5 py-0.5 rounded-md`}>
                        {trend === "up" ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">vs previous {config.period || "period"}</p>
                  </div>
                )
              }
            } catch (e) {
              return <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-mono whitespace-pre-wrap my-4">Invalid {lang} JSON configuration: {String(e)}</div>
            }
          }
          
          return (
            <code className={`${className} bg-surface border border-border px-1.5 py-0.5 rounded-md text-[0.85em] font-mono`} {...props}>
              {children}
            </code>
          )
        },
        h1: ({children}) => <h1 className="text-3xl font-black mt-8 mb-6 tracking-tight">{children}</h1>,
        h2: ({children}) => <h2 className="text-xl font-bold mt-8 mb-4 tracking-tight border-b border-border pb-2">{children}</h2>,
        h3: ({children}) => <h3 className="text-lg font-bold mt-6 mb-3">{children}</h3>,
        p: ({children}) => <p className="mb-4 leading-relaxed text-foreground/90 text-sm">{children}</p>,
        ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1.5 text-sm">{children}</ul>,
        ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-sm">{children}</ol>,
        li: ({children}) => <li>{children}</li>,
        blockquote: ({children}) => <blockquote className="border-l-4 border-brand/50 pl-4 italic text-muted-foreground my-4 bg-surface/50 py-2 rounded-r-lg">{children}</blockquote>,
        table: ({children}) => <div className="w-full overflow-auto mb-6 rounded-xl border border-border"><table className="w-full text-left border-collapse text-sm">{children}</table></div>,
        th: ({children}) => <th className="border-b border-border py-3 px-4 font-bold bg-surface text-muted-foreground uppercase tracking-wider text-[11px]">{children}</th>,
        td: ({children}) => <td className="border-b border-border py-3 px-4 text-sm bg-background">{children}</td>,
        hr: () => <hr className="my-8 border-border" />
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
