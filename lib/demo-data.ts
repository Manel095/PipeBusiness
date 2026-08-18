import type { ProcessNode, Connector, DataRow, EngineConfig, SchemaField, KPIDefinition } from "./store"

/* ─── helper ─── */
let _id = 0
function uid(prefix = "id") {
  return `${prefix}-${++_id}-${Date.now().toString(36)}`
}

/* ─── generate time-series rows ─── */
function timeSeries(days: number, baseFn: (i: number) => DataRow): DataRow[] {
  const now = Date.now()
  const DAY = 86_400_000
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - i) * DAY)
    return {
      date: date.toISOString().slice(0, 10),
      ...baseFn(i),
    }
  })
}

/* ─── Engine Configs ─── */
const MARKETING_CONFIG: EngineConfig = {
  engineType: "leads",
  entityType: "client",
  inputSchema: [
    { key: "lead_id", label: "Lead ID", type: "string" },
    { key: "source", label: "Source", type: "string" },
    { key: "ad_spend", label: "Ad Spend", type: "currency" },
    { key: "impressions", label: "Impressions", type: "number" },
    { key: "clicks", label: "Clicks", type: "number" },
  ],
  kpis: [
    { id: uid("kpi"), name: "Leads Captured", field: "leads", unit: "count", direction: "up" },
    { id: uid("kpi"), name: "Cost per Lead", field: "cpl", unit: "currency", direction: "down" },
    { id: uid("kpi"), name: "Ad Spend", field: "ad_spend", unit: "currency", direction: "down" },
  ],
}

const SALES_CONFIG: EngineConfig = {
  engineType: "cash",
  entityType: "sale",
  inputSchema: [
    { key: "client_id", label: "Client ID", type: "string" },
    { key: "deal_value", label: "Deal Value", type: "currency" },
    { key: "stage", label: "Pipeline Stage", type: "string" },
    { key: "meetings", label: "Meetings", type: "number" },
  ],
  kpis: [
    { id: uid("kpi"), name: "Deals Won", field: "deals_won", unit: "count", direction: "up" },
    { id: uid("kpi"), name: "Revenue", field: "revenue", unit: "currency", direction: "up" },
    { id: uid("kpi"), name: "Conversion Rate", field: "conversion_rate", unit: "percentage", direction: "up" },
  ],
}

const OPERATIONS_CONFIG: EngineConfig = {
  engineType: "projects",
  entityType: "project",
  inputSchema: [
    { key: "project_id", label: "Project ID", type: "string" },
    { key: "client_id", label: "Client ID", type: "string" },
    { key: "milestone", label: "Milestone", type: "string" },
    { key: "completion", label: "Completion %", type: "number" },
  ],
  kpis: [
    { id: uid("kpi"), name: "Active Projects", field: "active_projects", unit: "count", direction: "up" },
    { id: uid("kpi"), name: "Efficiency", field: "efficiency", unit: "percentage", direction: "up" },
    { id: uid("kpi"), name: "Team Utilization", field: "team_utilization", unit: "percentage", direction: "up" },
  ],
}

const SUPPORT_CONFIG: EngineConfig = {
  engineType: "custom",
  entityType: "task",
  inputSchema: [
    { key: "ticket_id", label: "Ticket ID", type: "string" },
    { key: "client_id", label: "Client ID", type: "string" },
    { key: "priority", label: "Priority", type: "string" },
    { key: "resolved", label: "Resolved", type: "boolean" },
  ],
  kpis: [
    { id: uid("kpi"), name: "Open Tickets", field: "tickets", unit: "count", direction: "down" },
    { id: uid("kpi"), name: "CSAT Score", field: "csat", unit: "count", direction: "up" },
    { id: uid("kpi"), name: "Avg Response (min)", field: "avg_response_min", unit: "time", direction: "down" },
  ],
}

const FINANCE_CONFIG: EngineConfig = {
  engineType: "billing",
  entityType: "transaction",
  inputSchema: [
    { key: "invoice_id", label: "Invoice ID", type: "string" },
    { key: "amount", label: "Amount", type: "currency" },
    { key: "status", label: "Status", type: "string" },
    { key: "due_date", label: "Due Date", type: "date" },
  ],
  kpis: [
    { id: uid("kpi"), name: "MRR", field: "mrr", unit: "currency", direction: "up" },
    { id: uid("kpi"), name: "Burn Rate", field: "burn_rate", unit: "currency", direction: "down" },
    { id: uid("kpi"), name: "Runway (months)", field: "runway_months", unit: "count", direction: "up" },
  ],
}

