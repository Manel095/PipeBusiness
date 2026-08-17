import { ArrowRight } from "lucide-react"
import { PipelineAnimation } from "@/components/pipeline-animation"

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pt-16 pb-8 md:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-brand" />
          Your company, running like a machine
        </span>

        <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          Watch your whole business turn like an engine
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Model every process as a pipeline of motors: marketing burns resources into leads,
          sales turns leads into clients, operations converts clients into profit. Track every
          metric with webhooks, query any number by command, and build custom graphs.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-brand-foreground transition-transform hover:scale-[1.03]"
          >
            Start mapping for free
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-surface"
          >
            See how it works
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Free forever plan. No credit card needed.</p>
      </div>

      <PipelineAnimation />
    </section>
  )
}
