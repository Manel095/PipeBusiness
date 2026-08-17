"use client"

import { useState, useEffect } from "react"
import { Workflow, LayoutDashboard, BarChart3, Settings, Search, ChevronRight, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { actions, useWorkspace } from "@/lib/store"
import { DEMO_PROCESSES, DEMO_CONNECTIONS } from "@/lib/demo-data"
import { CommandPalette } from "@/components/dashboard/command-palette"

const NAV_ITEMS = [
  { label: "Workspace", href: "/dashboard", icon: LayoutDashboard },
  { label: "Intelligence", href: "/dashboard/intelligence", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const workspace = useWorkspace()
  const [initialized, setInitialized] = useState(false)

  // Initialize store with demo data on first load
  useEffect(() => {
    if (!initialized) {
      actions.init({ processes: DEMO_PROCESSES, connections: DEMO_CONNECTIONS })
      setInitialized(true)
    }
  }, [initialized])

  // ⌘K shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        actions.toggleCommandPalette()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="flex items-center gap-2 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground">
            <Workflow className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">PipeBusiness</span>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" strokeWidth={2} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Processes list */}
        <div className="mt-6 px-3">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Processes
            </span>
            <button
              type="button"
              onClick={() => {
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
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {workspace.processes.map((proc) => (
              <button
                key={proc.id}
                type="button"
                onClick={() => actions.selectProcess(proc.id)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors text-left ${
                  workspace.selectedProcessId === proc.id
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <span className="text-base">{proc.icon}</span>
                <span className="flex-1 font-medium truncate">{proc.name}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-auto border-t border-border px-3 py-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">My Workspace</p>
              <p className="text-xs text-muted-foreground">Free plan</p>
            </div>
            <button type="button" className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              {pathname === "/dashboard" ? "Workspace" : pathname === "/dashboard/intelligence" ? "Intelligence" : "Settings"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => actions.toggleCommandPalette()}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="ml-4 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
              M
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {children}
        </div>
      </div>

      {/* Command Palette */}
      {workspace.showCommandPalette && <CommandPalette />}
    </div>
  )
}
