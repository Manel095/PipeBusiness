import { FileText, Download, Clock, ArrowRight } from "lucide-react"

export function BiUpsell() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Report Visual */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-xl shadow-brand/5">
          {/* Mini report header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand" />
              <span className="text-sm font-bold">Business Snapshot — Aug 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="text-[10px] font-semibold bg-surface border border-border rounded px-2 py-1 flex items-center gap-1">
                <Download className="w-3 h-3" /> .md
              </button>
            </div>
          </div>

          {/* Mini report content */}
          <div className="font-mono text-xs space-y-3 text-muted-foreground bg-surface rounded-xl p-4 border border-border">
            <p className="text-foreground font-bold text-sm">## Marketing</p>
            <p><span className="text-foreground">Engine Type:</span> leads | <span className="text-foreground">Entity:</span> client</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1 text-foreground">KPI</th>
                    <th className="text-left py-1 text-foreground">Current</th>
                    <th className="text-left py-1 text-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-1">Leads Captured</td><td className="font-bold text-foreground">68</td><td className="text-emerald-500">↑ +12.3%</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1">Cost per Lead</td><td className="font-bold text-foreground">$14.20</td><td className="text-emerald-500">↓ -8.1%</td></tr>
                  <tr><td className="py-1">Ad Spend</td><td className="font-bold text-foreground">$1,042</td><td className="text-red-400">↑ +5.2%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-foreground font-bold text-sm mt-2">## Sales</p>
            <p><span className="text-foreground">Connectors out:</span> Lead Handoff → Sales</p>
            <p className="text-brand">...</p>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand">Intelligence</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
            Generate business snapshots, not just dashboards
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Stop staring at charts. Generate structured Markdown reports that pull live KPIs from every engine.
            Export as <code className="font-mono text-brand">.md</code>, share with your team, or set up periodic templates.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-3 text-sm">
              <FileText className="w-4 h-4 text-brand flex-shrink-0" />
              <span>One-click business snapshots with KPI tables</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Download className="w-4 h-4 text-brand flex-shrink-0" />
              <span>Export as .md files for stakeholder reports</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-brand flex-shrink-0" />
              <span>Report templates with periodic scheduling</span>
            </li>
          </ul>
          <a
            href="/dashboard/intelligence"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#D4006D] hover:shadow-lg"
          >
            Try Report Builder <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
