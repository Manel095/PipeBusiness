import {
  ShoppingCart,
  Rocket,
  Briefcase,
  Truck,
  Landmark,
} from "lucide-react"

export type UseCase = {
  id: string
  icon: typeof ShoppingCart
  color: string
  colorBg: string
  badge: string
  title: string
  subtitle: string
  pain: string
  description: string
  nodes: { label: string; sub: string }[]
  connectors: string[]
  kpis: { name: string; example: string }[]
}

export const USE_CASES: UseCase[] = [
  {
    id: "ecommerce",
    icon: ShoppingCart,
    color: "#FF6B35",
    colorBg: "rgba(255,107,53,0.1)",
    badge: "E-Commerce & D2C",
    title: "Omni-channel E-Commerce Operations",
    subtitle:
      "Map the full journey from ad spend to last-mile delivery — and finally see your real margin.",
    pain: "Most e-commerce teams track revenue in Shopify and ad spend in Meta separately. Returns, logistics costs, and actual CAC get buried across tabs. You see top-line growth while net margin silently erodes.",
    description:
      "PipeBusiness connects your ad platforms, storefront, warehouse management, and returns pipeline into a single visual canvas. Each engine tracks its own KPIs while connectors automatically flow order data downstream — so you always know your true cost-per-delivered-order and real ROAS after returns.",
    nodes: [
      { label: "Ad Spend", sub: "Meta / Google Ads" },
      { label: "Storefront", sub: "Shopify / WooCommerce" },
      { label: "Warehouse", sub: "WMS / 3PL" },
      { label: "Returns & LTV", sub: "Post-purchase" },
    ],
    connectors: [
      "Ad Spend → Storefront: Attribution & ROAS tracking",
      "Storefront → Warehouse: Order fulfillment pipeline",
      "Warehouse → Returns & LTV: Delivery + return lifecycle",
    ],
    kpis: [
      { name: "Real ROAS", example: "3.2x (after returns)" },
      { name: "Delivery Cost / Order", example: "$4.80" },
      { name: "Return Rate", example: "8.3%" },
      { name: "Net Contribution Margin", example: "24.1%" },
    ],
  },
  {
    id: "saas",
    icon: Rocket,
    color: "#6366F1",
    colorBg: "rgba(99,102,241,0.1)",
    badge: "B2B SaaS & PLG",
    title: "Product-Led Growth Revenue Pipeline",
    subtitle:
      "Connect product analytics to billing data and see the full lead-to-expansion funnel in one place.",
    pain: "Product teams live in Mixpanel. Finance lives in Stripe. Growth lives in HubSpot. Nobody has a unified view of how a signup becomes an activated user, converts to paid, and eventually expands — or churns.",
    description:
      "PipeBusiness lets you model the entire PLG funnel as interconnected engines: website leads flow into product activation, activation feeds billing events, and billing connects to retention tracking. Each node calculates its own velocity and conversion metrics while connectors propagate cohort data across the pipeline.",
    nodes: [
      { label: "Website Leads", sub: "Landing pages & signups" },
      { label: "Product Activation", sub: "Mixpanel / PostHog" },
      { label: "Billing", sub: "Stripe MRR" },
      { label: "Retention", sub: "Expansion & Churn" },
    ],
    connectors: [
      "Leads → Activation: Signup-to-first-value tracking",
      "Activation → Billing: Trial-to-paid conversion pipeline",
      "Billing → Retention: MRR expansion & churn signals",
    ],
    kpis: [
      { name: "CAC Payback", example: "4.2 months" },
      { name: "Net Revenue Retention", example: "112%" },
      { name: "Lead → Paid Velocity", example: "18 days" },
      { name: "Churn Risk Score", example: "Low (0.12)" },
    ],
  },
  {
    id: "agencies",
    icon: Briefcase,
    color: "#EC4899",
    colorBg: "rgba(236,72,153,0.1)",
    badge: "Service Agencies",
    title: "Agency Client Profitability Tracker",
    subtitle:
      "Know which clients are profitable before the quarter ends — not after.",
    pain: "Agencies discover unprofitable accounts too late. Hours are tracked in Harvest, revenue in QuickBooks, and project status in Asana. By the time someone cross-references them, the quarter is over and the damage is done.",
    description:
      "Model your agency as a pipeline of engines: client acquisition feeds into resource allocation, which connects to project delivery and margin calculation. PipeBusiness automatically maps hours and costs per account, flagging clients whose burn rate exceeds their contract value in real time.",
    nodes: [
      { label: "Client Acquisition", sub: "Pipeline & proposals" },
      { label: "Resource Allocation", sub: "Team capacity" },
      { label: "Project Delivery", sub: "Hours & milestones" },
      { label: "Margin Analysis", sub: "Per-account P&L" },
    ],
    connectors: [
      "Acquisition → Resources: Capacity planning on close",
      "Resources → Delivery: Time tracking & burn rate",
      "Delivery → Margin: Revenue vs. cost reconciliation",
    ],
    kpis: [
      { name: "Profit per Client", example: "$8,240/mo" },
      { name: "Team Utilization", example: "78%" },
      { name: "Campaign Delivery Time", example: "12 days" },
      { name: "At-risk Accounts", example: "2 flagged" },
    ],
  },
  {
    id: "logistics",
    icon: Truck,
    color: "#10B981",
    colorBg: "rgba(16,185,129,0.1)",
    badge: "Logistics & Supply Chain",
    title: "End-to-End Supply Chain Visibility",
    subtitle:
      "Track every shipment from purchase order to last-mile delivery with real-time SLA monitoring.",
    pain: "Supply chain teams juggle ERP systems, customs brokers, warehouse scanners, and delivery partners. A delay at customs doesn't trigger an alert until inventory runs out and an SLA is already breached.",
    description:
      "PipeBusiness models your supply chain as a directed flow: purchase orders feed into transit tracking, which connects to warehouse intake, and finally to last-mile distribution. Connectors carry shipment IDs and ETAs across nodes, so a delay at any point immediately propagates updated timelines to every downstream engine and dashboard.",
    nodes: [
      { label: "Purchase Orders", sub: "Supplier management" },
      { label: "Transit & Customs", sub: "Shipping & clearance" },
      { label: "Warehouse Intake", sub: "Receiving & QC" },
      { label: "Last-Mile Delivery", sub: "Distribution & SLA" },
    ],
    connectors: [
      "Orders → Transit: Shipment tracking & ETA propagation",
      "Transit → Warehouse: Customs clearance → receiving",
      "Warehouse → Last-Mile: Pick-pack-ship pipeline",
    ],
    kpis: [
      { name: "SLA Fulfillment", example: "94.7%" },
      { name: "Days of Inventory", example: "22 days" },
      { name: "Transit Bottlenecks", example: "1 flagged" },
      { name: "On-time Delivery", example: "91.2%" },
    ],
  },
  {
    id: "finance",
    icon: Landmark,
    color: "#0EA5E9",
    colorBg: "rgba(14,165,233,0.1)",
    badge: "Finance & Reconciliation",
    title: "Multi-Gateway Cash Flow Reconciliation",
    subtitle:
      "Reconcile Stripe, PayPal, and bank transfers automatically — and project your runway with confidence.",
    pain: "Finance teams manually reconcile payment gateways every month. Each gateway has different fee structures, payout schedules, and currency conversions. Discrepancies go unnoticed until the bank balance doesn't match the books.",
    description:
      "PipeBusiness turns your financial stack into a reconciliation pipeline. Payment gateways feed into a commissions engine that calculates effective fees, which connects to bank reconciliation, and finally to cash flow projection. Every transaction is traced from gateway to bank statement, with automatic discrepancy detection.",
    nodes: [
      { label: "Payment Gateways", sub: "Stripe / PayPal / Wire" },
      { label: "Commissions & Fees", sub: "Fee calculation" },
      { label: "Bank Reconciliation", sub: "Statement matching" },
      { label: "Cash Flow Projection", sub: "Runway & forecasting" },
    ],
    connectors: [
      "Gateways → Commissions: Fee structure mapping",
      "Commissions → Reconciliation: Net payout matching",
      "Reconciliation → Projection: Verified cash → forecast",
    ],
    kpis: [
      { name: "Effective Fee Rate", example: "2.74%" },
      { name: "Days Sales Outstanding", example: "34 days" },
      { name: "Reconciliation Accuracy", example: "99.8%" },
      { name: "Projected Runway", example: "14.2 months" },
    ],
  },
]
