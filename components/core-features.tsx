import { Settings2, Link2, Terminal } from "lucide-react"

export function CoreFeatures() {
  return (
    <section id="features" className="mx-auto max-w-[1200px] px-5 py-16 md:py-20">
      <div className="mb-16 md:mb-20 max-w-[700px]">
        <h2 className="text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-foreground leading-[1.1]">
          Everything runs on engines
        </h2>
        <p className="mt-4 text-foreground/80 text-[16px] md:text-lg leading-relaxed">
          Each department is a configured engine. Connect them, define what matters, and let the data flow.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Large Tile: Engine Configuration (7 columns) */}
        <div className="md:col-span-7 rounded-[12px] border border-border bg-white p-8 md:p-10 shadow-sm transition-shadow duration-300 hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-foreground">
              <Settings2 className="h-7 w-7" />
            </div>
            <h3 className="mb-3 font-serif text-[24px] font-bold text-foreground">Engine Configuration</h3>
            <p className="text-[15px] leading-relaxed text-foreground/80 max-w-[400px]">
              Define your business DNA. Each engine has a schema, KPIs, entity type, and data sources. From cash registers to project trackers — configure once, measure forever.
            </p>
          </div>
          <div className="mt-8 h-[160px] w-full rounded-lg bg-surface border border-border bg-[radial-gradient(#E8DEE3_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
             <div className="bg-white px-6 py-4 rounded-xl border border-border shadow-sm font-mono text-[13px] text-foreground font-medium">
               schema: &#123; <br/>
               &nbsp;&nbsp;id: string, <br/>
               &nbsp;&nbsp;value: number <br/>
               &#125;
             </div>
          </div>
        </div>

        {/* Stacked Smaller Tiles (5 columns) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Smart Connectors */}
          <div className="flex-1 rounded-[12px] border border-border bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Link2 className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-serif text-[20px] font-bold text-foreground">Smart Connectors</h3>
            <p className="text-[14px] leading-relaxed text-foreground/80">
              Many-to-many data pipes between engines. Marketing leads flow directly into your Sales engine as base data, with full field mapping and transformation.
            </p>
          </div>

          {/* CLI First */}
          <div className="flex-1 rounded-[12px] border border-border bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-serif text-[20px] font-bold text-foreground">CLI First</h3>
            <p className="text-[14px] leading-relaxed text-foreground/80">
              Type <code className="font-mono text-[12px] bg-muted px-1.5 py-0.5 rounded">/create</code>, <code className="font-mono text-[12px] bg-muted px-1.5 py-0.5 rounded">/connect</code>. Build your entire operating system from the command bar. No clicking through menus.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}
