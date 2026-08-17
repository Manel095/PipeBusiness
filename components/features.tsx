import { Network, Webhook, TerminalSquare } from "lucide-react"

const features = [
  {
    icon: Network,
    title: "Visual process mapping",
    body: "Drag, drop, and connect nodes to lay out any workflow — hiring, fulfillment, onboarding. If you can sketch it, you can build it.",
    points: ["Unlimited canvases", "Nested processes", "Real-time collaboration"],
  },
  {
    icon: Webhook,
    title: "Webhook & manual import",
    body: "Point a webhook at any node and watch the numbers update themselves. No integration? Type the value in by hand — it all lives in one place.",
    points: ["Connect any tool", "Auto-refreshing metrics", "Manual entry when you need it"],
  },
  {
    icon: TerminalSquare,
    title: "Quick command bar",
    body: "A CLI for your business data. Type a slash command and any metric appears instantly — no dashboards to dig through, no reports to build.",
    points: ["Slash commands", "Instant answers", "Works from anywhere"],
  },
]

export function Features() {
  return (
    <section id="features" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <h2 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            Everything your business does, in one clear picture
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Three simple building blocks that replace a folder full of spreadsheets and
            a stack of dashboards.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-3xl border border-border bg-background p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <f.icon className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{f.body}</p>
              <ul className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
