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
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-foreground">
            <Workflow className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-serif">PipeBusiness</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand transition-all duration-100 ease-out group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="/dashboard"
            className="text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
          >
            Log in
          </a>
          <a
            href="/dashboard"
            className="rounded-[20px] bg-brand px-5 py-2 text-sm font-semibold text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-95 active:scale-95"
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
        <div className="border-t border-border px-5 py-4 md:hidden bg-white">
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
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <a
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-center text-base font-medium text-foreground"
              >
                Log in
              </a>
              <a
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-[20px] bg-brand px-5 py-3 text-center text-base font-semibold text-foreground"
              >
                Start free
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
