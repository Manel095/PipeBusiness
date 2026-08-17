"use client"

import { X, Webhook, FileSpreadsheet, Keyboard, Globe, Sheet, Zap, Workflow } from "lucide-react"
import { actions } from "@/lib/store"

const SOURCES = [
  { type: "webhook", icon: Webhook, label: "Webhook", desc: "Receive data via HTTP POST from any tool" },
  { type: "csv", icon: FileSpreadsheet, label: "CSV / Excel", desc: "Upload a spreadsheet file" },
  { type: "manual", icon: Keyboard, label: "Manual Entry", desc: "Type data directly into a table" },
  { type: "api", icon: Globe, label: "REST API", desc: "Pull data from any REST endpoint" },
  { type: "google-sheets", icon: Sheet, label: "Google Sheets", desc: "Sync live from a Google Sheet" },
  { type: "zapier", icon: Zap, label: "Zapier", desc: "Connect via Zapier automation" },
  { type: "n8n", icon: Workflow, label: "n8n", desc: "Connect via n8n workflow" },
]

export function DataImportModal({ processId }: { processId: string }) {
  return (
    <div className="modal-overlay" onClick={() => actions.toggleDataImport(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">Add data source</h2>
            <p className="text-sm text-muted-foreground">Choose how to import data into this process</p>
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
          {SOURCES.map((src) => (
            <button
              key={src.type}
              type="button"
              onClick={() => {
                const id = `ds-${Date.now()}`
                actions.addDataSource(processId, {
                  id,
                  type: src.type as any,
                  name: src.label,
                  config: {},
                  createdAt: Date.now(),
                })
                actions.toggleDataImport(false)
              }}
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
        </div>
      </div>
    </div>
  )
}
