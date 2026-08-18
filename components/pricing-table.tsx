import { Check } from "lucide-react"

export function PricingTable() {
  return (
    <section id="pricing" className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-[32px] md:text-[42px] font-serif font-bold tracking-tight text-foreground leading-[1.1]">
            Simple pricing.<br />
            <span className="text-muted-foreground">Infinite scalability.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Starter Plan */}
          <div className="rounded-[12px] border border-border bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-foreground">Starter</h3>
            <p className="text-foreground/80 text-[15px] h-10 mb-6">Perfect for testing visual logic.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-foreground">$0</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <a href="/dashboard" className="block w-full py-3.5 px-4 bg-transparent border-2 border-foreground rounded-[24px] text-center font-bold text-foreground transition-all duration-[400ms] hover:scale-95 active:scale-95 mb-8">
              Start Free
            </a>
            <ul className="space-y-4 text-[15px] text-foreground/80">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" strokeWidth={3}/> Up to 3 trackers</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" strokeWidth={3}/> Basic visual mapping</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" strokeWidth={3}/> Standard Webhooks</li>
              <li className="flex items-center gap-3 opacity-50"><span className="w-4 h-4 text-center font-bold">✕</span> Business Intelligence panel</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="rounded-[12px] border-2 border-brand bg-white p-8 shadow-[0_8px_24px_rgba(47,6,47,0.12)] relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-foreground px-4 py-1 text-[12px] font-bold uppercase tracking-wider rounded-[16px]">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Pro</h3>
            <p className="text-foreground/80 text-[15px] h-10 mb-6">For growing operational teams.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-foreground">$5</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <a href="/dashboard" className="block w-full py-3.5 px-4 bg-brand rounded-[24px] text-center font-bold text-foreground transition-all duration-[400ms] hover:scale-95 hover:shadow-[0_8px_24px_rgba(47,6,47,0.12)] active:scale-95 mb-8">
              Upgrade to Pro
            </a>
            <ul className="space-y-4 text-[15px] font-medium text-foreground">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand" strokeWidth={3}/> Up to 20 processes</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand" strokeWidth={3}/> Full access to Business Intelligence</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand" strokeWidth={3}/> Unlimited nested steps</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-brand" strokeWidth={3}/> Semantic data mapping</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-[12px] border border-border bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-foreground">Enterprise</h3>
            <p className="text-foreground/80 text-[15px] h-10 mb-6">For full-scale operations.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-foreground">$12</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <a href="/dashboard" className="block w-full py-3.5 px-4 bg-foreground rounded-[24px] text-center font-bold text-white transition-all duration-[400ms] hover:scale-95 active:scale-95 mb-8">
              Upgrade to Enterprise
            </a>
            <ul className="space-y-4 text-[15px] text-foreground">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" strokeWidth={3}/> Unlimited trackers & processes</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" strokeWidth={3}/> Advanced entity lifecycle tracking</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" strokeWidth={3}/> Priority support</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground" strokeWidth={3}/> Custom integrations</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