/* ─── processes ─── */
export const DEMO_PROCESSES: ProcessNode[] = [
  {
    id: "proc-marketing",
    name: "Marketing",
    description: "Inbound and outbound marketing campaigns. Tracks leads, ad spend, and conversion rates.",
    position: { x: 120, y: 180 },
    color: "#FF0083",
    status: "active",
    config: MARKETING_CONFIG,
    dataSources: [
      { id: uid("ds"), type: "webhook", name: "Google Ads Webhook", config: { url: "https://hook.pipebusiness.io/gads-12x" }, createdAt: Date.now() - 86400000 * 30 },
      { id: uid("ds"), type: "google-sheets", name: "Campaign Tracker", config: { sheetId: "1BxiM..." }, createdAt: Date.now() - 86400000 * 15 },
    ],
    data: timeSeries(90, (i) => ({
      leads: Math.round(30 + Math.sin(i / 7) * 12 + i * 0.4 + Math.random() * 8),
      ad_spend: Math.round(800 + Math.sin(i / 5) * 200 + Math.random() * 100),
      cpl: +(12 + Math.sin(i / 10) * 4 + Math.random() * 2).toFixed(2),
      impressions: Math.round(5000 + i * 40 + Math.random() * 1000),
      clicks: Math.round(400 + i * 3 + Math.random() * 60),
    })),
    incomingData: [],
    steps: [
      { id: uid("step"), name: "Capture Lead", status: "completed" },
      { id: uid("step"), name: "Classify (AI)", status: "in_progress" },
      { id: uid("step"), name: "Conversion Routing", status: "pending" },
    ],
  },
  {
    id: "proc-sales",
    name: "Sales",
    description: "Pipeline management from lead qualification to closed deals. Tracks revenue and deal stages.",
    position: { x: 480, y: 120 },
    color: "#6366F1",
    status: "active",
    config: SALES_CONFIG,
    dataSources: [
      { id: uid("ds"), type: "api", name: "CRM API", config: { endpoint: "https://api.crm.co/deals" }, createdAt: Date.now() - 86400000 * 45 },
      { id: uid("ds"), type: "manual", name: "Manual Deals", config: {}, createdAt: Date.now() - 86400000 * 10 },
    ],
    data: timeSeries(90, (i) => ({
      deals_won: Math.round(2 + Math.sin(i / 8) * 1.5 + Math.random() * 2),
      revenue: Math.round(8000 + i * 120 + Math.sin(i / 6) * 2000 + Math.random() * 1500),
      pipeline_value: Math.round(45000 + i * 300 + Math.random() * 5000),
      meetings: Math.round(5 + Math.random() * 4),
      conversion_rate: +(18 + Math.sin(i / 12) * 5 + Math.random() * 3).toFixed(1),
    })),
    incomingData: [
      { lead_id: "usr_9821", source: "Google Ads", value: 1200, received_at: "2026-08-15" },
      { lead_id: "usr_9822", source: "LinkedIn", value: 3400, received_at: "2026-08-16" },
      { lead_id: "usr_9823", source: "Referral", value: 8500, received_at: "2026-08-17" },
    ],
    steps: [
      { id: uid("step"), name: "Qualification Call", status: "completed" },
      { id: uid("step"), name: "Proposal Sent", status: "in_progress" },
      { id: uid("step"), name: "Negotiation", status: "pending" },
    ],
  },
  {
    id: "proc-operations",
    name: "Operations",
    description: "Project delivery and operational efficiency. Tracks active projects, completion rates, and resource utilization.",
    position: { x: 840, y: 180 },
    color: "#10B981",
    status: "active",
    config: OPERATIONS_CONFIG,
    dataSources: [
      { id: uid("ds"), type: "webhook", name: "Jira Webhook", config: { url: "https://hook.pipebusiness.io/jira-ops" }, createdAt: Date.now() - 86400000 * 60 },
    ],
    data: timeSeries(90, (i) => ({
      active_projects: Math.round(12 + Math.sin(i / 10) * 3 + Math.random() * 2),
      completed: Math.round(1 + Math.random() * 3),
      efficiency: +(88 + Math.sin(i / 8) * 6 + Math.random() * 4).toFixed(1),
      team_utilization: +(75 + Math.sin(i / 6) * 10 + Math.random() * 5).toFixed(1),
    })),
    incomingData: [
      { client_id: "usr_9821", project: "Website Redesign", deal_value: 12000, received_at: "2026-08-14" },
    ],
  },
  {
    id: "proc-support",
    name: "Support",
    description: "Customer support and ticket management. Tracks CSAT, response times, and resolution rates.",
    position: { x: 320, y: 420 },
    color: "#F59E0B",
    status: "active",
    config: SUPPORT_CONFIG,
    dataSources: [
      { id: uid("ds"), type: "webhook", name: "Intercom Webhook", config: { url: "https://hook.pipebusiness.io/intercom" }, createdAt: Date.now() - 86400000 * 20 },
      { id: uid("ds"), type: "csv", name: "Monthly CSAT Export", config: { delimiter: "," }, createdAt: Date.now() - 86400000 * 5 },
    ],
    data: timeSeries(90, (i) => ({
      tickets: Math.round(15 + Math.sin(i / 5) * 5 + Math.random() * 6),
      resolved: Math.round(12 + Math.sin(i / 5) * 4 + Math.random() * 5),
      csat: +(4.2 + Math.sin(i / 14) * 0.5 + Math.random() * 0.3).toFixed(1),
      avg_response_min: Math.round(8 + Math.random() * 12),
    })),
    incomingData: [],
  },
  {
    id: "proc-finance",
    name: "Finance",
    description: "Financial overview — MRR, burn rate, runway. Aggregates data from all other processes.",
    position: { x: 680, y: 420 },
    color: "#8B5CF6",
    status: "active",
    config: FINANCE_CONFIG,
    dataSources: [
      { id: uid("ds"), type: "api", name: "Stripe API", config: { endpoint: "https://api.stripe.com/v1/charges" }, createdAt: Date.now() - 86400000 * 90 },
      { id: uid("ds"), type: "google-sheets", name: "P&L Sheet", config: { sheetId: "1CyNx..." }, createdAt: Date.now() - 86400000 * 30 },
    ],
    data: timeSeries(90, (i) => ({
      mrr: Math.round(95000 + i * 1200 + Math.sin(i / 8) * 5000 + Math.random() * 3000),
      burn_rate: Math.round(34000 + Math.sin(i / 12) * 4000 + Math.random() * 2000),
      runway_months: +(14 + Math.sin(i / 15) * 2 + Math.random()).toFixed(1),
      arr: Math.round((95000 + i * 1200) * 12),
    })),
    incomingData: [],
  },
]

