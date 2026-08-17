"use client"

import { useWorkspace, actions } from "@/lib/store"
import { X, ArrowRight, Database } from "lucide-react"

interface ConnectionModalProps {
  connectionId: string
}

export function ConnectionModal({ connectionId }: ConnectionModalProps) {
  const workspace = useWorkspace()
  const connection = workspace.connections.find((c) => c.id === connectionId)
  if (!connection) return null

  const fromNode = workspace.processes.find((p) => p.id === connection.from)
  const toNode = workspace.processes.find((p) => p.id === connection.to)

  if (!fromNode || !toNode) return null

  // Mock available fields for the demo
  const fromFields = ["id", "email", "status", "created_at", "total_amount", "project_id"]
  const toFields = ["client_id", "project_id", "revenue", "source", "assigned_to"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-[500px] bg-surface rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-brand" />
            <h3 className="font-semibold">Data Mapping</h3>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"
            onClick={() => actions.openConnectionMapping(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6 text-sm">
            <div className="font-medium px-3 py-1.5 rounded-md bg-muted/50 border border-border">
              {fromNode.icon} {fromNode.name}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="font-medium px-3 py-1.5 rounded-md bg-muted/50 border border-border">
              {toNode.icon} {toNode.name}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Map Fields</h4>
            
            {/* Field Mapping Row */}
            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
              <select className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand">
                <option value="">Select source field...</option>
                {fromFields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <select className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand">
                <option value="">Select target field...</option>
                {toFields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <button className="text-sm text-brand hover:text-brand/80 font-medium mt-2">
              + Add mapping rule
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => actions.openConnectionMapping(null)}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => actions.openConnectionMapping(null)}
            className="px-4 py-2 text-sm font-medium bg-brand text-white rounded-md hover:bg-brand/90"
          >
            Save Mapping
          </button>
        </div>
      </div>
    </div>
  )
}
