"use client"

import { useState, useMemo } from "react"
import { useWorkspace, actions, type Report } from "@/lib/store"
import { Plus, FileText, Download, Trash2, Clock, Save, Copy, Eye, Edit3, Calendar } from "lucide-react"
import { MarkdownRenderer } from "@/components/dashboard/markdown-renderer"

export default function IntelligencePage() {
  const workspace = useWorkspace()
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [isPreview, setIsPreview] = useState(true)
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false)

  const reports = workspace.reports ?? []
  const selectedReport = reports.find(r => r.id === selectedReportId)

  // Generate a snapshot report
  const generateSnapshot = () => {
    const now = new Date()
    const lines: string[] = [
      `# Business Snapshot — ${now.toLocaleDateString()}`,
      "",
      `> Generated on ${now.toLocaleString()}`,
      "",
      "---",
      "",
    ]

    for (const proc of workspace.processes) {
      lines.push(`## ${proc.name}`)
      lines.push("")
      lines.push(`**Engine Type:** ${proc.config?.engineType ?? "custom"} | **Entity:** ${proc.config?.entityType ?? "N/A"} | **Status:** ${proc.status}`)
      lines.push("")

      // KPIs
      if (proc.config?.kpis && proc.data.length > 0) {
        const lastRow = proc.data[proc.data.length - 1]
        const prevRow = proc.data.length > 7 ? proc.data[proc.data.length - 8] : proc.data[0]

        lines.push("| KPI | Current | 7d Ago | Trend |")
        lines.push("|-----|---------|--------|-------|")

        for (const kpi of proc.config.kpis) {
          const curr = Number(lastRow[kpi.field] ?? 0)
          const prev = Number(prevRow[kpi.field] ?? curr)
          const delta = prev !== 0 ? ((curr - prev) / prev * 100).toFixed(1) : "0.0"
          const trend = Number(delta) >= 0 ? `↑ +${delta}%` : `↓ ${delta}%`
          const fmt = kpi.unit === "currency" ? `$${curr.toLocaleString()}` : kpi.unit === "percentage" ? `${curr}%` : curr.toLocaleString()
          const fmtPrev = kpi.unit === "currency" ? `$${prev.toLocaleString()}` : kpi.unit === "percentage" ? `${prev}%` : prev.toLocaleString()
          lines.push(`| ${kpi.name} | **${fmt}** | ${fmtPrev} | ${trend} |`)
        }
        lines.push("")
      }

      // Incoming data
      if ((proc.incomingData?.length ?? 0) > 0) {
        lines.push(`**Incoming data:** ${proc.incomingData.length} records received from connectors`)
        lines.push("")
      }

      // Connectors out
      const outConns = workspace.connectors.filter(c => c.from === proc.id)
      if (outConns.length > 0) {
        const targets = outConns.map(c => {
          const target = workspace.processes.find(p => p.id === c.to)
          return `${c.name} → ${target?.name ?? "?"}`
        }).join(", ")
        lines.push(`**Connectors out:** ${targets}`)
        lines.push("")
      }

      lines.push("---")
      lines.push("")
    }

    const content = lines.join("\n")
    const id = `report-${Date.now()}`
    const title = `Business Snapshot — ${now.toLocaleDateString()}`
    actions.addReport({ id, title, content, createdAt: Date.now(), updatedAt: Date.now(), isTemplate: false })
    setSelectedReportId(id)
    setEditContent(content)
    setEditTitle(title)
    setIsPreview(true)
  }

  const selectReport = (r: Report) => {
    setSelectedReportId(r.id)
    setEditContent(r.content)
    setEditTitle(r.title)
  }

  const saveReport = () => {
    if (!selectedReportId) return
    actions.updateReport(selectedReportId, { title: editTitle, content: editContent, updatedAt: Date.now() })
  }

  const setSchedule = (schedule: "daily" | "weekly" | "monthly" | null) => {
    if (!selectedReportId) return
    actions.updateReport(selectedReportId, { schedule, updatedAt: Date.now() })
    setShowScheduleDropdown(false)
  }

  const exportMarkdown = () => {
    const blob = new Blob([editContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${editTitle.replace(/[^a-zA-Z0-9]/g, "_")}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex">
      {/* Sidebar — Reports list */}
      <div className="w-72 border-r border-border bg-surface/50 flex flex-col h-full">
        <div className="px-4 py-4 border-b border-border">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Reports</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {reports.length === 0 && (
            <p className="text-xs text-muted-foreground px-3 py-6 text-center">No reports yet. Generate a snapshot to get started.</p>
          )}
          {reports.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectReport(r)}
              className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors ${
                selectedReportId === r.id ? "bg-brand/10 text-brand" : "text-foreground hover:bg-background"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{r.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(r.updatedAt).toLocaleDateString()}
                {r.schedule && <span className="bg-brand/10 text-brand px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ml-1">🔁 {r.schedule}</span>}
                {r.isTemplate && <span className="bg-brand/10 text-brand px-1.5 py-0.5 rounded text-[9px] font-bold">TEMPLATE</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-border p-3 space-y-2">
          <button
            type="button"
            onClick={generateSnapshot}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Generate Snapshot
          </button>
        </div>
      </div>

      {/* Main — Editor */}
      <div className="flex-1 flex flex-col h-full bg-background">
        {selectedReport ? (
          <>
            {/* Editor Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-3">
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="text-lg font-bold bg-transparent outline-none flex-1 mr-4"
                placeholder="Report title..."
              />
              <div className="flex items-center gap-2">
                <div className="bg-surface border border-border rounded-lg p-0.5 flex items-center mr-2">
                  <button onClick={() => setIsPreview(false)} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${!isPreview ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setIsPreview(true)} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${isPreview ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
                
                <div className="relative">
                  <button onClick={() => setShowScheduleDropdown(!showScheduleDropdown)} className={`flex items-center gap-1.5 text-xs font-semibold bg-surface border border-border rounded-lg px-3 py-1.5 hover:border-brand/30 transition-colors ${selectedReport?.schedule ? "text-brand border-brand/30" : ""}`}>
                    <Calendar className="w-3 h-3" /> {selectedReport?.schedule ? selectedReport.schedule.charAt(0).toUpperCase() + selectedReport.schedule.slice(1) : "Schedule"}
                  </button>
                  {showScheduleDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-32 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-10">
                      <button onClick={() => setSchedule(null)} className="w-full text-left px-4 py-2 text-xs hover:bg-surface transition-colors">None</button>
                      <button onClick={() => setSchedule("daily")} className="w-full text-left px-4 py-2 text-xs hover:bg-surface transition-colors">Daily</button>
                      <button onClick={() => setSchedule("weekly")} className="w-full text-left px-4 py-2 text-xs hover:bg-surface transition-colors">Weekly</button>
                      <button onClick={() => setSchedule("monthly")} className="w-full text-left px-4 py-2 text-xs hover:bg-surface transition-colors">Monthly</button>
                    </div>
                  )}
                </div>

                <button onClick={saveReport} className="flex items-center gap-1.5 text-xs font-semibold bg-surface border border-border rounded-lg px-3 py-1.5 hover:border-brand/30 transition-colors">
                  <Save className="w-3 h-3" /> Save
                </button>
                <button onClick={exportMarkdown} className="flex items-center gap-1.5 text-xs font-semibold bg-surface border border-border rounded-lg px-3 py-1.5 hover:border-brand/30 transition-colors">
                  <Download className="w-3 h-3" /> Export .md
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(editContent) }}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-surface border border-border rounded-lg px-3 py-1.5 hover:border-brand/30 transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button
                  onClick={() => { actions.removeReport(selectedReportId!); setSelectedReportId(null) }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-1.5 hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-surface/30">
              <div className="max-w-4xl mx-auto h-full">
                {isPreview ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none w-full bg-background border border-border rounded-xl p-8 min-h-[500px] shadow-sm">
                    <MarkdownRenderer content={editContent} />
                  </div>
                ) : (
                  <textarea
                    value={editContent}
                    onChange={e => {
                      setEditContent(e.target.value)
                      actions.updateReport(selectedReportId!, { content: e.target.value })
                    }}
                    className="w-full h-full min-h-[500px] bg-background border border-border rounded-xl p-6 outline-none text-sm font-mono leading-relaxed resize-none shadow-sm focus:border-brand/50 transition-colors"
                    placeholder="Write your report in Markdown..."
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold text-foreground">Intelligence Reports</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Generate business snapshots that pull live KPIs from your engines. Export as <code className="font-mono text-brand">.md</code> files to share with your team.
            </p>
            <button
              type="button"
              onClick={generateSnapshot}
              className="mt-6 flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Generate Your First Snapshot
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
