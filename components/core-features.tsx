import { Settings2, Link2, Terminal } from "lucide-react"

const FEATURES = [
  {
    icon: Settings2,
    title: "Engine Configuration",
    desc: "Define your business DNA. Each engine has a schema, KPIs, entity type, and data sources. From cash registers to project trackers — configure once, measure forever.",
  },
  {
    icon: Link2,
    title: "Smart Connectors",
    desc: "Many-to-many data pipes between engines. Marketing leads flow directly into your Sales engine as base data, with full field mapping and transformation.",
  },
  {
    icon: Terminal,
    title: "CLI First",
    desc: 'Type /create, /connect, /update, /report. Build your entire operating system from the command bar. No clicking through menus — just type and execute.',
  },
]

export function CoreFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Everything runs on engines
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Each department is a configured engine. Connect them, define what matters, and let the data flow.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-xl hover:shadow-brand/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-6">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
