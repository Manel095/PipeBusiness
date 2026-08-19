import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { USE_CASES } from "@/components/use-cases/use-cases-data"
import { SiteNav } from "@/components/site-nav"
import { Footer } from "@/components/final-cta"
import { ArrowRight, CheckCircle2, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return USE_CASES.map((uc) => ({
    id: uc.id,
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const useCase = USE_CASES.find((uc) => uc.id === params.id)
  if (!useCase) return { title: "Not Found" }
  return {
    title: `${useCase.title} — PipeBusiness Use Case`,
    description: useCase.description,
  }
}

export default async function UseCaseDetailPage(props: Props) {
  const params = await props.params
  const useCase = USE_CASES.find((uc) => uc.id === params.id)

  if (!useCase) {
    notFound()
  }

  const Icon = useCase.icon

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand selection:text-white flex flex-col">
      <SiteNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-muted/30 pt-20 pb-24 border-b border-border">
          <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
          <div className="mx-auto max-w-5xl px-5 relative z-10 text-center">
            <div
              className="inline-flex items-center justify-center rounded-2xl p-4 mb-6"
              style={{ backgroundColor: useCase.colorBg, color: useCase.color }}
            >
              <Icon className="h-10 w-10" />
            </div>
            <div className="mb-4 flex justify-center">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: useCase.colorBg, color: useCase.color }}
              >
                {useCase.badge}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {useCase.title}
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              {useCase.subtitle}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-5 grid md:grid-cols-[1fr_300px] gap-12 items-start">
            
            <div className="space-y-16">
              {/* Problem & Solution */}
              <div>
                <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {useCase.pain}
                </p>
                <h2 className="text-2xl font-bold mb-4">How PipeBusiness Solves It</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {useCase.description}
                </p>
              </div>

              {/* Step by Step */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  Step-by-Step Workflow
                </h2>
                <div className="relative border-l-2 border-border ml-3 space-y-8 pl-8">
                  {useCase.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white font-bold text-sm shadow-sm ring-4 ring-background">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar: Data In / Out & KPIs */}
            <div className="space-y-8 sticky top-24">
              
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <ArrowDownToLine className="h-5 w-5 text-foreground" />
                  Data Inputs
                </h3>
                <ul className="space-y-3">
                  {useCase.inputs.map((input, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                      <span>{input}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <ArrowUpFromLine className="h-5 w-5 text-foreground" />
                  Data Outputs
                </h3>
                <ul className="space-y-3">
                  {useCase.outputs.map((output, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                      <span>{output}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Tracked KPIs</h3>
                <div className="space-y-4">
                  {useCase.kpis.map((kpi, idx) => (
                    <div key={idx}>
                      <div className="text-sm font-medium text-muted-foreground mb-1">{kpi.name}</div>
                      <div className="text-lg font-bold text-foreground">{kpi.example}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
