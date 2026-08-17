import type { ProcessNode, Connection, DataRow } from "./store"

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

/* ─── processes ─── */
export const DEMO_PROCESSES: ProcessNode[] = [
  {
    id: "proc-marketing",
    name: "Marketing",
    icon: "📣",
    description: "Inbound and outbound marketing campaigns. Tracks leads, ad spend, and conversion rates.",
    position: { x: 120, y: 180 },
    color: "#FF0083",
    status: "active",
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
    steps: [
      { id: uid("step"), name: "Capture Lead", status: "completed" },
      { id: uid("step"), name: "Classify (AI)", status: "in_progress" },
      { id: uid("step"), name: "Conversion Routing", status: "pending" },
    ],
  },
  {
    id: "proc-sales",
    name: "Sales",
    icon: "🤝",
    description: "Pipeline management from lead qualification to closed deals. Tracks revenue and deal stages.",
    position: { x: 480, y: 120 },
    color: "#6366F1",
    status: "active",
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
    steps: [
      { id: uid("step"), name: "Qualification Call", status: "completed" },
      { id: uid("step"), name: "Proposal Sent", status: "in_progress" },
      { id: uid("step"), name: "Negotiation", status: "pending" },
    ],
  },
  {
    id: "proc-operations",
    name: "Operations",
    icon: "⚙️",
    description: "Project delivery and operational efficiency. Tracks active projects, completion rates, and resource utilization.",
    position: { x: 840, y: 180 },
    color: "#10B981",
    status: "active",
    dataSources: [
      { id: uid("ds"), type: "webhook", name: "Jira Webhook", config: { url: "https://hook.pipebusiness.io/jira-ops" }, createdAt: Date.now() - 86400000 * 60 },
    ],
    data: timeSeries(90, (i) => ({
      active_projects: Math.round(12 + Math.sin(i / 10) * 3 + Math.random() * 2),
      completed: Math.round(1 + Math.random() * 3),
      efficiency: +(88 + Math.sin(i / 8) * 6 + Math.random() * 4).toFixed(1),
      team_utilization: +(75 + Math.sin(i / 6) * 10 + Math.random() * 5).toFixed(1),
    })),
  },
  {
    id: "proc-support",
    name: "Support",
    icon: "💬",
    description: "Customer support and ticket management. Tracks CSAT, response times, and resolution rates.",
    position: { x: 320, y: 420 },
    color: "#F59E0B",
    status: "active",
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
  },
  {
    id: "proc-finance",
    name: "Finance",
    icon: "📊",
    description: "Financial overview — MRR, burn rate, runway. Aggregates data from all other processes.",
    position: { x: 680, y: 420 },
    color: "#8B5CF6",
    status: "active",
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
  },
]

/* ─── connections ─── */
export const DEMO_CONNECTIONS: Connection[] = [
  { id: uid("conn"), from: "proc-marketing", to: "proc-sales", label: "Leads" },
  { id: uid("conn"), from: "proc-sales", to: "proc-operations", label: "Projects" },
  { id: uid("conn"), from: "proc-sales", to: "proc-support", label: "Clients" },
  { id: uid("conn"), from: "proc-operations", to: "proc-finance", label: "Revenue" },
  { id: uid("conn"), from: "proc-support", to: "proc-finance", label: "Costs" },
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
