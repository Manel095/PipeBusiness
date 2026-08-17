"use client"

import { useWorkspace } from "@/lib/store"
import { Webhook, Key, ExternalLink, Activity, Plus, Trash2 } from "lucide-react"

export default function ConnectionsPage() {
  const workspace = useWorkspace()

  // Aggregate all data sources across all processes
  const allDataSources = workspace.processes.flatMap((proc) => 
    proc.dataSources.map((ds) => ({ ...ds, processName: proc.name, processColor: proc.color, processIcon: proc.icon }))
  ).sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Connections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your incoming webhooks, API keys, and data sources.
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.02]"
          onClick={() => alert("Go to a process node to add a new connection.")}
        >
          <Plus className="h-4 w-4" />
          Add Connection
        </button>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        
        {allDataSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-surface/50">
            <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-foreground">No active connections</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a webhook or API source to a process to start receiving data.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allDataSources.map((ds) => (
              <div key={ds.id} className="flex items-center justify-between p-5 border border-border bg-background rounded-2xl shadow-sm hover:border-brand/30 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    ds.type === 'webhook' ? 'bg-purple-500/10 text-purple-500' :
                    ds.type === 'api' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {ds.type === 'webhook' ? <Webhook className="w-6 h-6" /> : ds.type === 'api' ? <Key className="w-6 h-6" /> : <ExternalLink className="w-6 h-6" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">{ds.name}</h3>
                      {ds.entityType && (
                        <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider">
                          {ds.entityType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>Type: <strong className="uppercase">{ds.type}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ds.processColor }}></span>
                        {ds.processName} {ds.processIcon}
                      </span>
                      <span>•</span>
                      <span>Created {new Date(ds.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Connection details (e.g. Webhook URL) */}
                    {ds.type === 'webhook' && (
                      <div className="mt-3 flex items-center gap-2">
                        <code className="text-[10px] bg-surface border border-border px-2 py-1 rounded font-mono text-muted-foreground select-all">
                          https://pipebusiness.com/api/ingest/{ds.id}
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold flex items-center gap-1 text-emerald-600 justify-end">
                      <Activity className="w-4 h-4" /> Listening
                    </div>
                    <div className="text-xs text-muted-foreground">0 events received</div>
                  </div>
                  
                  <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
