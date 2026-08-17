"use client"

import { useEffect, useState, useRef } from "react"

/* ─── animation timing (ms) ─── */
const STAGE_DELAY = 600
const NODE_STAGGER = 400
const CONNECTION_DELAY = 1800
const DATA_DELAY = 2800
const LOOP_PAUSE = 5000
const TOTAL_CYCLE = STAGE_DELAY + 3 * NODE_STAGGER + CONNECTION_DELAY + DATA_DELAY + LOOP_PAUSE

/* ─── node definitions ─── */
const NODES = [
  { id: "marketing", label: "Marketing", icon: "📣", x: 140, y: 160, metrics: [{ k: "Leads", v: "1,247" }, { k: "CPL", v: "$12.40" }] },
  { id: "sales", label: "Sales", icon: "🤝", x: 440, y: 160, metrics: [{ k: "Deals", v: "84" }, { k: "Revenue", v: "$48k" }] },
  { id: "operations", label: "Operations", icon: "⚙️", x: 740, y: 160, metrics: [{ k: "Projects", v: "32" }, { k: "Efficiency", v: "94%" }] },
  { id: "support", label: "Support", icon: "💬", x: 290, y: 360, metrics: [{ k: "Tickets", v: "156" }, { k: "CSAT", v: "4.8" }] },
  { id: "finance", label: "Finance", icon: "📊", x: 590, y: 360, metrics: [{ k: "MRR", v: "$127k" }, { k: "Burn", v: "$34k" }] },
]

const CONNECTIONS = [
  { from: "marketing", to: "sales", fromSide: "right" as const, toSide: "left" as const },
  { from: "sales", to: "operations", fromSide: "right" as const, toSide: "left" as const },
  { from: "sales", to: "support", fromSide: "bottom" as const, toSide: "top" as const },
  { from: "operations", to: "finance", fromSide: "bottom" as const, toSide: "right" as const },
  { from: "support", to: "finance", fromSide: "right" as const, toSide: "left" as const },
]

const NODE_W = 180
const NODE_H = 72
const PORT_POSITIONS = {
  left: (x: number, y: number) => ({ px: x, py: y + NODE_H / 2 }),
  right: (x: number, y: number) => ({ px: x + NODE_W, py: y + NODE_H / 2 }),
  top: (x: number, y: number) => ({ px: x + NODE_W / 2, py: y }),
  bottom: (x: number, y: number) => ({ px: x + NODE_W / 2, py: y + NODE_H }),
}

