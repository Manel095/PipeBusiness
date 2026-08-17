"use client"

import { useState } from "react"
import { Workflow, Menu, X } from "lucide-react"

const links = [
  { label: "Features", href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground">
            <Workflow className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg">PipeBusiness</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/dashboard"
            className="text-sm font-semibold text-foreground transition-colors hover:text-brand"
          >
            Log in
          </a>
          <a
            href="/dashboard"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.03]"
          >
            Start free
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/60 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-brand-foreground"
            >
              Start free
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
