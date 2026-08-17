import { Network, Database, GitMerge } from "lucide-react"

export function CoreFeatures() {
  const features = [
    {
      title: "Nested Processes",
      description: "Expandable containers. Click on a main node like 'Marketing' to reveal internal steps: Capture → Classification → Conversion.",
      icon: <Network className="w-6 h-6 text-brand" />,
    },
    {
      title: "Semantic Data Mapping",
      description: "Visual schema routing. Click a connection line to define exactly what data travels between nodes, mapping lead_id to client_id effortlessly.",
      icon: <Database className="w-6 h-6 text-brand" />,
    },
    {
      title: "Entity Lifecycle Tracking",
      description: "Relational tracking. Select a Client and instantly view their associated Projects and real-time ClickUp tasks in one place.",
      icon: <GitMerge className="w-6 h-6 text-brand" />,
    }
  ]

  return (
    <section id="features" className="py-24 bg-surface/50 border-y border-border">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Architected for scale. <br className="hidden md:block"/>
            <span className="text-muted-foreground">Designed for humans.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            We've taken complex data engineering concepts and turned them into a visual, drag-and-drop experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-background p-8 hover:border-brand/30 transition-colors shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
