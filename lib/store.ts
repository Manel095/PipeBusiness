"use client"

import { useSyncExternalStore } from "react"
import type { TransformRule } from "@/lib/formula"

/* ─── types ─── */
export type Position = { x: number; y: number }

export type DataSourceType = "webhook" | "csv" | "manual" | "api" | "google-sheets" | "zapier" | "n8n"

export type DataSource = {
  id: string
  type: DataSourceType
  name: string
  config: Record<string, string>
  entityType?: string
  createdAt: number
  syncSchedule?: "manual" | "hourly" | "daily" | "weekly"
  lastSync?: number
  nextSync?: number
  status?: "connected" | "syncing" | "error"
  logs?: { timestamp: number; message: string; rowsAffected?: number }[]
  transforms?: TransformRule[]
  samplePayload?: string
}

export type DataRow = Record<string, string | number>

export type ProcessStep = {
  id: string
  name: string
  status: "pending" | "in_progress" | "completed"
}

/* ─── Engine Configuration ─── */
export type EngineType = string

export type SchemaField = {
  key: string
  label: string
  type: "string" | "number" | "date" | "currency" | "boolean"
}

export type KPIDefinition = {
  id: string
  name: string
  field: string
  unit: "currency" | "percentage" | "count" | "time"
  direction: "up" | "down"
  formula?: string
  formulaFields?: string[]
}

export type EngineConfig = {
  engineType: EngineType
  inputSchema: SchemaField[]
  kpis: KPIDefinition[]
  entityType: string
}

/* ─── Process (Engine) Node ─── */
export type ProcessNode = {
  id: string
  name: string
  description: string
  position: Position
  color: string
  dataSources: DataSource[]
  data: DataRow[]
  incomingData: DataRow[]
  config: EngineConfig
  steps?: ProcessStep[]
  status: "active" | "draft" | "paused"
}

/* ─── Connector (replaces Connection) ─── */
export type Connector = {
  id: string
  name: string
  from: string
  to: string
  dataFlowFields: string[]
  schemaMapping?: Record<string, string>
}

/* ─── Reports ─── */
export type Report = {
  id: string
  title: string
  content: string
  engineId?: string
  createdAt: number
  updatedAt: number
  isTemplate: boolean
  schedule?: "daily" | "weekly" | "monthly" | null
}

/* ─── Custom Dashboards (Insights) ─── */
export type WidgetConfig = {
  id: string
  type: "chart" | "metric"
  engine: string
  field?: string
  chartType?: "Line" | "Bar" | "Area"
  xAxis?: string
  yAxis?: string
  title?: string
  period?: string
  layout?: { x: number; y: number; w: number; h: number }
}

export type InsightDashboard = {
  id: string
  title: string
  widgets: WidgetConfig[]
  createdAt: number
  updatedAt: number
}

/* ─── Workspace State ─── */
export type WorkspaceState = {
  processes: ProcessNode[]
  connectors: Connector[]
  reports: Report[]
  insights: InsightDashboard[]
  selectedProcessId: string | null
  selectedConnectorId: string | null
  showProcessDetail: boolean
  showDataImport: boolean
  showCommandPalette: boolean
  showConnectorModalId: string | null
  canvasOffset: Position
  canvasZoom: number
}

/* ─── initial state ─── */
const INITIAL: WorkspaceState = {
  processes: [],
  connectors: [],
  reports: [],
  insights: [],
  selectedProcessId: null,
  selectedConnectorId: null,
  showProcessDetail: false,
  showDataImport: false,
  showCommandPalette: false,
  showConnectorModalId: null,
  canvasOffset: { x: 0, y: 0 },
  canvasZoom: 1,
}

/* ─── store singleton ─── */
import { createClient } from "@/lib/supabase/client"
let state: WorkspaceState = INITIAL
const listeners = new Set<() => void>()
const supabase = typeof window !== 'undefined' ? createClient() : null

async function syncInsightsToSupabase(insights: InsightDashboard[]) {
  if (!supabase) return
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    
    // Get user's first workspace
    const { data: workspaces } = await supabase.from('workspaces').select('id').eq('user_id', session.user.id).limit(1)
    if (!workspaces || workspaces.length === 0) return
    const workspaceId = workspaces[0].id

    // Upsert insights
    for (const insight of insights) {
      const { error } = await supabase.from('custom_dashboards').upsert({
        id: insight.id.replace('insight-', ''), // Ensure UUID if needed, or keep string
        workspace_id: workspaceId,
        title: insight.title,
        widgets: insight.widgets,
        updated_at: new Date(insight.updatedAt).toISOString()
      }, { onConflict: 'id' })
      
      if (error) {
        console.error("Error upserting dashboard:", error)
      }
    }
  } catch (e) {
    console.error("Supabase sync error:", e)
  }
}

function emit() {
  listeners.forEach((l) => l())
  try {
    const serializable = {
      processes: state.processes,
      connectors: state.connectors,
      reports: state.reports,
      insights: state.insights,
    }
    localStorage.setItem("pb-workspace", JSON.stringify(serializable))
    
    // Background sync
    if (state.insights.length > 0) {
      syncInsightsToSupabase(state.insights)
    }
  } catch {}
}

