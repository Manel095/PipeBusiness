import { X, Check } from "lucide-react"

export function ProblemSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="mb-16 md:mb-24">
          <h2 className="text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-foreground leading-[1.2]">
            Dashboards show you the numbers.<br />
            <span className="text-muted-foreground">They don't show you the flow.</span>
          </h2>
        </div>

        {/* Asymmetric 2-column layout */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: The Old Way (Narrower, ~5 columns) */}
          <div className="md:col-span-5 rounded-[12px] bg-muted p-8">
            <h3 className="text-lg font-serif font-bold text-foreground mb-4">The Old Way</h3>
            <p className="text-foreground/80 leading-relaxed mb-8 text-[15px]">
              Spreadsheets and traditional BI tools are disconnected. You see that you had 100 leads and 10 sales, but you have no idea how data actually travels between departments or where the bottlenecks are hiding.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={3} /> 
                Data silos between tools
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={3} /> 
                Hard-coded integration scripts
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/70">
                <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={3} /> 
                No visual mapping of operations
              </li>
            </ul>
          </div>

          {/* Right Column: The PipeBusiness Way (Wider, ~7 columns) */}
          <div className="md:col-span-7 rounded-[12px] bg-white p-8 md:p-12 shadow-[0_8px_24px_rgba(47,6,47,0.08)] border border-border relative">
            {/* Subtle Gold Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand rounded-t-[12px]" />
            
            <h3 className="text-[22px] font-serif font-bold text-foreground mb-4">The PipeBusiness Way</h3>
            <p className="text-foreground leading-relaxed mb-8 text-[16px]">
              A living, interactive canvas. You don't just see the metrics; you see the exact flow from a <span className="font-bold underline decoration-wavy decoration-brand decoration-2">Marketing Lead</span>, transforming into a <span className="font-bold underline decoration-wavy decoration-brand decoration-2">Sales Client</span>, and generating Operations Tasks.
            </p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-base font-medium text-foreground">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-foreground flex-shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                Visual Semantic Mapping
              </li>
              <li className="flex items-start gap-4 text-base font-medium text-foreground">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-foreground flex-shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                Entity Lifecycle Tracking
              </li>
              <li className="flex items-start gap-4 text-base font-medium text-foreground">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-foreground flex-shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                Interactive nested processes
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
