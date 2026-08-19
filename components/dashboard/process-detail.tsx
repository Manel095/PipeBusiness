"use client"

import { useState } from "react"
import { X, Trash2, Plus, Webhook, FileSpreadsheet, Keyboard, Globe, Sheet, Zap, Workflow, ArrowDownLeft, ArrowUpRight, Settings2, Calculator } from "lucide-react"
import { actions, useWorkspace, type SchemaField, type KPIDefinition } from "@/lib/store"
import { evaluateFormula, extractFormulaFields } from "@/lib/formula"

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

const PRESET_ENGINE_TYPES = ["Cash Engine", "Project Engine", "Billing Engine", "Lead Engine", "Custom Engine"]
const PRESET_ENTITY_TYPES = ["client", "project", "task", "sale", "transaction"]

export function ProcessDetail({ processId }: { processId: string }) {
  const workspace = useWorkspace()
  const process = workspace.processes.find((p) => p.id === processId)
  const [activeTab, setActiveTab] = useState<"config" | "connectors" | "kpis">("config")
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(process?.name ?? "")

  if (!process) return null

  const config = process.config ?? { engineType: "Custom Engine", inputSchema: [], kpis: [], entityType: "client" }

  const tabs = [
    { key: "config" as const, label: "Configuration" },
    { key: "connectors" as const, label: "Connectors" },
    { key: "kpis" as const, label: "KPIs" },
  ]

  // Get connectors for this process
  const inConnectors = workspace.connectors.filter(c => c.to === processId)
  const outConnectors = workspace.connectors.filter(c => c.from === processId)

  const engineLabel = config.engineType || "Engine"

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
              <input
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand mb-3"
                value={config.engineType}
                onChange={(e) => actions.updateProcess(processId, { config: { ...config, engineType: e.target.value } })}
                placeholder="e.g. Lead Engine"
              />
              <div className="flex flex-wrap gap-2">
                {PRESET_ENGINE_TYPES.map(et => (
                  <button
                    key={et}
                    type="button"
                    onClick={() => actions.updateProcess(processId, { config: { ...config, engineType: et } })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      config.engineType === et ? "bg-brand text-white" : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {et}
                  </button>
                ))}
              </div>
            </div>

            {/* Entity Type */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Entity Type</label>
              <input
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand mb-3"
                value={config.entityType}
                onChange={(e) => actions.updateProcess(processId, { config: { ...config, entityType: e.target.value } })}
                placeholder="e.g. client, project..."
              />
              <div className="flex flex-wrap gap-2">
                {PRESET_ENTITY_TYPES.map(et => (
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
                    <input
                      className="text-xs font-mono text-brand bg-transparent border-b border-dashed border-border outline-none w-28"
                      value={field.key}
                      onChange={(e) => {
                        const newSchema = [...config.inputSchema];
                        newSchema[idx] = { ...field, key: e.target.value };
                        actions.updateProcess(processId, { config: { ...config, inputSchema: newSchema } });
                      }}
                      placeholder="key"
                    />
                    <input
                      className="text-xs text-foreground bg-transparent border-b border-dashed border-border outline-none flex-1"
                      value={field.label}
                      onChange={(e) => {
                        const newSchema = [...config.inputSchema];
                        newSchema[idx] = { ...field, label: e.target.value };
                        actions.updateProcess(processId, { config: { ...config, inputSchema: newSchema } });
                      }}
                      placeholder="Label"
                    />
                    <select
                      className="text-[10px] bg-background border border-border px-1 py-0.5 rounded text-muted-foreground uppercase outline-none"
                      value={field.type}
                      onChange={(e) => {
                        const newSchema = [...config.inputSchema];
                        newSchema[idx] = { ...field, type: e.target.value as any };
                        actions.updateProcess(processId, { config: { ...config, inputSchema: newSchema } });
                      }}
                    >
                      <option value="string">STRING</option>
                      <option value="number">NUMBER</option>
                      <option value="date">DATE</option>
                      <option value="currency">CURRENCY</option>
                      <option value="boolean">BOOLEAN</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const newSchema = config.inputSchema.filter((_, i) => i !== idx)
                        actions.updateProcess(processId, { config: { ...config, inputSchema: newSchema } })
                      }}
                      className="text-muted-foreground hover:text-destructive ml-1"
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
              const isCalculated = !!kpi.formula
              const val = isCalculated && lastRow
                ? evaluateFormula(kpi.formula!, lastRow)
                : lastRow?.[kpi.field]
              return (
                <div key={kpi.id} className={`flex flex-col gap-3 rounded-xl border bg-surface p-4 ${isCalculated ? 'border-border' : 'border-border'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center gap-2">
                        {isCalculated && <Calculator className="h-4 w-4 text-muted-foreground" />}
                        <input
                          className="text-sm font-semibold bg-transparent border-b border-dashed border-border outline-none w-full max-w-[200px]"
                          value={kpi.name}
                          onChange={(e) => {
                            const newKpis = [...config.kpis];
                            newKpis[idx] = { ...kpi, name: e.target.value };
                            actions.updateProcess(processId, { config: { ...config, kpis: newKpis } });
                          }}
                          placeholder="KPI Name"
                        />
                      </div>

                      {isCalculated ? (
                        <div className="mt-2 space-y-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Formula:</span>
                            <input
                              className="ml-2 text-xs font-mono text-foreground bg-background border border-border rounded-lg px-2 py-1 outline-none w-56 focus:border-foreground/30"
                              value={kpi.formula || ""}
                              onChange={(e) => {
                                const newKpis = [...config.kpis];
                                const fields = extractFormulaFields(e.target.value);
                                newKpis[idx] = { ...kpi, formula: e.target.value, formulaFields: fields };
                                actions.updateProcess(processId, { config: { ...config, kpis: newKpis } });
                              }}
                              placeholder="leads - deals_won"
                            />
                          </div>
                          {kpi.formulaFields && kpi.formulaFields.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {kpi.formulaFields.map(f => (
                                <code key={f} className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">{f}</code>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              className="text-xs bg-transparent border-b border-dashed border-border outline-none text-muted-foreground"
                              value={kpi.unit}
                              onChange={(e) => {
                                const newKpis = [...config.kpis];
                                newKpis[idx] = { ...kpi, unit: e.target.value as any };
                                actions.updateProcess(processId, { config: { ...config, kpis: newKpis } });
                              }}
                            >
                              <option value="count">Count</option>
                              <option value="currency">Currency</option>
                              <option value="percentage">Percentage</option>
                              <option value="time">Time</option>
                            </select>
                            <select
                              className="text-xs bg-transparent border-b border-dashed border-border outline-none text-muted-foreground"
                              value={kpi.direction}
                              onChange={(e) => {
                                const newKpis = [...config.kpis];
                                newKpis[idx] = { ...kpi, direction: e.target.value as any };
                                actions.updateProcess(processId, { config: { ...config, kpis: newKpis } });
                              }}
                            >
                              <option value="up">↑ Higher is better</option>
                              <option value="down">↓ Lower is better</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">Field:</span>
                          <input
                            className="text-xs font-mono text-foreground bg-transparent border-b border-dashed border-border outline-none w-20"
                            value={kpi.field}
                            onChange={(e) => {
                              const newKpis = [...config.kpis];
                              newKpis[idx] = { ...kpi, field: e.target.value };
                              actions.updateProcess(processId, { config: { ...config, kpis: newKpis } });
                            }}
                            placeholder="field_key"
                          />
                          <select
                            className="text-xs bg-transparent border-b border-dashed border-border outline-none text-muted-foreground"
                            value={kpi.unit}
                            onChange={(e) => {
                              const newKpis = [...config.kpis];
                              newKpis[idx] = { ...kpi, unit: e.target.value as any };
                              actions.updateProcess(processId, { config: { ...config, kpis: newKpis } });
                            }}
                          >
                            <option value="count">Count</option>
                            <option value="currency">Currency</option>
                            <option value="percentage">Percentage</option>
                            <option value="time">Time</option>
                          </select>
                          <select
                            className="text-xs bg-transparent border-b border-dashed border-border outline-none text-muted-foreground"
                            value={kpi.direction}
                            onChange={(e) => {
                              const newKpis = [...config.kpis];
                              newKpis[idx] = { ...kpi, direction: e.target.value as any };
                              actions.updateProcess(processId, { config: { ...config, kpis: newKpis } });
                            }}
                          >
                            <option value="up">↑ Higher is better</option>
                            <option value="down">↓ Lower is better</option>
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {val !== undefined && !isNaN(Number(val)) && (
                        <span className="text-lg font-extrabold text-foreground bg-background px-2 py-1 rounded-lg border border-border">
                          {kpi.unit === "currency" ? `$${Number(val).toLocaleString()}` : kpi.unit === "percentage" ? `${Number(val).toFixed(1)}%` : Number(val).toLocaleString()}
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
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Available fields hint */}
            {process.data.length > 0 && (
              <div className="rounded-xl border border-border bg-background p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">Available fields for formulas</span>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(process.data[0]).filter(k => k !== "date").map(k => (
                    <code key={k} className="text-[10px] bg-surface border border-border px-1.5 py-0.5 rounded font-mono text-foreground">{k}</code>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const newKpi: KPIDefinition = { id: `kpi-${Date.now()}`, name: "New KPI", field: "new_field", unit: "count", direction: "up" }
                  actions.updateProcess(processId, { config: { ...config, kpis: [...(config.kpis ?? []), newKpi] } })
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground flex-1"
              >
                <Plus className="h-4 w-4" /> Add KPI
              </button>
              <button
                type="button"
                onClick={() => {
                  const newKpi: KPIDefinition = {
                    id: `kpi-${Date.now()}`,
                    name: "Calculated KPI",
                    field: "_calculated",
                    unit: "count",
                    direction: "up",
                    formula: "",
                    formulaFields: [],
                  }
                  actions.updateProcess(processId, { config: { ...config, kpis: [...(config.kpis ?? []), newKpi] } })
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground flex-1"
              >
                <Calculator className="h-4 w-4" /> Add Calculated KPI
              </button>
            </div>
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
