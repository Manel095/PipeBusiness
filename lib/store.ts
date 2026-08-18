"use client"

import { useSyncExternalStore } from "react"

/* ─── types ─── */
export type Position = { x: number; y: number }

export type DataSourceType = "webhook" | "csv" | "manual" | "api" | "google-sheets" | "zapier" | "n8n"

export type DataSource = {
  id: string
  type: DataSourceType
  name: string
  config: Record<string, string>
  entityType?: "client" | "project" | "task" | "sale" | "transaction"
  createdAt: number
}

export type DataRow = Record<string, string | number>

export type ProcessStep = {
  id: string
  name: string
  status: "pending" | "in_progress" | "completed"
}

/* ─── Engine Configuration ─── */
export type EngineType = "cash" | "projects" | "billing" | "leads" | "custom"

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
}

export type EngineConfig = {
  engineType: EngineType
  inputSchema: SchemaField[]
  kpis: KPIDefinition[]
  entityType: "client" | "project" | "task" | "sale" | "transaction"
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

/* ─── Workspace State ─── */
export type WorkspaceState = {
  processes: ProcessNode[]
  connectors: Connector[]
  reports: Report[]
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
let state: WorkspaceState = INITIAL
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
  try {
    const serializable = {
      processes: state.processes,
      connectors: state.connectors,
      reports: state.reports,
    }
    localStorage.setItem("pb-workspace", JSON.stringify(serializable))
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
