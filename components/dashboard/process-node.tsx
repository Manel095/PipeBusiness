"use client"

import { useCallback, useRef, useState } from "react"
import { actions, type ProcessNode as ProcessNodeType } from "@/lib/store"
import { ArrowDownLeft } from "lucide-react"

interface ProcessNodeProps {
  process: ProcessNodeType
  selected: boolean
  onStartConnection: (fromId: string, portPos: { x: number; y: number }) => void
  onEndConnection: (toId: string) => void
  isConnecting: boolean
  connectorCount: number
}

export function ProcessNode({ process, selected, onStartConnection, onEndConnection, isConnecting, connectorCount }: ProcessNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".process-node-port")) return
    e.stopPropagation()
    setDragging(true)
    dragStart.current = {
      x: e.clientX - process.position.x,
      y: e.clientY - process.position.y,
    }

    const handleMove = (me: MouseEvent) => {
      actions.moveProcess(process.id, {
        x: me.clientX - dragStart.current.x,
        y: me.clientY - dragStart.current.y,
      })
    }

    const handleUp = () => {
      setDragging(false)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleUp)
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseup", handleUp)
  }, [process.id, process.position])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".process-node-port")) return
    e.stopPropagation()
    actions.selectProcess(process.id)
  }, [process.id])

  const handlePortMouseDown = useCallback((e: React.MouseEvent, side: "left" | "right") => {
    e.stopPropagation()
    e.preventDefault()
    const nodeW = 220
    const nodeH = 100
    const portPos = {
      x: process.position.x + (side === "right" ? nodeW : 0),
      y: process.position.y + nodeH / 2,
    }
    onStartConnection(process.id, portPos)
  }, [process.id, process.position, onStartConnection])

  const handlePortMouseUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isConnecting) {
      onEndConnection(process.id)
    }
  }, [process.id, isConnecting, onEndConnection])

  const engineLabel = process.config?.engineType || "Engine"

  const hasIncoming = (process.incomingData?.length ?? 0) > 0

  return (
    <div
      id={process.id}
      ref={nodeRef}
      className={`process-node ${selected ? "process-node-selected" : ""}`}
      style={{ left: process.position.x, top: process.position.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="process-node-card">
        <div className="process-node-header">
          {/* Letter Avatar instead of emoji */}
          <div
            className="process-node-icon"
            style={{ background: `${process.color}15`, color: process.color, fontWeight: 800, fontSize: "16px", textTransform: "uppercase" }}
          >
            {process.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{process.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: process.status === "active" ? "#10b981" : process.status === "paused" ? "#f59e0b" : "#94a3b8" }}
              />
              {engineLabel}
              {connectorCount > 0 && (
                <span className="text-muted-foreground"> · {connectorCount} connector{connectorCount > 1 ? "s" : ""}</span>
              )}
            </p>
          </div>
        </div>

        {/* KPI Summary (from config) — show top 2 KPIs */}
        {process.config?.kpis && process.config.kpis.length > 0 && process.data.length > 0 && (
          <div className="process-node-body">
            {process.config.kpis.slice(0, 2).map((kpi) => {
              const lastRow = process.data[process.data.length - 1]
              const val = lastRow?.[kpi.field]
              if (val === undefined) return null
              return (
                <div key={kpi.id} className="process-node-metric">
                  <span className="text-muted-foreground">{kpi.name}</span>
                  <span className="font-semibold text-foreground">
                    {kpi.unit === "currency" ? `$${Number(val).toLocaleString()}` :
                     kpi.unit === "percentage" ? `${val}%` :
                     Number(val).toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Incoming data indicator */}
        {hasIncoming && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 bg-blue-500/10 rounded-full px-2 py-0.5 w-fit">
              <ArrowDownLeft className="w-3 h-3" />
              {process.incomingData.length} received
            </div>
          </div>
        )}
      </div>

      {/* Connection ports */}
      <div
        className="process-node-port process-node-port-left"
        onMouseDown={(e) => handlePortMouseDown(e, "left")}
        onMouseUp={handlePortMouseUp}
      />
      <div
        className="process-node-port process-node-port-right"
        onMouseDown={(e) => handlePortMouseDown(e, "right")}
        onMouseUp={handlePortMouseUp}
      />
    </div>
  )
}
