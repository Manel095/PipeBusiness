"use client"

import { useState, useEffect, useRef } from "react"
import { Search, CornerDownLeft, ArrowRight, Terminal, CheckCircle2, AlertCircle } from "lucide-react"
import { actions, useWorkspace } from "@/lib/store"
import { useRouter } from "next/navigation"

type CommandResult = { success: boolean; message: string } | null

export function CommandPalette() {
  const workspace = useWorkspace()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [cmdResult, setCmdResult] = useState<CommandResult>(null)
  const [wizard, setWizard] = useState<{
    type: "graph" | "metric"
    step: number
    engine?: string
    chartType?: string
    xAxis?: string
    yAxis?: string
    field?: string
    period?: string
  } | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const isCommand = query.startsWith("/")

  // ─── Command Parser ───
  const executeCommand = (input: string): CommandResult => {
    const parts = input.trim().split(/\s+/)
    const cmd = parts[0]?.toLowerCase()

    // /create <name> <type> <url?>
    if (cmd === "/create") {
      const name = parts[1]
      const type = parts[2] as "webhook" | "api" | undefined
      const url = parts[3]
      if (!name) return { success: false, message: "Usage: /create <EngineName> [webhook|api] [url]" }
      const id = `proc-${Date.now()}`
      actions.addProcess({
        id, name, description: "",
        position: { x: 200 + Math.random() * 300, y: 150 + Math.random() * 200 },
        color: ["#FF0083", "#6366F1", "#10B981", "#F59E0B", "#8B5CF6"][Math.floor(Math.random() * 5)],
        dataSources: type && url ? [{ id: `ds-${Date.now()}`, type, name: `${name} ${type}`, config: { url }, createdAt: Date.now() }] : [],
        data: [], incomingData: [],
        config: { engineType: "custom", inputSchema: [], kpis: [], entityType: "client" },
        status: "active",
      })
      return { success: true, message: `Engine "${name}" created${type ? ` with ${type} at ${url}` : ""}` }
    }

    // /connect <from> <to> <name?>
    if (cmd === "/connect") {
      const fromName = parts[1]
      const toName = parts[2]
      const connName = parts.slice(3).join(" ").replace(/"/g, "") || `${fromName} → ${toName}`
      if (!fromName || !toName) return { success: false, message: 'Usage: /connect <FromEngine> <ToEngine> ["Connector Name"]' }
      const fromProc = workspace.processes.find(p => p.name.toLowerCase() === fromName.toLowerCase())
      const toProc = workspace.processes.find(p => p.name.toLowerCase() === toName.toLowerCase())
      if (!fromProc) return { success: false, message: `Engine "${fromName}" not found` }
      if (!toProc) return { success: false, message: `Engine "${toName}" not found` }
      actions.addConnector({ id: `conn-${Date.now()}`, name: connName, from: fromProc.id, to: toProc.id, dataFlowFields: [] })
      return { success: true, message: `Connector "${connName}" created: ${fromProc.name} → ${toProc.name}` }
    }

    // /update <engine> <type> <url>
    if (cmd === "/update") {
      const engineName = parts[1]
      const type = parts[2] as "webhook" | "api" | undefined
      const url = parts[3]
      if (!engineName || !type || !url) return { success: false, message: "Usage: /update <EngineName> <webhook|api> <url>" }
      const proc = workspace.processes.find(p => p.name.toLowerCase() === engineName.toLowerCase())
      if (!proc) return { success: false, message: `Engine "${engineName}" not found` }
      actions.addDataSource(proc.id, { id: `ds-${Date.now()}`, type, name: `${engineName} ${type}`, config: { url }, createdAt: Date.now() })
      return { success: true, message: `Added ${type} source to "${proc.name}" at ${url}` }
    }

    // /report <engine?> <period?>
    if (cmd === "/report") {
      const engineName = parts[1]
      const period = parts[2] || "snapshot"
      router.push("/dashboard/intelligence")
      actions.toggleCommandPalette(false)
      const proc = engineName ? workspace.processes.find(p => p.name.toLowerCase() === engineName.toLowerCase()) : null
      const reportId = `report-${Date.now()}`
      const title = proc ? `${proc.name} — ${period} report` : `Business Snapshot — ${new Date().toLocaleDateString()}`
      actions.addReport({ id: reportId, title, content: `# ${title}\n\nGenerated on ${new Date().toLocaleString()}\n\n---\n\n`, engineId: proc?.id, createdAt: Date.now(), updatedAt: Date.now(), isTemplate: false })
      return { success: true, message: `Report "${title}" created. Opening Intelligence...` }
    }

    // /status <engine>
    if (cmd === "/status") {
      const engineName = parts[1]
      if (!engineName) return { success: false, message: "Usage: /status <EngineName>" }
      const proc = workspace.processes.find(p => p.name.toLowerCase() === engineName.toLowerCase())
      if (!proc) return { success: false, message: `Engine "${engineName}" not found` }
      const lastRow = proc.data[proc.data.length - 1]
      const kpiSummary = (proc.config?.kpis ?? []).map(kpi => {
        const val = lastRow?.[kpi.field]
        return `${kpi.name}: ${val !== undefined ? (kpi.unit === "currency" ? `$${Number(val).toLocaleString()}` : val) : "N/A"}`
      }).join(" · ")
      return { success: true, message: `${proc.name} (${proc.status}) — ${kpiSummary || "No KPIs defined"}` }
    }

    // /graph
    if (cmd === "/graph") {
      setWizard({ type: "graph", step: 1 })
      return null
    }

    // /metric
    if (cmd === "/metric") {
      setWizard({ type: "metric", step: 1 })
      return null
    }

    return { success: false, message: `Unknown command "${cmd}". Available: /create, /connect, /update, /report, /status, /graph, /metric` }
  }

  // ─── Search Items ───
  const items = [
    ...workspace.processes.map((p) => ({
      id: p.id, type: "process" as const,
      label: p.name, desc: `${p.config?.engineType ?? "custom"} · ${p.dataSources.length} sources`,
      action: () => { actions.selectProcess(p.id); actions.toggleCommandPalette(false) },
    })),
    { id: "nav-workspace", type: "nav" as const, label: "Go to Workspace", desc: "Canvas view",
      action: () => { router.push("/dashboard"); actions.toggleCommandPalette(false) } },
    { id: "nav-intelligence", type: "nav" as const, label: "Go to Intelligence", desc: "Reports & analysis",
      action: () => { router.push("/dashboard/intelligence"); actions.toggleCommandPalette(false) } },
    { id: "nav-connections", type: "nav" as const, label: "Go to Connections", desc: "Manage connectors",
      action: () => { router.push("/dashboard/connections"); actions.toggleCommandPalette(false) } },
    { id: "nav-settings", type: "nav" as const, label: "Go to Settings", desc: "Account & data",
      action: () => { router.push("/dashboard/settings"); actions.toggleCommandPalette(false) } },
  ]

  const filtered = query && !isCommand
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()))
    : items

  useEffect(() => { setSelectedIdx(0); setCmdResult(null) }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (wizard) return // handled by wizard UI

    if (isCommand && e.key === "Enter") {
      e.preventDefault()
      const result = executeCommand(query)
      if (result) {
        setCmdResult(result)
        if (result.success) setTimeout(() => actions.toggleCommandPalette(false), 1500)
      }
      return
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === "Enter" && filtered[selectedIdx]) { filtered[selectedIdx].action() }
    else if (e.key === "Escape") { actions.toggleCommandPalette(false) }
  }

  // ─── Wizard Helpers ───
  const insertToReport = (block: string) => {
    const report = workspace.reports[0] // or currently selected
    if (report) {
      actions.updateReport(report.id, { content: report.content + "\n\n" + block, updatedAt: Date.now() })
      setCmdResult({ success: true, message: "Added to your recent report! Check Intelligence." })
      setTimeout(() => actions.toggleCommandPalette(false), 2000)
    } else {
      setCmdResult({ success: false, message: "No reports available. Create a report first." })
      setWizard(null)
    }
  }

  const handleWizardNext = (updates: Partial<typeof wizard>) => {
    const next = { ...wizard, ...updates } as NonNullable<typeof wizard>
    
    if (next.type === "graph" && next.step > 4) {
      const block = `\`\`\`chart\n${JSON.stringify({
        engine: next.engine, type: next.chartType, xAxis: next.xAxis, yAxis: next.yAxis
      }, null, 2)}\n\`\`\``
      insertToReport(block)
      setWizard(null)
      return
    }
    
    if (next.type === "metric" && next.step > 3) {
      const block = `\`\`\`metric\n${JSON.stringify({
        engine: next.engine, field: next.field, period: next.period
      }, null, 2)}\n\`\`\``
      insertToReport(block)
      setWizard(null)
      return
    }

    setWizard(next)
  }

  const renderWizard = () => {
    if (!wizard) return null

    if (wizard.type === "graph") {
      if (wizard.step === 1) {
        return (
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3">1. Select Engine for Chart</h3>
            <div className="space-y-1">
              {workspace.processes.map(p => (
                <button key={p.id} onClick={() => handleWizardNext({ engine: p.name, step: 2 })} className="w-full text-left px-3 py-2 hover:bg-surface rounded-lg text-sm transition-colors">{p.name}</button>
              ))}
            </div>
          </div>
        )
      }
      if (wizard.step === 2) {
        return (
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3">2. Select Chart Type</h3>
            <div className="space-y-1">
              {["Line", "Bar", "Area"].map(t => (
                <button key={t} onClick={() => handleWizardNext({ chartType: t, step: 3 })} className="w-full text-left px-3 py-2 hover:bg-surface rounded-lg text-sm transition-colors">{t} Chart</button>
              ))}
            </div>
          </div>
        )
      }
      if (wizard.step === 3) {
        const p = workspace.processes.find(pr => pr.name === wizard.engine)
        return (
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3">3. Select X-Axis Field (e.g., date)</h3>
            <div className="space-y-1">
              {p?.config?.inputSchema?.map(f => (
                <button key={f.key} onClick={() => handleWizardNext({ xAxis: f.key, step: 4 })} className="w-full text-left px-3 py-2 hover:bg-surface rounded-lg text-sm transition-colors">{f.label} ({f.key})</button>
              ))}
            </div>
          </div>
        )
      }
      if (wizard.step === 4) {
        const p = workspace.processes.find(pr => pr.name === wizard.engine)
        return (
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3">4. Select Y-Axis Field (e.g., revenue)</h3>
            <div className="space-y-1">
              {p?.config?.inputSchema?.filter(f => f.type === "number" || f.type === "currency").map(f => (
                <button key={f.key} onClick={() => handleWizardNext({ yAxis: f.key, step: 5 })} className="w-full text-left px-3 py-2 hover:bg-surface rounded-lg text-sm transition-colors">{f.label} ({f.key})</button>
              ))}
            </div>
          </div>
        )
      }
    }

    if (wizard.type === "metric") {
      if (wizard.step === 1) {
        return (
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3">1. Select Engine for Metric</h3>
            <div className="space-y-1">
              {workspace.processes.map(p => (
                <button key={p.id} onClick={() => handleWizardNext({ engine: p.name, step: 2 })} className="w-full text-left px-3 py-2 hover:bg-surface rounded-lg text-sm transition-colors">{p.name}</button>
              ))}
            </div>
          </div>
        )
      }
      if (wizard.step === 2) {
        const p = workspace.processes.find(pr => pr.name === wizard.engine)
        return (
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3">2. Select Metric Field to Compare</h3>
            <div className="space-y-1">
              {p?.config?.kpis?.map(k => (
                <button key={k.field} onClick={() => handleWizardNext({ field: k.field, step: 3 })} className="w-full text-left px-3 py-2 hover:bg-surface rounded-lg text-sm transition-colors">{k.name} ({k.field})</button>
              ))}
            </div>
          </div>
        )
      }
      if (wizard.step === 3) {
        return (
          <div className="p-4">
            <h3 className="text-sm font-bold mb-3">3. Select Comparison Period</h3>
            <div className="space-y-1">
              {["day", "week", "month", "quarter", "year"].map(p => (
                <button key={p} onClick={() => handleWizardNext({ period: p, step: 4 })} className="w-full text-left px-3 py-2 hover:bg-surface rounded-lg text-sm transition-colors capitalize">Previous {p}</button>
              ))}
            </div>
          </div>
        )
      }
    }
    return null
  }

  // ─── Command hints ───
  const CMD_HINTS = [
    { cmd: "/create", desc: "<Name> [webhook|api] [url]", example: '/create Marketing webhook https://api.test.com' },
    { cmd: "/connect", desc: '<From> <To> ["Name"]', example: '/connect Marketing Sales "Lead Handoff"' },
    { cmd: "/update", desc: "<Engine> <webhook|api> <url>", example: "/update Marketing webhook https://new.hook.io" },
    { cmd: "/report", desc: "[Engine] [period]", example: "/report Sales monthly" },
    { cmd: "/status", desc: "<Engine>", example: "/status Marketing" },
    { cmd: "/graph", desc: "Open interactive chart wizard", example: "/graph" },
    { cmd: "/metric", desc: "Open comparative metric wizard", example: "/metric" },
  ]

  const matchingHints = isCommand ? CMD_HINTS.filter(h => h.cmd.startsWith(query.split(" ")[0])) : []

  return (
    <div className="command-palette-overlay" onClick={() => actions.toggleCommandPalette(false)}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          {isCommand ? <Terminal className="h-4.5 w-4.5 text-brand flex-shrink-0" /> : <Search className="h-4.5 w-4.5 text-muted-foreground flex-shrink-0" />}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={wizard !== null}
            placeholder={wizard ? `Configuring ${wizard.type}...` : 'Search or type "/" for commands...'}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
          />
          {wizard && (
            <button onClick={() => setWizard(null)} className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">Cancel</button>
          )}
          {!wizard && <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ESC</kbd>}
        </div>

        {wizard && renderWizard()}

        {/* Command Result */}
        {cmdResult && (
          <div className={`mx-2 mt-2 rounded-xl px-4 py-3 flex items-center gap-2 text-sm ${cmdResult.success ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
            {cmdResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {cmdResult.message}
          </div>
        )}

        {/* Command Hints */}
        {isCommand && !cmdResult && !wizard && matchingHints.length > 0 && (
          <div className="p-2 border-b border-border">
            {matchingHints.map(h => (
              <button
                key={h.cmd}
                type="button"
                onClick={() => setQuery(h.example)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface"
              >
                <code className="text-xs text-brand font-mono font-bold">{h.cmd}</code>
                <span className="text-xs text-muted-foreground">{h.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search Results */}
        {!isCommand && !wizard && (
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
                  {item.type === "process" ? (
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-brand/10 text-brand uppercase">{item.label.charAt(0)}</span>
                  ) : (
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-surface border border-border">→</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No results found</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
