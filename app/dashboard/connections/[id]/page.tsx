"use client"

import { useState, useEffect } from "react"
import { useWorkspace, actions } from "@/lib/store"
import { ArrowLeft, Activity, RefreshCw, Save, Clock, Server, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function ConnectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workspace = useWorkspace()
  
  const id = params.id as string

  // Find the data source across all processes
  let foundProcessId = ""
  let foundDataSource = null
  
  for (const p of workspace.processes) {
    const ds = p.dataSources.find(d => d.id === id)
    if (ds) {
      foundProcessId = p.id
      foundDataSource = ds
      break
    }
  }

  const ds = foundDataSource

  // Local state for editing
  const [schedule, setSchedule] = useState<string>("manual")
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (ds) {
      setSchedule(ds.syncSchedule || "manual")
      setUrl(ds.config.url || "")
    }
  }, [ds])

  if (!ds) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">Connection Not Found</h2>
        <Link href="/dashboard/connections" className="mt-4 text-foreground font-medium hover:underline">
          &larr; Back to Connections
        </Link>
      </div>
    )
  }

  const handleSave = () => {
    actions.updateDataSource(foundProcessId, ds.id, {
      syncSchedule: schedule as any,
      config: { ...ds.config, url },
    })
  }

  const handleSyncNow = () => {
    actions.triggerDataSourceSync(foundProcessId, ds.id)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-border px-6 py-5 flex items-center gap-4 bg-background sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{ds.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="uppercase tracking-wider font-medium">{ds.type}</span>
              <span>•</span>
              <span>{ds.id}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Server className="h-4 w-4" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <div className="flex items-center gap-2">
              {ds.status === "syncing" ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-blue-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Syncing right now...
                </span>
              ) : ds.status === "error" ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Error connecting
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Active & Connected
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Last Sync</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              {ds.lastSync ? new Date(ds.lastSync).toLocaleString() : 'Never synced'}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-center">
            <button
              onClick={handleSyncNow}
              disabled={ds.status === "syncing"}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              <RefreshCw className={`h-4 w-4 ${ds.status === "syncing" ? "animate-spin" : ""}`} />
              {ds.status === "syncing" ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Settings Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Connection Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Endpoint URL / API Key</label>
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    placeholder="https://api.example.com/v1/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Sync Schedule</label>
                  <select 
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <option value="manual">Manual (Triggered by you)</option>
                    <option value="hourly">Every hour</option>
                    <option value="daily">Daily at midnight</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Determines how often PipeBusiness will automatically pull data from this source.
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sync Logs Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Sync History</h2>
              
              <div className="space-y-4">
                {!ds.logs || ds.logs.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-6">
                    No sync logs available yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {ds.logs.map((log, i) => (
                      <div key={i} className="flex gap-3 text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                        <div className="mt-0.5">
                          {log.rowsAffected === 0 ? (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{log.message}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                            {log.rowsAffected !== undefined && log.rowsAffected > 0 && (
                              <>
                                <span>•</span>
                                <span>{log.rowsAffected} rows synced</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
