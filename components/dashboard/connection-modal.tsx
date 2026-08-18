"use client"

import { useState } from "react"
import { X, Save, ArrowRight, Trash2 } from "lucide-react"
import { actions, useWorkspace } from "@/lib/store"

export function ConnectionModal({ connectionId }: { connectionId: string }) {
  const workspace = useWorkspace()
  const connector = workspace.connectors.find(c => c.id === connectionId)
  const fromProc = workspace.processes.find(p => p.id === connector?.from)
  const toProc = workspace.processes.find(p => p.id === connector?.to)

  const [name, setName] = useState(connector?.name ?? "")
  const [selectedFields, setSelectedFields] = useState<string[]>(connector?.dataFlowFields ?? [])

  if (!connector || !fromProc || !toProc) return null

  // Available fields from source engine's schema
  const sourceFields = fromProc.config?.inputSchema?.map(f => f.key) ?? []
  // Also include data keys
  const dataKeys = (fromProc.data?.length ?? 0) > 0 ? Object.keys(fromProc.data[0]).filter(k => k !== "date") : []
  const allFields = [...new Set([...sourceFields, ...dataKeys])]

  const toggleField = (field: string) => {
    setSelectedFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field])
  }

  const handleSave = () => {
    actions.updateConnector(connectionId, { name, dataFlowFields: selectedFields })
    actions.openConnectorModal(null)
  }

  return (
    <div className="command-palette-overlay" onClick={() => actions.openConnectorModal(null)}>
      <div className="command-palette" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-bold text-base">Edit Connector</h3>
          <button type="button" onClick={() => actions.openConnectorModal(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Flow visualization */}
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold uppercase" style={{ background: `${fromProc.color}15`, color: fromProc.color }}>
                {fromProc.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold">{fromProc.name}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-brand" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold uppercase" style={{ background: `${toProc.color}15`, color: toProc.color }}>
                {toProc.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold">{toProc.name}</span>
            </div>
          </div>

          {/* Connector Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Connector Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Lead Handoff"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          {/* Field Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Fields to pass ({selectedFields.length} selected)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {allFields.map(field => (
                <button
                  key={field}
                  type="button"
                  onClick={() => toggleField(field)}
                  className={`rounded-lg border px-3 py-2 text-xs font-mono text-left transition-colors ${
                    selectedFields.includes(field)
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-border text-muted-foreground hover:border-brand/30"
                  }`}
                >
                  {field}
                </button>
              ))}
              {allFields.length === 0 && (
                <p className="col-span-2 text-sm text-muted-foreground py-4 text-center">No schema fields defined on source engine.</p>
              )}
            </div>
          </div>

          {/* Preview */}
          {selectedFields.length > 0 && (
            <div className="rounded-xl bg-surface border border-border p-3">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Data Flow Preview</p>
              <p className="text-xs text-foreground">
                When <strong>{fromProc.name}</strong> sends data → <strong>{toProc.name}</strong> will receive:{" "}
                {selectedFields.map((f, i) => (
                  <span key={f}>
                    <code className="text-brand font-mono">{f}</code>
                    {i < selectedFields.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3 flex justify-between">
          <button
            type="button"
            onClick={() => { actions.removeConnector(connectionId); actions.openConnectorModal(null) }}
            className="flex items-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl px-3 py-2"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            <Save className="h-3.5 w-3.5" /> Save Connector
          </button>
        </div>
      </div>
    </div>
  )
}
