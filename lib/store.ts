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
  createdAt: number
}

export type DataRow = Record<string, string | number>

export type ProcessStep = {
  id: string
  name: string
  status: "pending" | "in_progress" | "completed"
}

export type ProcessNode = {
  id: string
  name: string
  icon: string
  description: string
  position: Position
  color: string
  dataSources: DataSource[]
  data: DataRow[]
  steps?: ProcessStep[]
  status: "active" | "draft" | "paused"
}

export type Connection = {
  id: string
  from: string
  to: string
  label?: string
  schemaMapping?: Record<string, string>
}

export type WorkspaceState = {
  processes: ProcessNode[]
  connections: Connection[]
  selectedProcessId: string | null
  selectedConnectionId: string | null
  showProcessDetail: boolean
  showDataImport: boolean
  showCommandPalette: boolean
  showConnectionMappingId: string | null
  canvasOffset: Position
  canvasZoom: number
}

/* ─── initial state ─── */
const INITIAL: WorkspaceState = {
  processes: [],
  connections: [],
  selectedProcessId: null,
  selectedConnectionId: null,
  showProcessDetail: false,
  showDataImport: false,
  showCommandPalette: false,
  showConnectionMappingId: null,
  canvasOffset: { x: 0, y: 0 },
  canvasZoom: 1,
}

/* ─── store singleton ─── */
let state: WorkspaceState = INITIAL
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
  // Persist to localStorage (debounced would be better in prod)
  try {
    const serializable = {
      processes: state.processes,
      connections: state.connections,
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
  init(seed?: { processes: ProcessNode[]; connections: Connection[] }) {
    const stored = loadFromStorage()
    if (stored.processes && stored.processes.length > 0) {
      state = { ...state, processes: stored.processes, connections: stored.connections ?? [] }
    } else if (seed) {
      state = { ...state, processes: seed.processes, connections: seed.connections }
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
      connections: state.connections.filter((c) => c.from !== id && c.to !== id),
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

  addConnection(conn: Connection) {
    // Prevent duplicates
    const exists = state.connections.some((c) => c.from === conn.from && c.to === conn.to)
    if (exists) return
    state = { ...state, connections: [...state.connections, conn] }
    emit()
  },

  removeConnection(id: string) {
    state = {
      ...state,
      connections: state.connections.filter((c) => c.id !== id),
    }
    emit()
  },

  updateConnection(id: string, patch: Partial<Connection>) {
    state = {
      ...state,
      connections: state.connections.map((c) => (c.id === id ? { ...c, ...patch } : c)),
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

  openConnectionMapping(id: string | null) {
    state = { ...state, showConnectionMappingId: id }
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

  setCanvasOffset(offset: Position) {
    state = { ...state, canvasOffset: offset }
    // Don't persist canvas position
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
