"use client"

import { useState } from "react"
import { useWorkspace, actions } from "@/lib/store"
import { X, ArrowRight, Database, Trash2 } from "lucide-react"

interface ConnectionModalProps {
  connectionId: string
}

export function ConnectionModal({ connectionId }: ConnectionModalProps) {
  const workspace = useWorkspace()
  const connection = workspace.connections.find((c) => c.id === connectionId)
  
  // Initialize state with existing mappings
  const [mappings, setMappings] = useState<Array<{ from: string; to: string }>>(() => {
    if (!connection || !connection.schemaMapping) return [{ from: "", to: "" }]
    const entries = Object.entries(connection.schemaMapping)
    if (entries.length === 0) return [{ from: "", to: "" }]
    return entries.map(([from, to]) => ({ from, to }))
  })

  if (!connection) return null

  const fromNode = workspace.processes.find((p) => p.id === connection.from)
  const toNode = workspace.processes.find((p) => p.id === connection.to)

  if (!fromNode || !toNode) return null

  // In a real app, these would come from introspecting the data in the nodes
  const fromFields = ["id", "email", "status", "created_at", "total_amount", "project_id", "lead_id", "revenue"]
  const toFields = ["client_id", "project_id", "revenue", "source", "assigned_to", "status"]

  const handleSave = () => {
    const schemaMapping: Record<string, string> = {}
    mappings.forEach(m => {
      if (m.from && m.to) {
        schemaMapping[m.from] = m.to
      }
    })
    
    actions.updateConnection(connection.id, { schemaMapping })
    actions.openConnectionMapping(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-[600px] bg-surface rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-brand" />
            <h3 className="font-semibold">Data Mapping</h3>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
            onClick={() => actions.openConnectionMapping(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-8 text-sm">
            <div className="font-medium px-4 py-2 rounded-lg bg-background border border-border shadow-sm flex items-center gap-2">
              <span className="text-xl">{fromNode.icon}</span> {fromNode.name}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Transforms to</span>
              <ArrowRight className="h-5 w-5 text-brand" />
            </div>
            <div className="font-medium px-4 py-2 rounded-lg bg-background border border-border shadow-sm flex items-center gap-2">
              <span className="text-xl">{toNode.icon}</span> {toNode.name}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Map Fields</h4>
              <button 
                onClick={() => setMappings([...mappings, { from: "", to: "" }])}
                className="text-xs text-brand hover:text-brand/80 font-bold px-2 py-1 rounded bg-brand/10 transition-colors"
              >
                + Add Rule
              </button>
            </div>
            
            <div className="space-y-3">
              {mappings.map((mapping, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <select 
                    value={mapping.from}
                    onChange={(e) => {
                      const newMappings = [...mappings]
                      newMappings[idx].from = e.target.value
                      setMappings(newMappings)
                    }}
                    className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  >
                    <option value="">Select source field...</option>
                    {fromFields.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  
                  <select 
                    value={mapping.to}
                    onChange={(e) => {
                      const newMappings = [...mappings]
                      newMappings[idx].to = e.target.value
                      setMappings(newMappings)
                    }}
                    className="flex-1 h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow"
                  >
                    <option value="">Select target field...</option>
                    {toFields.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  
                  <button 
                    onClick={() => setMappings(mappings.filter((_, i) => i !== idx))}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {mappings.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                  No mapping rules defined. Data will pass through unchanged.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => actions.openConnectionMapping(null)}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface border border-border rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-bold bg-brand text-white rounded-lg hover:bg-[#D4006D] transition-colors shadow-sm"
          >
            Save Mapping
          </button>
        </div>
      </div>
    </div>
  )
}
