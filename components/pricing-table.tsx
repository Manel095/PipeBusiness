import { Check } from "lucide-react"

export function PricingTable() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Simple pricing. <br className="hidden md:block"/>
            <span className="text-muted-foreground">Infinite scalability.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Starter Plan */}
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-muted-foreground text-sm h-10 mb-6">Perfect for testing visual logic.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <a href="/dashboard" className="block w-full py-3 px-4 bg-background border border-border rounded-full text-center font-bold hover:bg-muted transition-colors mb-8">
              Start Free
            </a>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground"/> Up to 3 trackers</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground"/> Basic visual mapping</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground"/> Standard Webhooks</li>
              <li className="flex items-center gap-3 opacity-50"><span className="w-4 h-4 text-center font-bold">✕</span> Business Intelligence panel</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border-2 border-brand bg-background p-8 shadow-xl relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white px-3 py-1 text-xs font-bold rounded-full">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-2 text-brand">Pro</h3>
            <p className="text-muted-foreground text-sm h-10 mb-6">For growing operational teams.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">$5</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <a href="/dashboard" className="block w-full py-3 px-4 bg-brand text-white rounded-full text-center font-bold hover:bg-[#D4006D] transition-colors mb-8 shadow-md">
              Upgrade to Pro
            </a>
            <ul className="space-y-4 text-sm font-medium text-foreground">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand"/> Up to 20 processes</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand"/> Full access to Business Intelligence</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand"/> Unlimited nested steps</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand"/> Semantic data mapping</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-muted-foreground text-sm h-10 mb-6">For full-scale operations.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold">$12</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <a href="/dashboard" className="block w-full py-3 px-4 bg-foreground text-background rounded-full text-center font-bold hover:bg-foreground/80 transition-colors mb-8">
              Upgrade to Enterprise
            </a>
            <ul className="space-y-4 text-sm text-foreground">
              <li className="flex items-center gap-3"><Check className="w-4 h-4"/> Unlimited trackers & processes</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4"/> Advanced entity lifecycle tracking</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4"/> Priority support</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4"/> Custom integrations</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
