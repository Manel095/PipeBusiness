import { ArrowRight, Workflow } from "lucide-react"

export function FinalCta() {
  return (
    <section id="cta" className="mx-auto max-w-6xl px-5 pb-20 md:pb-28">
      <div className="rounded-[2rem] bg-brand px-6 py-16 text-center text-brand-foreground md:px-16 md:py-24">
        <h2 className="mx-auto max-w-2xl text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Start mapping your business for free
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-brand-foreground/90">
          Draw your first process in minutes. Connect a webhook, ask a question, and
          finally see everything in one place.
        </p>
        <a
          href="#"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-background px-8 py-4 text-base font-semibold text-foreground transition-transform hover:scale-[1.03]"
        >
          Get started — it&apos;s free
          <ArrowRight className="h-5 w-5" />
        </a>
        <p className="mt-4 text-sm text-brand-foreground/80">
          No credit card. No sales call. Cancel anytime.
        </p>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer id="pricing" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground">
            <Workflow className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg">PipeBusiness</span>
        </a>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#" className="hover:text-foreground">Pricing</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
        </nav>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PipeBusiness</p>
      </div>
    </footer>
  )
}
