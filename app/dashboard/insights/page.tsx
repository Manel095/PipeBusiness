"use client"

import { useState } from "react"
import { useWorkspace, actions, type InsightDashboard, type WidgetConfig } from "@/lib/store"
import { Plus, Trash2, Database, LayoutDashboard, Settings } from "lucide-react"
import { Layout } from "react-grid-layout"
import GridLayout, { WidthProvider } from "react-grid-layout/legacy"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { WidgetRenderer } from "@/components/dashboard/widget-renderer"

const ResponsiveGridLayout = WidthProvider(GridLayout)

export default function InsightsPage() {
  const workspace = useWorkspace()
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null)
  
  const insights = workspace.insights ?? []
  const selectedDashboard = insights.find(i => i.id === selectedDashboardId)

  const createDashboard = () => {
    const id = `insight-${Date.now()}`
    actions.addInsight({
      id,
      title: "New Dashboard",
      widgets: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    setSelectedDashboardId(id)
  }

  const deleteDashboard = (id: string) => {
    if (selectedDashboardId === id) setSelectedDashboardId(null)
    actions.removeInsight(id)
  }

  const onLayoutChange = (newLayout: Layout) => {
    if (!selectedDashboardId || !selectedDashboard) return
    // Optimistic merge
    newLayout.forEach(layoutItem => {
      const widgetId = layoutItem.i
      const widget = selectedDashboard.widgets.find(w => w.id === widgetId)
      if (widget) {
        // Only update if changed
        if (
          widget.layout?.x !== layoutItem.x || 
          widget.layout?.y !== layoutItem.y || 
          widget.layout?.w !== layoutItem.w || 
          widget.layout?.h !== layoutItem.h
        ) {
          actions.updateWidget(selectedDashboardId, widgetId, {
            layout: { x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h }
          })
        }
      }
    })
  }

  const addWidget = (widget: Omit<WidgetConfig, "id">) => {
    if (!selectedDashboardId) return
    const id = `widget-${Date.now()}`
    
    // Auto-layout: find a good spot (simple append to bottom)
    // React-grid-layout auto-places it if x,y are undefined or overlapping, but let's give it basic dimensions
    const newWidget: WidgetConfig = {
      ...widget,
      id,
      layout: { x: 0, y: Infinity, w: widget.type === "chart" ? 6 : 3, h: widget.type === "chart" ? 3 : 1 }
    }
    
    actions.addWidget(selectedDashboardId, newWidget)
  }

  const insertMetricBlock = (engine: string, field: string, title: string) => {
    addWidget({ type: "metric", engine, field, title, period: "month" })
  }

  const insertChartBlock = (engine: string, yAxis: string, title: string) => {
    addWidget({ type: "chart", engine, chartType: "Line", title: `${title} Trend`, xAxis: "date", yAxis })
  }

  const removeWidget = (widgetId: string) => {
    if (!selectedDashboardId) return
    actions.removeWidget(selectedDashboardId, widgetId)
  }

  return (
    <div className="h-full flex">
      {/* Sidebar — Dashboards list */}
      <div className="w-72 border-r border-border bg-surface/50 flex flex-col h-full">
        <div className="px-4 py-4 border-b border-border">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Dashboards</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {insights.length === 0 && (
            <p className="text-xs text-muted-foreground px-3 py-6 text-center">No dashboards yet. Create one to get started.</p>
          )}
          {insights.map(i => (
            <div key={i.id} className="relative group">
              <button
                type="button"
                onClick={() => setSelectedDashboardId(i.id)}
                className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors ${
                  selectedDashboardId === i.id ? "bg-brand/10 text-brand" : "text-foreground hover:bg-background"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-sm font-medium truncate pr-6">{i.title}</span>
                </div>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteDashboard(i.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3 space-y-2">
          <button
            type="button"
            onClick={createDashboard}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Dashboard
          </button>
        </div>
      </div>

      {/* Main — Grid */}
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
        {selectedDashboard ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-3 bg-background z-10">
              <input
                value={selectedDashboard.title}
                onChange={e => actions.updateInsight(selectedDashboard.id, { title: e.target.value })}
                className="text-lg font-bold bg-transparent outline-none flex-1 mr-4 text-foreground placeholder:text-muted-foreground"
                placeholder="Dashboard title..."
              />
            </div>

            {/* Grid and Library */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 bg-surface/30">
                {selectedDashboard.widgets.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground text-sm font-medium">Add widgets from the Data Library on the right</p>
                  </div>
                ) : (
                  <ResponsiveGridLayout
                    className="layout"
                    layout={selectedDashboard.widgets.map(w => ({
                      i: w.id,
                      x: w.layout?.x ?? 0,
                      y: w.layout?.y ?? Infinity,
                      w: w.layout?.w ?? 4,
                      h: w.layout?.h ?? (w.type === "chart" ? 3 : 1)
                    }))}
                    cols={12}
                    rowHeight={100}
                    onLayoutChange={onLayoutChange}
                    draggableHandle=".drag-handle"
                    margin={[16, 16]}
                  >
                    {selectedDashboard.widgets.map(widget => (
                      <div key={widget.id} className="bg-background border border-border rounded-xl shadow-sm relative group overflow-hidden">
                        <div className="drag-handle absolute top-0 left-0 w-full h-4 cursor-grab active:cursor-grabbing bg-transparent z-10 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                           <div className="w-12 h-1 bg-border rounded-full" />
                        </div>
                        <button 
                          onClick={() => removeWidget(widget.id)}
                          className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="h-full pt-2">
                          <WidgetRenderer widget={widget} />
                        </div>
                      </div>
                    ))}
                  </ResponsiveGridLayout>
                )}
              </div>

              {/* Data Library */}
              <div className="w-72 border-l border-border bg-background flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-border bg-surface/30">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Database className="w-4 h-4" /> Data Library
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Click to add to dashboard.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {workspace.processes.map(proc => (
                    <div key={proc.id} className="border border-border rounded-xl p-3 bg-surface">
                      <h4 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: proc.color }}>
                        <span className="w-4 h-4 rounded text-[8px] flex items-center justify-center font-black" style={{ background: `${proc.color}20` }}>{proc.name.charAt(0)}</span>
                        {proc.name}
                      </h4>
                      
                      {(proc.config?.kpis?.length ?? 0) > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Metrics</p>
                          <div className="flex flex-col gap-1">
                            {proc.config.kpis.map(kpi => (
                              <button
                                key={kpi.id}
                                onClick={() => insertMetricBlock(proc.name, kpi.field, kpi.name)}
                                className="text-left text-[11px] font-medium px-2 py-1.5 hover:bg-background border border-transparent hover:border-border rounded-lg flex items-center gap-2 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-muted-foreground" /> {kpi.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {(proc.config?.inputSchema?.length ?? 0) > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Charts</p>
                          <div className="flex flex-col gap-1">
                            {proc.config.inputSchema.filter(f => f.type === "number" || f.type === "currency").map(f => (
                              <button
                                key={f.key}
                                onClick={() => insertChartBlock(proc.name, f.key, f.label)}
                                className="text-left text-[11px] font-medium px-2 py-1.5 hover:bg-background border border-transparent hover:border-border rounded-lg flex items-center gap-2 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-muted-foreground" /> {f.label} Trend
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <LayoutDashboard className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold text-foreground">Custom Dashboards</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Create responsive visual dashboards using live data from your engines.
            </p>
            <button
              type="button"
              onClick={createDashboard}
              className="mt-6 flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Your First Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
