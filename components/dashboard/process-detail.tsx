"use client"

import { useState } from "react"
import { X, Trash2, Plus, Webhook, FileSpreadsheet, Keyboard, Globe, Sheet, Zap, Workflow } from "lucide-react"
import { actions, useWorkspace } from "@/lib/store"

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

export function ProcessDetail({ processId }: { processId: string }) {
  const workspace = useWorkspace()
  const process = workspace.processes.find((p) => p.id === processId)
  const [activeTab, setActiveTab] = useState<"sources" | "entities" | "data" | "metrics">("sources")
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(process?.name ?? "")

  if (!process) return null

  const tabs = [
    { key: "sources" as const, label: "Data Sources" },
    { key: "entities" as const, label: "Entities" },
    { key: "data" as const, label: "Data Preview" },
    { key: "metrics" as const, label: "Metrics" },
  ]

  // Get last 10 rows for preview
  const previewData = process.data.slice(-10)
  const columns = previewData.length > 0 ? Object.keys(previewData[0]) : []

  // Compute basic metrics
  const numericCols = columns.filter((c) => c !== "date" && typeof previewData[0]?.[c] === "number")
  const metrics = numericCols.map((col) => {
    const values = process.data.map((r) => Number(r[col]))
    const latest = values[values.length - 1] ?? 0
    const prev = values[values.length - 2] ?? latest
    const delta = prev !== 0 ? ((latest - prev) / prev) * 100 : 0
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return { col, latest, delta, avg }
  })

  return (
    <div className="detail-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
            style={{ background: `${process.color}15` }}
          >
            {process.icon}
          </div>
          <div>
            {editingName ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  actions.updateProcess(processId, { name })
                  setEditingName(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    actions.updateProcess(processId, { name })
                    setEditingName(false)
                  }
                }}
                className="border-b border-brand bg-transparent text-base font-semibold outline-none"
                autoFocus
              />
            ) : (
              <h3
                className="text-base font-semibold cursor-pointer hover:text-brand"
                onClick={() => setEditingName(true)}
              >
                {process.name}
              </h3>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: STATUS_COLORS[process.status] }}
              />
              {process.status}
              <span>·</span>
              <span>{process.data.length} rows</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => actions.closeProcessDetail()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Description */}
      {process.description && (
        <p className="px-5 py-3 text-sm text-muted-foreground border-b border-border">
          {process.description}
        </p>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border px-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "sources" && (
          <div className="flex flex-col gap-3">
            {process.dataSources.map((ds) => (
              <div
                key={ds.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  {SOURCE_ICONS[ds.type] ?? <Globe className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ds.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{ds.type.replace("-", " ")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => actions.removeDataSource(processId, ds.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => actions.toggleDataImport(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <Plus className="h-4 w-4" />
              Add data source
            </button>
          </div>
        )}

        {activeTab === "entities" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Track entity lifecycle (Clients → Projects → Tasks) flowing through this engine.
            </p>
            <div className="space-y-3">
              {/* Mock Entities */}
              {["Client: Onabitz", "Client: Acme Corp", "Client: Globex"].map((client, i) => (
                <div key={client} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-foreground">{client}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand">Active</span>
                  </div>
                  
                  {i === 0 && (
                    <div className="mt-3 pl-3 border-l-2 border-border/50 space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">↳ Project: Website Redesign</div>
                      <div className="pl-4 space-y-1">
                        <div className="text-xs flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-foreground">Design wireframes</span>
                          <span className="text-muted-foreground ml-auto">ClickUp</span>
                        </div>
                        <div className="text-xs flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-brand"></div>
                          <span className="text-foreground">Frontend development</span>
                          <span className="text-muted-foreground ml-auto">ClickUp</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="overflow-x-auto">
            {previewData.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {col.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-surface">
                      {columns.map((col) => (
                        <td key={col} className="px-3 py-2 text-foreground">
                          {typeof row[col] === "number" ? Number(row[col]).toLocaleString() : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No data yet. Add a data source to get started.</p>
            )}
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="flex flex-col gap-3">
            {metrics.map((m) => (
              <div
                key={m.col}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                    {m.col.replace(/_/g, " ")}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-foreground">
                    {m.latest.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      m.delta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.delta >= 0 ? "+" : ""}{m.delta.toFixed(1)}%
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    avg: {m.avg.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
            {metrics.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No numeric data available for metrics.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-border px-5 py-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            actions.removeProcess(processId)
          }}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete process
        </button>
      </div>
    </div>
  )
}