/* ─── connectors (many-to-many, named) ─── */
export const DEMO_CONNECTORS: Connector[] = [
  { id: uid("conn"), name: "Lead Handoff", from: "proc-marketing", to: "proc-sales", dataFlowFields: ["lead_id", "source", "value"] },
  { id: uid("conn"), name: "Project Pipeline", from: "proc-sales", to: "proc-operations", dataFlowFields: ["client_id", "deal_value", "project"] },
  { id: uid("conn"), name: "Client Support", from: "proc-sales", to: "proc-support", dataFlowFields: ["client_id", "company"] },
  { id: uid("conn"), name: "Revenue Stream", from: "proc-operations", to: "proc-finance", dataFlowFields: ["invoice_id", "amount", "milestone"] },
  { id: uid("conn"), name: "Cost Allocation", from: "proc-support", to: "proc-finance", dataFlowFields: ["ticket_id", "cost", "resolution_time"] },
]

/* ─── all available metric keys per process ─── */
export function getMetricKeys(processId: string): string[] {
  const proc = DEMO_PROCESSES.find((p) => p.id === processId)
  if (!proc || proc.data.length === 0) return []
  return Object.keys(proc.data[0]).filter((k) => k !== "date")
}

/* ─── aggregate data across all processes ─── */
export function getAllMetrics(): { processId: string; processName: string; metric: string; latestValue: number }[] {
  const out: { processId: string; processName: string; metric: string; latestValue: number }[] = []
  for (const proc of DEMO_PROCESSES) {
    if (proc.data.length === 0) continue
    const lastRow = proc.data[proc.data.length - 1]
    for (const [k, v] of Object.entries(lastRow)) {
      if (k === "date") continue
      out.push({ processId: proc.id, processName: proc.name, metric: k, latestValue: Number(v) })
    }
  }
  return out
}

/* ─── Engine type labels ─── */
export const ENGINE_TYPE_LABELS: Record<string, string> = {
  cash: "Cash Engine",
  projects: "Project Engine",
  billing: "Billing Engine",
  leads: "Lead Engine",
  custom: "Custom Engine",
}