function loadFromStorage(): Partial<WorkspaceState> {
  try {
    const raw = localStorage.getItem("pb-workspace")
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

/* ─── actions ─── */
export const actions = {
  init(seed?: { processes: ProcessNode[]; connectors: Connector[] }) {
    const stored = loadFromStorage()
    if (stored.processes && stored.processes.length > 0) {
      state = {
        ...state,
        processes: stored.processes,
        connectors: (stored as any).connectors ?? (stored as any).connections ?? [],
        reports: (stored as any).reports ?? [],
        insights: (stored as any).insights ?? [],
      }
    } else if (seed) {
      state = { ...state, processes: seed.processes, connectors: seed.connectors }
    }
    emit()
  },

  addProcess(proc: ProcessNode) {
    state = { ...state, processes: [...state.processes, proc] }
    emit()
  },

  updateProcess(id: string, patch: Partial<ProcessNode>) {
    state = {
      ...state,
      processes: state.processes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }
    emit()
  },

  updateProcessStep(processId: string, stepId: string, patch: Partial<ProcessStep>) {
    state = {
      ...state,
      processes: state.processes.map((p) => {
        if (p.id !== processId || !p.steps) return p
        return {
          ...p,
          steps: p.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
        }
      }),
    }
    emit()
  },

  removeProcess(id: string) {
    state = {
      ...state,
      processes: state.processes.filter((p) => p.id !== id),
      connectors: state.connectors.filter((c) => c.from !== id && c.to !== id),
      selectedProcessId: state.selectedProcessId === id ? null : state.selectedProcessId,
      showProcessDetail: state.selectedProcessId === id ? false : state.showProcessDetail,
    }
    emit()
  },

  moveProcess(id: string, position: Position) {
    state = {
      ...state,
      processes: state.processes.map((p) => (p.id === id ? { ...p, position } : p)),
    }
    emit()
  },

  autoLayout() {
    // Simple DAG layout: left-to-right
    const processes = [...state.processes]
    const connectors = state.connectors

    const inDegree: Record<string, number> = {}
    const outEdges: Record<string, string[]> = {}
    
    processes.forEach(p => {
      inDegree[p.id] = 0
      outEdges[p.id] = []
    })

    connectors.forEach(c => {
      if (inDegree[c.to] !== undefined) inDegree[c.to]++
      if (outEdges[c.from]) outEdges[c.from].push(c.to)
    })

    const levels: Record<string, number> = {}
    const queue: { id: string, level: number }[] = []

    processes.forEach(p => {
      if (inDegree[p.id] === 0) {
        queue.push({ id: p.id, level: 0 })
      }
    })

    // If there are cycles or no roots, just add everything arbitrarily
    if (queue.length === 0 && processes.length > 0) {
      queue.push({ id: processes[0].id, level: 0 })
    }

    const visited = new Set<string>()

    while (queue.length > 0) {
      const { id, level } = queue.shift()!
      if (visited.has(id)) continue
      visited.add(id)
      
      levels[id] = Math.max(levels[id] || 0, level)

      ;(outEdges[id] || []).forEach(to => {
        queue.push({ id: to, level: levels[id] + 1 })
      })
    }

    // For any unvisited nodes (disconnected or cycles)
    processes.forEach(p => {
      if (!visited.has(p.id)) {
        levels[p.id] = 0
      }
    })

    const levelCounts: Record<number, number> = {}
    
    const newProcesses = processes.map(p => {
      const lvl = levels[p.id] || 0
      const idx = levelCounts[lvl] || 0
      levelCounts[lvl] = idx + 1

      return {
        ...p,
        position: {
          x: 100 + lvl * 320,
          y: 100 + idx * 180
        }
      }
    })

    state = { ...state, processes: newProcesses }
    emit()
  },

  /* ─── Connectors ─── */
  addConnector(conn: Connector) {
    state = { ...state, connectors: [...state.connectors, conn] }
    emit()
  },

  removeConnector(id: string) {
    state = {
      ...state,
      connectors: state.connectors.filter((c) => c.id !== id),
    }
    emit()
  },

  updateConnector(id: string, patch: Partial<Connector>) {
    state = {
      ...state,
      connectors: state.connectors.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }
    emit()
  },

  /* ─── Reports ─── */
  addReport(report: Report) {
    state = { ...state, reports: [...state.reports, report] }
    emit()
  },

  updateReport(id: string, patch: Partial<Report>) {
    state = {
      ...state,
      reports: state.reports.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }
    emit()
  },

  removeReport(id: string) {
    state = {
      ...state,
      reports: state.reports.filter((r) => r.id !== id),
    }
    emit()
  },

  /* ─── Insights ─── */
  addInsight(insight: InsightDashboard) {
    state = { ...state, insights: [...state.insights, insight] }
    emit()
  },

  updateInsight(id: string, patch: Partial<InsightDashboard>) {
    state = {
      ...state,
      insights: state.insights.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }
    emit()
  },

  removeInsight(id: string) {
    state = {
      ...state,
      insights: state.insights.filter((i) => i.id !== id),
    }
    emit()
  },

  addWidget(insightId: string, widget: WidgetConfig) {
    state = {
      ...state,
      insights: state.insights.map((i) => {
        if (i.id !== insightId) return i
        return { ...i, widgets: [...i.widgets, widget], updatedAt: Date.now() }
      }),
    }
    emit()
  },

  updateWidget(insightId: string, widgetId: string, patch: Partial<WidgetConfig>) {
    state = {
      ...state,
      insights: state.insights.map((i) => {
        if (i.id !== insightId) return i
        return {
          ...i,
          widgets: i.widgets.map((w) => (w.id === widgetId ? { ...w, ...patch } : w)),
          updatedAt: Date.now()
        }
      }),
    }
    emit()
  },

  removeWidget(insightId: string, widgetId: string) {
    state = {
      ...state,
      insights: state.insights.map((i) => {
        if (i.id !== insightId) return i
        return {
          ...i,
          widgets: i.widgets.filter((w) => w.id !== widgetId),
          updatedAt: Date.now()
        }
      }),
    }
    emit()
  },

  selectProcess(id: string | null) {
    state = { ...state, selectedProcessId: id, showProcessDetail: id !== null }
    emit()
  },

  closeProcessDetail() {
    state = { ...state, showProcessDetail: false, selectedProcessId: null }
    emit()
  },

  toggleDataImport(show?: boolean) {
    state = { ...state, showDataImport: show ?? !state.showDataImport }
    emit()
  },

  toggleCommandPalette(show?: boolean) {
    state = { ...state, showCommandPalette: show ?? !state.showCommandPalette }
    emit()
  },

  openConnectorModal(id: string | null) {
    state = { ...state, showConnectorModalId: id }
    emit()
  },

  addDataSource(processId: string, ds: DataSource) {
    state = {
      ...state,
      processes: state.processes.map((p) =>
        p.id === processId ? { ...p, dataSources: [...p.dataSources, ds] } : p
      ),
    }
    emit()
  },

  removeDataSource(processId: string, dsId: string) {
    state = {
      ...state,
      processes: state.processes.map((p) =>
        p.id === processId
          ? { ...p, dataSources: p.dataSources.filter((d) => d.id !== dsId) }
          : p
      ),
    }
    emit()
  },

  updateDataSource(processId: string, dsId: string, patch: Partial<DataSource>) {
    state = {
      ...state,
      processes: state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              dataSources: p.dataSources.map((ds) =>
                ds.id === dsId ? { ...ds, ...patch } : ds
              ),
            }
          : p
      ),
    }
    emit()
  },

  triggerDataSourceSync(processId: string, dsId: string) {
    // 1. Mark as syncing
    this.updateDataSource(processId, dsId, { status: "syncing" })
    
    // 2. Simulate API call
    setTimeout(() => {
      const now = Date.now()
      const isError = Math.random() < 0.1 // 10% chance of error
      
      const newLog = {
        timestamp: now,
        message: isError ? "Failed to fetch data from API" : "Successfully synced data",
        rowsAffected: isError ? 0 : Math.floor(Math.random() * 50) + 1,
      }
      
      // We need to fetch the latest state directly from state
      const p = state.processes.find(pr => pr.id === processId)
      const ds = p?.dataSources.find(d => d.id === dsId)
      
      if (ds) {
        actions.updateDataSource(processId, dsId, {
          status: isError ? "error" : "connected",
          lastSync: now,
          nextSync: ds.syncSchedule === "hourly" ? now + 3600000 
                  : ds.syncSchedule === "daily" ? now + 86400000 
                  : undefined,
          logs: [newLog, ...(ds.logs || [])].slice(0, 10), // keep last 10
        })
      }
    }, 1500)
  },

  addDataRows(processId: string, rows: DataRow[]) {
    state = {
      ...state,
      processes: state.processes.map((p) =>
        p.id === processId ? { ...p, data: [...p.data, ...rows] } : p
      ),
    }
    emit()
  },

  addIncomingData(processId: string, rows: DataRow[]) {
    state = {
      ...state,
      processes: state.processes.map((p) =>
        p.id === processId ? { ...p, incomingData: [...(p.incomingData || []), ...rows] } : p
      ),
    }
    emit()
  },

  setCanvasOffset(offset: Position) {
    state = { ...state, canvasOffset: offset }
    listeners.forEach((l) => l())
  },

  setCanvasZoom(zoom: number) {
    state = { ...state, canvasZoom: Math.max(0.25, Math.min(2, zoom)) }
    listeners.forEach((l) => l())
  },

  resetWorkspace() {
    localStorage.removeItem("pb-workspace")
    state = INITIAL
    emit()
  },
}

/* ─── hook ─── */
function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

function getSnapshot() { return state }

export function useWorkspace() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
