import { ArrowRight, Database, Workflow, CheckCircle2 } from "lucide-react"

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          The Modern Operating System for Business
        </span>

        <h1 className="mt-8 text-balance text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
          Advanced Visual Workflow & Data Mapping for Operations
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Go beyond static dashboards. Map corporate processes, track entity lifecycles, and connect department data in an interactive, automated canvas.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#D4006D] hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Mapping for Free
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Visual Mockup Element */}
      <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-border bg-surface p-4 md:p-8 shadow-2xl shadow-brand/5">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 opacity-90">
          
          {/* Node 1 */}
          <div className="w-64 rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">📣</div>
              <div>
                <h3 className="font-bold text-sm">Marketing</h3>
                <p className="text-xs text-muted-foreground">Lead Engine</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-border pt-4">
              <div className="text-xs flex justify-between"><span className="text-muted-foreground">lead_id</span><span className="font-mono">usr_9821</span></div>
              <div className="text-xs flex justify-between"><span className="text-muted-foreground">source</span><span className="font-mono text-brand">Google Ads</span></div>
            </div>
          </div>

          {/* Connection Line & Mapping */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1 rounded-full mb-2 flex items-center gap-1">
              <Database className="w-3 h-3" /> Semantic Map
            </div>
            <div className="w-1 md:w-32 h-16 md:h-1 bg-gradient-to-b md:bg-gradient-to-r from-emerald-500/40 to-blue-500/40 rounded-full"></div>
            <div className="text-[10px] text-muted-foreground mt-2 font-mono">lead_id → client_id</div>
          </div>

          {/* Node 2 */}
          <div className="w-64 rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl">🤝</div>
              <div>
                <h3 className="font-bold text-sm">Sales</h3>
                <p className="text-xs text-muted-foreground">Deal Engine</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-border pt-4">
              <div className="text-xs flex justify-between"><span className="text-muted-foreground">client_id</span><span className="font-mono">usr_9821</span></div>
              <div className="text-xs flex justify-between"><span className="text-muted-foreground">pipeline</span><span className="font-mono text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Won</span></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
