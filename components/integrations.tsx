import { Terminal, Webhook } from "lucide-react"

export function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Command Bar Visual */}
          <div className="order-2 md:order-1 relative rounded-2xl border border-border bg-surface p-6 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <Terminal className="w-5 h-5 text-brand" />
              <div className="text-sm font-mono text-muted-foreground">Command Line Interface</div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-background border border-brand/50 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                <span className="text-brand font-mono font-bold">/</span>
                <span className="text-foreground font-mono">revenue-q3 --filter=won</span>
                <span className="ml-auto w-1.5 h-4 bg-brand animate-pulse"></span>
              </div>
              
              <div className="pl-4 border-l-2 border-brand/20 py-2">
                <div className="text-sm text-muted-foreground mb-1">Instant Result</div>
                <div className="text-2xl font-extrabold text-foreground">$428,500.00</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">+14% vs Q2</div>
              </div>
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm mb-6">
              <Webhook className="w-4 h-4 text-brand" />
              Universal Connectivity
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6">
              Connect to everything. <br/>
              <span className="text-muted-foreground">Control it from anywhere.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              PipeBusiness ingest data from any tool using universal Webhooks and native API listeners. Simply point your ClickUp "Task Closed" events to a node, and watch the pipeline flow automatically.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Prefer keyboard over mouse? Our blazing-fast <strong>Command Bar</strong> lets you query any metric, trace any entity, and execute workflows instantly. Just type <code className="bg-surface border border-border px-1.5 py-0.5 rounded text-sm text-foreground">/revenue-q3</code>.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
