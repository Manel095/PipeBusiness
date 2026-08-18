import { Terminal, ArrowRight } from "lucide-react"

const COMMANDS = [
  { cmd: '/create Marketing webhook https://api.ads.com/hook', desc: 'Create a Lead Engine with a webhook', delay: 0 },
  { cmd: '/create Sales api https://crm.io/deals', desc: 'Create a Cash Engine with CRM API', delay: 1 },
  { cmd: '/connect Marketing Sales "Lead Handoff"', desc: 'Pipe leads from Marketing to Sales', delay: 2 },
  { cmd: '/report Sales monthly', desc: 'Generate a monthly snapshot', delay: 3 },
]

export function Integrations() {
  return (
    <section id="integrations" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand">Command-Driven</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
            Build your business OS from the command bar
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            No more clicking through menus. Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs font-mono">⌘K</kbd> and
            type commands to create engines, wire connectors, add webhooks, and generate intelligence reports — all in seconds.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="text-sm font-bold">5 core commands</p>
              <p className="text-xs text-muted-foreground">/create · /connect · /update · /report · /status</p>
            </div>
          </div>
        </div>

        {/* CLI Visual */}
        <div className="rounded-2xl border border-border bg-foreground/[0.03] p-1">
          <div className="rounded-xl bg-background border border-border overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">PipeBusiness CLI</span>
            </div>

            {/* Commands */}
            <div className="p-4 space-y-4 font-mono text-sm">
              {COMMANDS.map((c, i) => (
                <div key={i}>
                  <div className="flex items-start gap-2">
                    <span className="text-brand font-bold select-none">$</span>
                    <code className="text-foreground">{c.cmd}</code>
                  </div>
                  <div className="ml-4 mt-1 flex items-center gap-1.5 text-emerald-500 text-xs">
                    <span>✓</span>
                    <span>{c.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
