"use client"

import { useState } from "react"
import { useWorkspace, actions } from "@/lib/store"
import { ArrowRight, Plus, Trash2, Activity, Link2 } from "lucide-react"

export default function ConnectionsPage() {
  const workspace = useWorkspace()

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Connectors</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the data pipes between your engines. Each connector defines what data flows from one engine to another.
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.02]"
          onClick={() => actions.toggleCommandPalette(true)}
        >
          <Plus className="h-4 w-4" />
          New Connector
        </button>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {workspace.connectors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-surface/50">
            <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground">No connectors yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Draw a line between two engines on the canvas, or use <code className="font-mono text-brand">/connect</code> in the command bar.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {workspace.connectors.map((conn) => {
              const fromProc = workspace.processes.find(p => p.id === conn.from)
              const toProc = workspace.processes.find(p => p.id === conn.to)
              if (!fromProc || !toProc) return null

              return (
                <div key={conn.id} className="flex items-center justify-between p-5 border border-border bg-background rounded-2xl shadow-sm hover:border-brand/30 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Source Engine */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold uppercase"
                        style={{ background: `${fromProc.color}15`, color: fromProc.color }}
                      >
                        {fromProc.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{fromProc.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{fromProc.config?.engineType ?? "engine"}</p>
                      </div>
                    </div>

                    {/* Arrow + Connector Name */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1 rounded-full mb-1">{conn.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Target Engine */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold uppercase"
                        style={{ background: `${toProc.color}15`, color: toProc.color }}
                      >
                        {toProc.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{toProc.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{toProc.config?.engineType ?? "engine"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Fields flowing */}
                    <div className="text-right">
                      {conn.dataFlowFields.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                          {conn.dataFlowFields.map(f => (
                            <code key={f} className="text-[10px] bg-surface border border-border px-1.5 py-0.5 rounded font-mono">{f}</code>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No fields mapped</span>
                      )}
                    </div>

                    <button
                      onClick={() => actions.openConnectorModal(conn.id)}
                      className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-lg hover:bg-brand/20 transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => actions.removeConnector(conn.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
