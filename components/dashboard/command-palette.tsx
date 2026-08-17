"use client"

import { useState, useEffect, useRef } from "react"
import { Search, CornerDownLeft, BarChart3, LayoutDashboard, Settings, ArrowRight } from "lucide-react"
import { actions, useWorkspace } from "@/lib/store"
import { useRouter } from "next/navigation"

export function CommandPalette() {
  const workspace = useWorkspace()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Build search items
  const items = [
    ...workspace.processes.map((p) => ({
      id: p.id,
      type: "process" as const,
      icon: p.icon,
      label: p.name,
      desc: `${p.data.length} rows · ${p.dataSources.length} sources`,
      action: () => {
        actions.selectProcess(p.id)
        actions.toggleCommandPalette(false)
      },
    })),
    {
      id: "nav-workspace",
      type: "nav" as const,
      icon: "🗂",
      label: "Go to Workspace",
      desc: "Canvas view",
      action: () => {
        router.push("/dashboard")
        actions.toggleCommandPalette(false)
      },
    },
    {
      id: "nav-intelligence",
      type: "nav" as const,
      icon: "📊",
      label: "Go to Intelligence",
      desc: "Charts & reports",
      action: () => {
        router.push("/dashboard/intelligence")
        actions.toggleCommandPalette(false)
      },
    },
    {
      id: "nav-settings",
      type: "nav" as const,
      icon: "⚙️",
      label: "Go to Settings",
      desc: "Account & subscription",
      action: () => {
        router.push("/dashboard/settings")
        actions.toggleCommandPalette(false)
      },
    },
    {
      id: "add-process",
      type: "action" as const,
      icon: "➕",
      label: "Add new process",
      desc: "Create a new node on the canvas",
      action: () => {
        const id = `proc-${Date.now()}`
        actions.addProcess({
          id,
          name: "New Process",
          icon: "📌",
          description: "",
          position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
          color: "#FF0083",
          dataSources: [],
          data: [],
          status: "draft",
        })
        actions.toggleCommandPalette(false)
      },
    },
  ]

  const filtered = query
    ? items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      )
    : items

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && filtered[selectedIdx]) {
      filtered[selectedIdx].action()
    } else if (e.key === "Escape") {
      actions.toggleCommandPalette(false)
    }
  }

  return (
    <div
      className="command-palette-overlay"
      onClick={() => actions.toggleCommandPalette(false)}
    >
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4.5 w-4.5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search processes, navigate, run actions..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === selectedIdx ? "bg-brand/10 text-brand" : "text-foreground hover:bg-surface"
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </button>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">No results found</p>
          )}
        </div>
      </div>
    </div>
  )
}
