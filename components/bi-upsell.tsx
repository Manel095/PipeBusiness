import { FileText, Download, Clock, ArrowRight } from "lucide-react"

export function BiUpsell() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        {/* Right side in logic, left visually: Copy */}
        <div className="order-2 md:order-1">
          <span className="text-[12px] font-bold uppercase tracking-wider text-brand">Intelligence</span>
          <h2 className="mt-4 text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-foreground leading-[1.1]">
            Generate business snapshots, not just dashboards
          </h2>
          <p className="mt-6 text-[16px] text-foreground/80 leading-relaxed">
            Stop staring at charts. Generate structured Markdown reports that pull live KPIs from every engine.
            Export as <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">.md</code>, share with your team, or set up periodic templates.
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-4 text-[15px] font-medium text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-foreground flex-shrink-0">
                <FileText className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span>One-click business snapshots with KPI tables</span>
            </li>
            <li className="flex items-center gap-4 text-[15px] font-medium text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-foreground flex-shrink-0">
                <Download className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span>Export as .md files for stakeholder reports</span>
            </li>
            <li className="flex items-center gap-4 text-[15px] font-medium text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-foreground flex-shrink-0">
                <Clock className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span>Report templates with periodic scheduling</span>
            </li>
          </ul>
          <a
            href="/dashboard/intelligence"
            className="mt-10 inline-flex items-center gap-2 rounded-[24px] bg-foreground px-8 py-3.5 text-base font-bold text-white transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:shadow-[0_8px_24px_rgba(47,6,47,0.12)] active:scale-95"
          >
            Try Report Builder <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Left side in logic, right visually: Report Visual (Mockup) */}
        <div className="order-1 md:order-2 rounded-[12px] border border-border bg-white p-6 md:p-8 shadow-[0_8px_24px_rgba(47,6,47,0.08)]">
          {/* Mini report header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-foreground" />
              <span className="text-[15px] font-serif font-bold text-foreground">Business Snapshot — Aug 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="text-[11px] font-mono font-bold bg-muted text-foreground rounded px-2 py-1 flex items-center gap-1">
                <Download className="w-3 h-3" /> .md
              </button>
            </div>
          </div>

          {/* Mini report content */}
          <div className="font-mono text-[12px] space-y-4 text-muted-foreground bg-white rounded-lg">
            <h3 className="text-foreground font-serif text-[18px] font-bold">## Marketing</h3>
            <p><span className="text-foreground font-medium">Engine Type:</span> leads | <span className="text-foreground font-medium">Entity:</span> client</p>
            <div className="overflow-x-auto my-4 border border-border rounded-[8px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border text-[11px] uppercase tracking-wider text-foreground">
                    <th className="py-2 px-3 font-semibold">KPI</th>
                    <th className="py-2 px-3 font-semibold">Current</th>
                    <th className="py-2 px-3 font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground font-medium">Leads Captured</td><td className="font-bold text-foreground py-2 px-3">68</td><td className="text-emerald-600 py-2 px-3">↑ +12.3%</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-3 text-foreground font-medium">Cost per Lead</td><td className="font-bold text-foreground py-2 px-3">$14.20</td><td className="text-emerald-600 py-2 px-3">↓ -8.1%</td></tr>
                  <tr><td className="py-2 px-3 text-foreground font-medium">Ad Spend</td><td className="font-bold text-foreground py-2 px-3">$1,042</td><td className="text-red-500 py-2 px-3">↑ +5.2%</td></tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-foreground font-serif text-[18px] font-bold mt-6">## Sales</h3>
            <p><span className="text-foreground font-medium">Connectors out:</span> Lead Handoff → Sales</p>
            <p className="text-brand text-lg">...</p>
          </div>
        </div>

      </div>
    </section>
  )
}
