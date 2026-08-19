"use client"

import { useState } from "react"
import { useWorkspace, actions } from "@/lib/store"
import { Plus, Link2, Activity, MoreVertical, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ConnectionsPage() {
  const workspace = useWorkspace()

  // Aggregate all DataSources (API Connections) from all processes
  const allDataSources = workspace.processes.flatMap(p => 
    p.dataSources.map(ds => ({
      ...ds,
      processName: p.name,
      processId: p.id
    }))
  )

  const handleSync = (e: React.MouseEvent, processId: string, dsId: string) => {
    e.preventDefault() // prevent navigating to detail page
    actions.triggerDataSourceSync(processId, dsId)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-background sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">API Connections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your external data sources and sync schedules across all engines.
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.02]"
          onClick={() => actions.toggleCommandPalette(true)}
        >
          <Plus className="h-4 w-4" />
          Add Integration
        </button>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {allDataSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-surface/50">
            <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground">No API connections yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a data source to any engine or use <code className="font-mono text-brand">/connect</code> to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allDataSources.map((ds) => (
              <Link 
                href={`/dashboard/connections/${ds.id}`}
                key={ds.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between p-5 border border-border bg-card rounded-2xl shadow-sm hover:border-brand/50 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground group-hover:text-brand transition-colors">{ds.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="uppercase tracking-wider font-medium">{ds.type}</span>
                      <span>•</span>
                      <span>Connected to: <span className="font-medium text-foreground">{ds.processName}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Status & Sync Info */}
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                      {ds.status === "syncing" ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          Syncing
                        </span>
                      ) : ds.status === "error" ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                          <AlertCircle className="h-3 w-3" />
                          Error
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {ds.lastSync ? `Last synced: ${new Date(ds.lastSync).toLocaleTimeString()}` : 'Never synced'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleSync(e, ds.processId, ds.id)}
                      disabled={ds.status === "syncing"}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
                      title="Sync Now"
                    >
                      <RefreshCw className={`h-4 w-4 ${ds.status === "syncing" ? "animate-spin" : ""}`} />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
