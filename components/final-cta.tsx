import { Workflow } from "lucide-react"

export function Footer() {
  return (
    <>
      <section className="bg-gradient-to-b from-white via-[#FFDAB9]/40 to-[#FDFDFD] py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-5 text-center">
          <h2 className="text-[42px] md:text-[52px] font-serif font-bold tracking-tight text-foreground leading-[1.1]">
            Ready to see your business flow?
          </h2>
          <p className="mt-6 text-[18px] leading-relaxed text-foreground/80">
            Join the operational leaders building semantic workflows on PipeBusiness today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/dashboard"
              className="flex items-center gap-2 rounded-[24px] bg-brand px-8 py-3.5 text-base font-bold text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:shadow-[0_8px_24px_rgba(47,6,47,0.12)] active:scale-95"
            >
              Start free trial
            </a>
            <a
              href="#pricing"
              className="flex items-center gap-2 rounded-[24px] border-2 border-foreground bg-transparent px-8 py-3.5 text-base font-bold text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 hover:bg-foreground/5 active:scale-95"
            >
              View pricing
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#FDFDFD] border-t border-border pt-16 pb-8">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2 md:col-span-1">
              <a href="#top" className="flex items-center gap-2 font-bold tracking-tight mb-4 text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-foreground">
                  <Workflow className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <span className="text-xl font-serif">PipeBusiness</span>
              </a>
              <p className="text-[14px] text-foreground/70 leading-relaxed">
                The visual operating system for modern business workflows.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-foreground text-[15px]">Product</h4>
              <ul className="space-y-3 text-[14px] text-foreground/70">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#integrations" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground text-[15px]">Use Cases</h4>
              <ul className="space-y-3 text-[14px] text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">Marketing Pipelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sales Handover</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Operations Tracking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground text-[15px]">Legal</h4>
              <ul className="space-y-3 text-[14px] text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-foreground/60">
              © {new Date().getFullYear()} PipeBusiness. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[13px] text-foreground/60">
              <a href="https://twitter.com" className="hover:text-foreground">Twitter</a>
              <a href="https://github.com" className="hover:text-foreground">GitHub</a>
              <a href="https://linkedin.com" className="hover:text-foreground">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
