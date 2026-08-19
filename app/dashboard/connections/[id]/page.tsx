"use client"

import { useState, useEffect, useMemo } from "react"
import { useWorkspace, actions } from "@/lib/store"
import {
  ArrowLeft, Activity, RefreshCw, Save, Clock, Server, AlertCircle, CheckCircle2,
  Plus, Trash2, ArrowRight, Filter
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  type TransformRule, TRANSFORM_LABELS, previewTransform
} from "@/lib/formula"

let _ruleId = 0
function ruleId() { return `rule-${++_ruleId}-${Date.now().toString(36)}` }

export default function ConnectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workspace = useWorkspace()

  const id = params.id as string

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

  // Local state
  const [schedule, setSchedule] = useState<string>("manual")
  const [url, setUrl] = useState("")
  const [transforms, setTransforms] = useState<TransformRule[]>([])
  const [samplePayload, setSamplePayload] = useState("")

  useEffect(() => {
    if (ds) {
      setSchedule(ds.syncSchedule || "manual")
      setUrl(ds.config.url || ds.config.endpoint || "")
      setTransforms(ds.transforms || [])
      setSamplePayload(ds.samplePayload || "")
    }
  }, [ds])

  const preview = useMemo(() => {
    if (!samplePayload.trim()) return null
    return previewTransform(samplePayload, transforms)
  }, [samplePayload, transforms])

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
      transforms,
      samplePayload,
    })
  }

  const handleSyncNow = () => {
    actions.triggerDataSourceSync(foundProcessId, ds.id)
  }

  const addRule = (type: TransformRule["type"]) => {
    setTransforms(prev => [
      ...prev,
      { id: ruleId(), type, sourceField: "", targetField: "", value: "" }
    ])
  }

  const updateRule = (ruleIdVal: string, patch: Partial<TransformRule>) => {
    setTransforms(prev => prev.map(r => r.id === ruleIdVal ? { ...r, ...patch } : r))
  }

  const removeRule = (ruleIdVal: string) => {
    setTransforms(prev => prev.filter(r => r.id !== ruleIdVal))
  }

  // Extract fields from the sample payload for field selectors
  const sampleFields = useMemo(() => {
    try {
      const parsed = JSON.parse(samplePayload)
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return Object.keys(parsed)
      }
    } catch { /* empty */ }
    return []
  }, [samplePayload])

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

        {/* Status Cards */}
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

        {/* Connection Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Connection Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Endpoint URL / API Key</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                placeholder="https://api.example.com/v1/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Sync Schedule</label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
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
          </div>
        </div>

        {/* ─── Data Transform Pipeline ─── */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              Data Transform Pipeline
            </h2>
            <span className="text-xs text-muted-foreground">{transforms.length} rule{transforms.length !== 1 ? "s" : ""}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Define rules to clean, filter, and enrich incoming data before it enters the engine.
          </p>

          {/* Sample Payload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-1">Sample Payload (JSON)</label>
            <textarea
              value={samplePayload}
              onChange={(e) => setSamplePayload(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 min-h-[80px] resize-y"
              placeholder={'{\n  "name": "John Doe",\n  "clientID": "cli_123",\n  "email": "john@example.com"\n}'}
              rows={4}
            />
            {sampleFields.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Detected fields: {sampleFields.map(f => <code key={f} className="font-mono font-semibold text-foreground mx-0.5">{f}</code>)}
              </p>
            )}
          </div>

          {/* Rules List */}
          {transforms.length > 0 && (
            <div className="space-y-3 mb-4">
              {transforms.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3 p-3 border border-border rounded-xl bg-background">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Rule type label */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Type</span>
                      <div className="text-sm font-medium text-foreground mt-0.5">{TRANSFORM_LABELS[rule.type]}</div>
                    </div>

                    {/* Source field */}
                    {(rule.type === "select" || rule.type === "exclude" || rule.type === "rename") && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Field</span>
                        {sampleFields.length > 0 ? (
                          <select
                            value={rule.sourceField || ""}
                            onChange={(e) => updateRule(rule.id, { sourceField: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
                          >
                            <option value="">Select...</option>
                            {sampleFields.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={rule.sourceField || ""}
                            onChange={(e) => updateRule(rule.id, { sourceField: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
                            placeholder="field_name"
                          />
                        )}
                      </div>
                    )}

                    {/* Target / Value field */}
                    {rule.type === "rename" && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Rename to</span>
                        <input
                          type="text"
                          value={rule.targetField || ""}
                          onChange={(e) => updateRule(rule.id, { targetField: e.target.value })}
                          className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
                          placeholder="new_name"
                        />
                      </div>
                    )}

                    {(rule.type === "add_timestamp" || rule.type === "add_counter") && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Field name</span>
                        <input
                          type="text"
                          value={rule.targetField || ""}
                          onChange={(e) => updateRule(rule.id, { targetField: e.target.value })}
                          className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
                          placeholder={rule.type === "add_timestamp" ? "received_at" : "row_number"}
                        />
                      </div>
                    )}

                    {rule.type === "static_value" && (
                      <>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Field name</span>
                          <input
                            type="text"
                            value={rule.targetField || ""}
                            onChange={(e) => updateRule(rule.id, { targetField: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
                            placeholder="source"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Value</span>
                          <input
                            type="text"
                            value={rule.value || ""}
                            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
                            placeholder="webhook_main"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg transition-colors mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Rule Buttons */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TRANSFORM_LABELS) as TransformRule["type"][]).map(type => (
              <button
                key={type}
                onClick={() => addRule(type)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
              >
                <Plus className="h-3 w-3" />
                {TRANSFORM_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                Preview
                {preview.error && <span className="text-xs font-normal text-destructive">{preview.error}</span>}
              </h3>
              {preview.before && preview.after && (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Before</span>
                    <pre className="text-xs font-mono bg-background border border-border rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(preview.before, null, 2)}
                    </pre>
                  </div>
                  <div className="flex items-center justify-center pt-5">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">After</span>
                    <pre className="text-xs font-mono bg-background border border-border rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(preview.after, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sync Logs */}
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

        {/* Save Button */}
        <div className="flex justify-end pb-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:brightness-95 transition-all"
          >
            <Save className="h-4 w-4" />
            Save All Changes
          </button>
        </div>

      </div>
    </div>
  )
}
