"use client"

import { useState } from "react"
import { X, Trash2, Plus, Webhook, FileSpreadsheet, Keyboard, Globe, Sheet, Zap, Workflow, ArrowDownLeft, ArrowUpRight, Settings2 } from "lucide-react"
import { actions, useWorkspace, type SchemaField, type KPIDefinition, type EngineType } from "@/lib/store"
import { ENGINE_TYPE_LABELS } from "@/lib/demo-data"

const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  paused: "#f59e0b",
  draft: "#94a3b8",
}

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  webhook: <Webhook className="h-4 w-4" />,
  csv: <FileSpreadsheet className="h-4 w-4" />,
  manual: <Keyboard className="h-4 w-4" />,
  api: <Globe className="h-4 w-4" />,
  "google-sheets": <Sheet className="h-4 w-4" />,
  zapier: <Zap className="h-4 w-4" />,
  n8n: <Workflow className="h-4 w-4" />,
}

const ENGINE_TYPES: { key: EngineType; label: string }[] = [
  { key: "cash", label: "Cash Engine" },
  { key: "projects", label: "Project Engine" },
  { key: "billing", label: "Billing Engine" },
  { key: "leads", label: "Lead Engine" },
  { key: "custom", label: "Custom Engine" },
]

const ENTITY_TYPES = ["client", "project", "task", "sale", "transaction"] as const

