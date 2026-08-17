import { Workflow } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <a href="#top" className="flex items-center gap-2 font-bold tracking-tight mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                <Workflow className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-lg">PipeBusiness</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The visual operating system for modern business workflows.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#integrations" className="hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Use Cases</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Marketing Pipelines</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Sales Handover</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Operations Tracking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PipeBusiness. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://twitter.com" className="hover:text-foreground">Twitter</a>
            <a href="https://github.com" className="hover:text-foreground">GitHub</a>
            <a href="https://linkedin.com" className="hover:text-foreground">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

