"use client"

import { useState } from "react"
import { X, Webhook, FileSpreadsheet, Keyboard, Globe, Sheet, Zap, Workflow, User, Briefcase, CheckSquare, ShoppingCart, ArrowLeft } from "lucide-react"
import { actions } from "@/lib/store"
import type { DataSourceType } from "@/lib/store"

const SOURCES = [
  { type: "webhook", icon: Webhook, label: "Webhook", desc: "Receive data via HTTP POST from any tool" },
  { type: "csv", icon: FileSpreadsheet, label: "CSV / Excel", desc: "Upload a spreadsheet file" },
  { type: "manual", icon: Keyboard, label: "Manual Entry", desc: "Type data directly into a table" },
  { type: "api", icon: Globe, label: "REST API", desc: "Pull data from any REST endpoint" },
  { type: "google-sheets", icon: Sheet, label: "Google Sheets", desc: "Sync live from a Google Sheet" },
  { type: "zapier", icon: Zap, label: "Zapier", desc: "Connect via Zapier automation" },
  { type: "n8n", icon: Workflow, label: "n8n", desc: "Connect via n8n workflow" },
]

const ENTITY_TYPES = [
  { type: "client", icon: User, label: "Client / Lead", desc: "A person or company" },
  { type: "project", icon: Briefcase, label: "Project", desc: "A multi-stage delivery or operation" },
  { type: "task", icon: CheckSquare, label: "Task / Ticket", desc: "A single unit of work" },
  { type: "sale", icon: ShoppingCart, label: "Single Sale", desc: "A one-off transaction" },
]

export function DataImportModal({ processId }: { processId: string }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedSource, setSelectedSource] = useState<{ type: string; label: string } | null>(null)

  const handleSourceSelect = (src: { type: string; label: string }) => {
    setSelectedSource(src)
    setStep(2)
  }

  const handleEntitySelect = (entityType: string) => {
    if (!selectedSource) return

    const id = `ds-${Date.now()}`
    actions.addDataSource(processId, {
      id,
      type: selectedSource.type as DataSourceType,
      name: selectedSource.label,
      config: {},
      entityType: entityType as any,
      createdAt: Date.now(),
    })
    actions.toggleDataImport(false)
  }

  return (
    <div className="modal-overlay" onClick={() => actions.toggleDataImport(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-1 hover:bg-surface rounded-md">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold">
                {step === 1 ? "Add data source" : "Classify incoming data"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step === 1 ? "Choose how to import data into this process" : `What does the data from ${selectedSource?.label} represent?`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => actions.toggleDataImport(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-6">
          {step === 1 && SOURCES.map((src) => (
            <button
              key={src.type}
              type="button"
              onClick={() => handleSourceSelect({ type: src.type, label: src.label })}
              className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-brand hover:shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <src.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{src.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{src.desc}</p>
              </div>
            </button>
          ))}

          {step === 2 && ENTITY_TYPES.map((ent) => (
            <button
              key={ent.type}
              type="button"
              onClick={() => handleEntitySelect(ent.type)}
              className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-brand hover:shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface text-foreground">
                <ent.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{ent.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{ent.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