export function ProcessDetail({ processId }: { processId: string }) {
  const workspace = useWorkspace()
  const process = workspace.processes.find((p) => p.id === processId)
  const [activeTab, setActiveTab] = useState<"config" | "connectors" | "kpis">("config")
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(process?.name ?? "")

  if (!process) return null

  const config = process.config ?? { engineType: "custom" as EngineType, inputSchema: [], kpis: [], entityType: "client" as const }

  const tabs = [
    { key: "config" as const, label: "Configuration" },
    { key: "connectors" as const, label: "Connectors" },
    { key: "kpis" as const, label: "KPIs" },
  ]

  // Get connectors for this process
  const inConnectors = workspace.connectors.filter(c => c.to === processId)
  const outConnectors = workspace.connectors.filter(c => c.from === processId)

  const engineLabel = ENGINE_TYPE_LABELS[config.engineType] ?? "Engine"

  return (
    <div className="detail-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-extrabold uppercase"
            style={{ background: `${process.color}15`, color: process.color }}
          >
            {process.name.charAt(0)}
          </div>
          <div>
            {editingName ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => { actions.updateProcess(processId, { name }); setEditingName(false) }}
                onKeyDown={(e) => { if (e.key === "Enter") { actions.updateProcess(processId, { name }); setEditingName(false) } }}
                className="border-b border-brand bg-transparent text-base font-semibold outline-none"
                autoFocus
              />
            ) : (
              <h3 className="text-base font-semibold cursor-pointer hover:text-brand" onClick={() => setEditingName(true)}>
                {process.name}
              </h3>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLORS[process.status] }} />
              {engineLabel}
              <span>·</span>
              <span>{process.dataSources.length} sources</span>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => actions.closeProcessDetail()} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {process.description && (
        <p className="px-5 py-3 text-sm text-muted-foreground border-b border-border">{process.description}</p>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border px-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ─── Configuration Tab ─── */}
        {activeTab === "config" && (
          <div className="space-y-6">
            {/* Engine Type */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Engine Type</label>
              <div className="grid grid-cols-2 gap-2">
                {ENGINE_TYPES.map(et => (
                  <button
                    key={et.key}
                    type="button"
                    onClick={() => actions.updateProcess(processId, { config: { ...config, engineType: et.key } })}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                      config.engineType === et.key ? "border-brand bg-brand/5 text-brand" : "border-border hover:border-brand/30"
                    }`}
                  >
                    {et.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Entity Type */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Entity Type</label>
              <div className="flex flex-wrap gap-2">
                {ENTITY_TYPES.map(et => (
                  <button
                    key={et}
                    type="button"
                    onClick={() => actions.updateProcess(processId, { config: { ...config, entityType: et } })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                      config.entityType === et ? "bg-brand text-white" : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {et}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Schema */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Input Schema</label>
              <div className="space-y-2">
                {(config.inputSchema ?? []).map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl border border-border bg-surface p-3">
                    <code className="text-xs font-mono text-brand flex-1">{field.key}</code>
                    <span className="text-xs text-muted-foreground">{field.label}</span>
                    <span className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground uppercase">{field.type}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSchema = config.inputSchema.filter((_, i) => i !== idx)
                        actions.updateProcess(processId, { config: { ...config, inputSchema: newSchema } })
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newField: SchemaField = { key: `field_${Date.now()}`, label: "New Field", type: "string" }
                    actions.updateProcess(processId, { config: { ...config, inputSchema: [...(config.inputSchema ?? []), newField] } })
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand w-full"
                >
                  <Plus className="h-4 w-4" /> Add field
                </button>
              </div>
            </div>

            {/* Data Sources */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Data Sources</label>
              <div className="space-y-2">
                {process.dataSources.map((ds) => (
                  <div key={ds.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      {SOURCE_ICONS[ds.type] ?? <Globe className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ds.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{ds.type.replace("-", " ")}</p>
                    </div>
                    <button type="button" onClick={() => actions.removeDataSource(processId, ds.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => actions.toggleDataImport(true)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand w-full"
                >
                  <Plus className="h-4 w-4" /> Add data source
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Connectors Tab ─── */}
        {activeTab === "connectors" && (
          <div className="space-y-6">
            {/* Incoming */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownLeft className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Incoming Connectors</span>
              </div>
              {inConnectors.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">No incoming connectors</p>
              ) : (
                <div className="space-y-2">
                  {inConnectors.map(c => {
                    const fromProc = workspace.processes.find(p => p.id === c.from)
                    return (
                      <div key={c.id} className="rounded-xl border border-border bg-surface p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase" style={{ background: `${fromProc?.color ?? '#888'}15`, color: fromProc?.color }}>{fromProc?.name.charAt(0)}</div>
                            <span className="text-sm font-semibold">{c.name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">from {fromProc?.name}</span>
                        </div>
                        {c.dataFlowFields.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {c.dataFlowFields.map(f => (
                              <code key={f} className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">{f}</code>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Data Received */}
            {(process.incomingData?.length ?? 0) > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Data Received</span>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface">
                        {Object.keys(process.incomingData[0]).map(k => (
                          <th key={k} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {process.incomingData.slice(-5).map((row, i) => (
                        <tr key={i} className="border-b border-border/50">
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="px-3 py-2 text-xs font-mono">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Outgoing */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outgoing Connectors</span>
              </div>
              {outConnectors.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">No outgoing connectors</p>
              ) : (
                <div className="space-y-2">
                  {outConnectors.map(c => {
                    const toProc = workspace.processes.find(p => p.id === c.to)
                    return (
                      <div key={c.id} className="rounded-xl border border-border bg-surface p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">{c.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">to {toProc?.name}</span>
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase" style={{ background: `${toProc?.color ?? '#888'}15`, color: toProc?.color }}>{toProc?.name.charAt(0)}</div>
                          </div>
                        </div>
                        {c.dataFlowFields.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {c.dataFlowFields.map(f => (
                              <code key={f} className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">{f}</code>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── KPIs Tab ─── */}
        {activeTab === "kpis" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Define the KPIs that matter for this engine. These drive the charts in Intelligence.</p>
            {(config.kpis ?? []).map((kpi, idx) => {
              const lastRow = process.data[process.data.length - 1]
              const val = lastRow?.[kpi.field]
              return (
                <div key={kpi.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                  <div>
                    <p className="text-sm font-semibold">{kpi.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Field: <code className="font-mono text-brand">{kpi.field}</code> · {kpi.unit} · {kpi.direction === "up" ? "↑ Higher is better" : "↓ Lower is better"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {val !== undefined && (
                      <span className="text-lg font-extrabold">
                        {kpi.unit === "currency" ? `$${Number(val).toLocaleString()}` : kpi.unit === "percentage" ? `${val}%` : Number(val).toLocaleString()}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const newKpis = config.kpis.filter((_, i) => i !== idx)
                        actions.updateProcess(processId, { config: { ...config, kpis: newKpis } })
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
            <button
              type="button"
              onClick={() => {
                const newKpi: KPIDefinition = { id: `kpi-${Date.now()}`, name: "New KPI", field: "new_field", unit: "count", direction: "up" }
                actions.updateProcess(processId, { config: { ...config, kpis: [...(config.kpis ?? []), newKpi] } })
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand w-full"
            >
              <Plus className="h-4 w-4" /> Add KPI
            </button>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-border px-5 py-3 flex gap-2">
        <button
          type="button"
          onClick={() => actions.removeProcess(processId)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete engine
        </button>
      </div>
    </div>
  )
}
