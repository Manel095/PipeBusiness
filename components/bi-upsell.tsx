import { BarChart3, TrendingUp, AlertCircle } from "lucide-react"

export function BiUpsell() {
  return (
    <section className="py-24 bg-surface border-y border-border overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="mx-auto max-w-6xl px-5 relative z-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 text-brand px-4 py-1.5 text-sm font-bold shadow-sm mb-8">
          <BarChart3 className="w-4 h-4" />
          Pro Feature
        </span>
        
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
          Find bottlenecks instantly with <br/>
          <span className="text-brand">Business Intelligence</span>
        </h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
          Stop guessing where you're losing money. The Business Intelligence panel measures conversion rates between every single node in your visual workflow, highlighting inefficiencies in bright red.
        </p>

        {/* Mock BI Interface */}
        <div className="max-w-4xl mx-auto bg-background rounded-2xl border border-border shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 text-left relative overflow-hidden group">
          <div className="flex-1 space-y-6">
            <h3 className="font-bold text-lg border-b border-border pb-4">Conversion Analysis</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl border border-border bg-surface">
                <div>
                  <div className="text-sm font-semibold">Marketing → Sales</div>
                  <div className="text-xs text-muted-foreground mt-1">Lead to Deal conversion</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> 14.2%</div>
                  <div className="text-xs text-muted-foreground">Healthy</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl border-2 border-red-500/20 bg-red-500/5">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500"/> Sales → Operations</div>
                  <div className="text-xs text-red-500/70 mt-1">Deal to Project handover</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">3.8%</div>
                  <div className="text-xs text-red-500 font-medium">Critical Bottleneck</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-xl font-bold mb-4">Unlock actionable insights.</h4>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Our Pro plan includes full access to the BI engine. Identify exactly where your operations are stalling and optimize your conversion rates mathematically.
            </p>
            <a href="#pricing" className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-foreground text-background font-bold rounded-full hover:bg-foreground/80 transition-colors">
              Upgrade to Pro
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
