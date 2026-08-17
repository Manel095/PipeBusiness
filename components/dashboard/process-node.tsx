"use client"

import { useCallback, useRef, useState } from "react"
import { actions, type ProcessNode as ProcessNodeType } from "@/lib/store"

interface ProcessNodeProps {
  process: ProcessNodeType
  selected: boolean
  onStartConnection: (fromId: string, portPos: { x: number; y: number }) => void
  onEndConnection: (toId: string) => void
  isConnecting: boolean
}

export function ProcessNode({ process, selected, onStartConnection, onEndConnection, isConnecting }: ProcessNodeProps) {
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

  // Get latest data metrics
  const latestData = process.data.length > 0 ? process.data[process.data.length - 1] : null
  const metricEntries = latestData
    ? Object.entries(latestData).filter(([k]) => k !== "date").slice(0, 2)
    : []

  return (
    <div
      ref={nodeRef}
      className={`process-node ${selected ? "process-node-selected" : ""}`}
      style={{ left: process.position.x, top: process.position.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="process-node-card">
        <div className="process-node-header">
          <div
            className="process-node-icon"
            style={{ background: `${process.color}15` }}
          >
            {process.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{process.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: process.status === "active" ? "#10b981" : process.status === "paused" ? "#f59e0b" : "#94a3b8" }}
              />
              {process.status === "active" ? "Active" : process.status === "paused" ? "Paused" : "Draft"}
              {process.dataSources.length > 0 && (
                <span className="text-muted-foreground"> · {process.dataSources.length} source{process.dataSources.length > 1 ? "s" : ""}</span>
              )}
            </p>
          </div>
        </div>
        {metricEntries.length > 0 && (
          <div className="process-node-body">
            {metricEntries.map(([key, val]) => (
              <div key={key} className="process-node-metric">
                <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-semibold text-foreground">{typeof val === "number" ? val.toLocaleString() : val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Nested Steps Visualization */}
        {process.steps && process.steps.length > 0 && (
          <div className="px-3 pb-3">
            <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2">
              {process.steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2 relative">
                  {/* Step Connector Line */}
                  {idx !== process.steps!.length - 1 && (
                    <div className="absolute left-[5px] top-[14px] w-[2px] h-[14px] bg-border" />
                  )}
                  {/* Status Dot */}
                  <div className={`w-3 h-3 rounded-full border-[2px] z-10 flex-shrink-0 ${
                    step.status === "completed" ? "bg-emerald-500 border-emerald-500" :
                    step.status === "in_progress" ? "bg-brand border-brand" :
                    "bg-transparent border-muted-foreground/50"
                  }`} />
                  <span className={`text-[11px] truncate ${step.status === "pending" ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                    {step.name}
                  </span>
                </div>
              ))}
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