export function PipelineAnimation() {
  const [stage, setStage] = useState(0)
  const [visibleNodes, setVisibleNodes] = useState<number>(0)
  const [showConnections, setShowConnections] = useState(false)
  const [showData, setShowData] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 480, y: 260 })
  const [showCursor, setShowCursor] = useState(false)
  const [cursorClick, setCursorClick] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    function clearTimers() {
      timerRef.current.forEach(clearTimeout)
      timerRef.current = []
    }

    function runCycle() {
      clearTimers()
      setStage(0)
      setVisibleNodes(0)
      setShowConnections(false)
      setShowData(false)
      setShowCursor(false)
      setCursorClick(false)

      const t = (fn: () => void, ms: number) => {
        const id = setTimeout(fn, ms)
        timerRef.current.push(id)
        return id
      }

      // Stage 1: show cursor moving to center
      t(() => {
        setStage(1)
        setShowCursor(true)
        setCursorPos({ x: 480, y: 260 })
      }, STAGE_DELAY)

      // Stage 2: nodes appear one by one
      NODES.forEach((node, i) => {
        t(() => {
          setCursorPos({ x: node.x + NODE_W / 2, y: node.y + NODE_H / 2 })
          setCursorClick(true)
          setTimeout(() => setCursorClick(false), 150)
          setVisibleNodes(i + 1)
        }, STAGE_DELAY + 600 + i * NODE_STAGGER)
      })

      // Stage 3: connections draw
      t(() => {
        setShowCursor(false)
        setShowConnections(true)
      }, STAGE_DELAY + 600 + NODES.length * NODE_STAGGER + CONNECTION_DELAY)

      // Stage 4: data cards appear
      t(() => {
        setShowData(true)
      }, STAGE_DELAY + 600 + NODES.length * NODE_STAGGER + CONNECTION_DELAY + DATA_DELAY)

      // Loop
      t(() => {
        runCycle()
      }, TOTAL_CYCLE + 3000)
    }

    runCycle()
    return clearTimers
  }, [])

  return (
    <div className="mx-auto mt-14 max-w-5xl">
      <div className="hero-canvas-frame">
        {/* Window chrome */}
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-border" />
            <span className="h-3 w-3 rounded-full bg-border" />
            <span className="h-3 w-3 rounded-full bg-border" />
          </div>
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="hero-live-dot" />
            Live workspace preview
          </span>
        </div>

        {/* Canvas area */}
        <div className="hero-canvas-area">
          {/* Dot grid background */}
          <svg className="hero-grid-svg" width="100%" height="100%">
            <defs>
              <pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="var(--border)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>

          {/* SVG connections layer */}
          <svg className="hero-connections-svg" viewBox="0 0 960 520">
            {showConnections && CONNECTIONS.map((conn, i) => {
              const fromNode = NODES.find(n => n.id === conn.from)!
              const toNode = NODES.find(n => n.id === conn.to)!
              const { px: x1, py: y1 } = PORT_POSITIONS[conn.fromSide](fromNode.x, fromNode.y)
              const { px: x2, py: y2 } = PORT_POSITIONS[conn.toSide](toNode.x, toNode.y)

              const dx = x2 - x1
              const dy = y2 - y1
              const cx1 = x1 + dx * 0.4
              const cy1 = y1
              const cx2 = x2 - dx * 0.4
              const cy2 = y2

              const pathD = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`

              return (
                <g key={conn.from + conn.to}>
                  {/* connection line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="2"
                    className="hero-connection-path"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                  {/* flow particle */}
                  <circle r="4" fill="var(--brand)" className="hero-particle" style={{ animationDelay: `${i * 200 + 800}ms` }}>
                    <animateMotion dur="2.4s" begin={`${i * 0.2 + 0.8}s`} repeatCount="indefinite">
                      <mpath href={`#hero-path-${i}`} />
                    </animateMotion>
                  </circle>
                  <path id={`hero-path-${i}`} d={pathD} fill="none" stroke="none" />
                </g>
              )
            })}
          </svg>

          {/* Process nodes */}
          {NODES.map((node, i) => (
            <div
              key={node.id}
              className={`hero-node ${i < visibleNodes ? "hero-node-visible" : ""}`}
              style={{
                left: `${(node.x / 960) * 100}%`,
                top: `${(node.y / 520) * 100}%`,
                width: `${(NODE_W / 960) * 100}%`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="hero-node-inner">
                <span className="hero-node-icon">{node.icon}</span>
                <div className="hero-node-info">
                  <span className="hero-node-label">{node.label}</span>
                  <span className="hero-node-status">
                    <span className="hero-status-dot" />
                    Active
                  </span>
                </div>
                {/* Connection ports */}
                <span className="hero-port hero-port-left" />
                <span className="hero-port hero-port-right" />
                <span className="hero-port hero-port-top" />
                <span className="hero-port hero-port-bottom" />
              </div>

              {/* Metric card */}
              {showData && (
                <div className="hero-metric-card" style={{ animationDelay: `${i * 150}ms` }}>
                  {node.metrics.map((m) => (
                    <div key={m.k} className="hero-metric-row">
                      <span className="hero-metric-key">{m.k}</span>
                      <span className="hero-metric-val">{m.v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Animated cursor */}
          {showCursor && (
            <div
              className={`hero-cursor ${cursorClick ? "hero-cursor-click" : ""}`}
              style={{
                left: `${(cursorPos.x / 960) * 100}%`,
                top: `${(cursorPos.y / 520) * 100}%`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--foreground)">
                <path d="M5 3l14 9-6 2-4 7-1-8-6-2z" />
              </svg>
            </div>
          )}

          {/* Floating toolbar */}
          <div className="hero-toolbar">
            <div className="hero-toolbar-btn hero-toolbar-btn-active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div className="hero-toolbar-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14" />
              </svg>
            </div>
            <div className="hero-toolbar-sep" />
            <div className="hero-toolbar-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 14 4 9 9 4" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
