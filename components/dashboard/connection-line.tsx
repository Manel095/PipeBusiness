"use client"

import { actions } from "@/lib/store"

interface ConnectionLineProps {
  id: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  label?: string
  selected?: boolean
  preview?: boolean
}

export function ConnectionLine({ id, from, to, label, selected, preview }: ConnectionLineProps) {
  const dx = to.x - from.x
  const midX = dx * 0.5
  const pathD = `M${from.x},${from.y} C${from.x + midX},${from.y} ${to.x - midX},${to.y} ${to.x},${to.y}`

  return (
    <g>
      {/* Invisible fat line for easier clicking */}
      {!preview && (
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth={16}
          style={{ cursor: "pointer", pointerEvents: "stroke" }}
          onClick={(e) => {
            e.stopPropagation()
            // Could select connection or show delete option
          }}
        />
      )}

      {/* Visible line */}
      <path
        d={pathD}
        fill="none"
        stroke={preview ? "var(--brand)" : selected ? "var(--brand)" : "var(--border)"}
        strokeWidth={preview ? 1.5 : 2}
        strokeDasharray={preview ? "6 4" : "none"}
        opacity={preview ? 0.6 : 1}
      />

      {/* Animated flow particle */}
      {!preview && (
        <>
          <circle r="4" fill="var(--brand)" opacity="0.7">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href={`#flow-${id}`} />
            </animateMotion>
          </circle>
          <path id={`flow-${id}`} d={pathD} fill="none" stroke="none" />
        </>
      )}

      {/* Label */}
      {label && !preview && (
        <text
          x={(from.x + to.x) / 2}
          y={(from.y + to.y) / 2 - 10}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill="var(--muted-foreground)"
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
      )}

      {/* Delete button on hover */}
      {!preview && selected && (
        <g
          transform={`translate(${(from.x + to.x) / 2}, ${(from.y + to.y) / 2})`}
          style={{ cursor: "pointer", pointerEvents: "all" }}
          onClick={(e) => {
            e.stopPropagation()
            actions.removeConnection(id)
          }}
        >
          <circle r="10" fill="var(--destructive)" />
          <line x1="-4" y1="-4" x2="4" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="-4" x2="-4" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}
