import { XCircle, CheckCircle2 } from "lucide-react"

export function ProblemSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Dashboards show you the numbers. <br className="hidden md:block"/>
            <span className="text-muted-foreground">They don't show you the flow.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* The Old Way */}
          <div className="rounded-2xl border border-border bg-surface p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold">The Old Way</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Spreadsheets and traditional BI tools are disconnected. You see that you had 100 leads and 10 sales, but you have no idea how data actually travels between departments or where the bottlenecks are hiding.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-red-500 mt-0.5">✕</span> Data silos between tools
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-red-500 mt-0.5">✕</span> Hard-coded integration scripts
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-red-500 mt-0.5">✕</span> No visual mapping of operations
              </li>
            </ul>
          </div>

          {/* The PipeBusiness Way */}
          <div className="rounded-2xl border-2 border-brand/20 bg-brand/5 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CheckCircle2 className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-brand" />
                <h3 className="text-xl font-bold text-foreground">The PipeBusiness Way</h3>
              </div>
              <p className="text-foreground font-medium leading-relaxed mb-6">
                A living, interactive canvas. You don't just see the metrics; you see the exact flow from a Marketing Lead, transforming into a Sales Client, and generating Operations Tasks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-foreground font-medium">
                  <span className="text-brand mt-0.5">✓</span> Visual Semantic Mapping
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground font-medium">
                  <span className="text-brand mt-0.5">✓</span> Entity Lifecycle Tracking
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground font-medium">
                  <span className="text-brand mt-0.5">✓</span> Interactive nested processes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
