"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { useWorkspace, actions, type ProcessNode as ProcessNodeType } from "@/lib/store"
import { ProcessNode } from "./process-node"
import { ConnectionLine } from "./connection-line"
import { ProcessDetail } from "./process-detail"
import { DataImportModal } from "./data-import-modal"
import { Plus, Link2, Undo2, Redo2 } from "lucide-react"

export function Canvas() {
  const workspace = useWorkspace()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState<{ fromId: string; fromPos: { x: number; y: number } } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const offset = workspace.canvasOffset
  const zoom = workspace.canvasZoom

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest(".canvas-grid")) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
      // Deselect when clicking on canvas
      actions.selectProcess(null)
    }
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: (e.clientX - offset.x) / zoom, y: (e.clientY - offset.y) / zoom })
    if (isPanning) {
      actions.setCanvasOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y })
    }
  }, [isPanning, panStart, offset, zoom])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    setConnecting(null)
  }, [])

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    actions.setCanvasZoom(zoom * delta)
  }, [zoom])

  // Connection start
  const startConnection = useCallback((fromId: string, portPos: { x: number; y: number }) => {
    setConnecting({ fromId, fromPos: portPos })
  }, [])

  // Connection end
  const endConnection = useCallback((toId: string) => {
    if (connecting && connecting.fromId !== toId) {
      actions.addConnection({
        id: `conn-${Date.now()}`,
        from: connecting.fromId,
        to: toId,
      })
    }
    setConnecting(null)
  }, [connecting])

  // Get node center position for connection lines
  const getNodeCenter = useCallback((proc: ProcessNodeType, side: "left" | "right") => {
    const nodeW = 220
    const nodeH = 100
    return {
      x: proc.position.x + (side === "right" ? nodeW : 0),
      y: proc.position.y + nodeH / 2,
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="canvas-world"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
        >
          {/* Grid */}
          <svg className="canvas-grid" width="20000" height="20000">
            <defs>
              <pattern id="canvas-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="var(--border)" />
              </pattern>
            </defs>
            <rect width="20000" height="20000" fill="url(#canvas-dots)" />
          </svg>

          {/* Connection lines */}
          <svg
            style={{ position: "absolute", inset: "-10000px", width: "20000px", height: "20000px", pointerEvents: "none", zIndex: 1 }}
          >
            <g transform="translate(10000, 10000)">
              {workspace.connections.map((conn) => {
                const fromNode = workspace.processes.find((p) => p.id === conn.from)
                const toNode = workspace.processes.find((p) => p.id === conn.to)
                if (!fromNode || !toNode) return null
                const from = getNodeCenter(fromNode, "right")
                const to = getNodeCenter(toNode, "left")
                return (
                  <ConnectionLine
                    key={conn.id}
                    id={conn.id}
                    from={from}
                    to={to}
                    label={conn.label}
                    selected={workspace.selectedConnectionId === conn.id}
                  />
                )
              })}
              {/* Preview connection while dragging */}
              {connecting && (
                <ConnectionLine
                  id="preview"
                  from={connecting.fromPos}
                  to={mousePos}
                  preview
                />
              )}
            </g>
          </svg>

          {/* Process nodes */}
          {workspace.processes.map((proc) => (
            <ProcessNode
              key={proc.id}
              process={proc}
              selected={workspace.selectedProcessId === proc.id}
              onStartConnection={startConnection}
              onEndConnection={endConnection}
              isConnecting={connecting !== null}
            />
          ))}
        </div>

        {/* Floating toolbar */}
        <div className="hero-toolbar" style={{ bottom: 20 }}>
          <button
            type="button"
            className="hero-toolbar-btn hero-toolbar-btn-active"
            title="Add process"
            onClick={() => {
              const id = `proc-${Date.now()}`
              const cx = (-offset.x + (containerRef.current?.clientWidth ?? 600) / 2) / zoom
              const cy = (-offset.y + (containerRef.current?.clientHeight ?? 400) / 2) / zoom
              actions.addProcess({
                id,
                name: "New Process",
                icon: "📌",
                description: "",
                position: { x: cx - 110, y: cy - 50 },
                color: "#FF0083",
                dataSources: [],
                data: [],
                status: "draft",
              })
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" className="hero-toolbar-btn" title="Connect">
            <Link2 className="h-4 w-4" />
          </button>
          <div className="hero-toolbar-sep" />
          <button type="button" className="hero-toolbar-btn" title="Undo">
            <Undo2 className="h-4 w-4" />
          </button>
          <button type="button" className="hero-toolbar-btn" title="Redo">
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Minimap */}
        <div
          className="absolute bottom-5 right-5 rounded-xl border border-border bg-surface/90 p-2"
          style={{ width: 160, height: 100 }}
        >
          <svg width="100%" height="100%" viewBox="-100 -100 1200 800">
            {workspace.processes.map((proc) => (
              <rect
                key={proc.id}
                x={proc.position.x}
                y={proc.position.y}
                width={220}
                height={100}
                rx={8}
                fill={workspace.selectedProcessId === proc.id ? "var(--brand)" : "var(--border)"}
                opacity={0.6}
              />
            ))}
            {workspace.connections.map((conn) => {
              const f = workspace.processes.find((p) => p.id === conn.from)
              const t = workspace.processes.find((p) => p.id === conn.to)
              if (!f || !t) return null
              return (
                <line
                  key={conn.id}
                  x1={f.position.x + 220}
                  y1={f.position.y + 50}
                  x2={t.position.x}
                  y2={t.position.y + 50}
                  stroke="var(--border)"
                  strokeWidth={3}
                />
              )
            })}
          </svg>
        </div>
      </div>

      {/* Process Detail Panel */}
      {workspace.showProcessDetail && workspace.selectedProcessId && (
        <ProcessDetail processId={workspace.selectedProcessId} />
      )}

      {/* Data Import Modal */}
      {workspace.showDataImport && workspace.selectedProcessId && (
        <DataImportModal processId={workspace.selectedProcessId} />
      )}
    </>
  )
}
