"use client"

import { Settings, CreditCard, User, Bell } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and subscription</p>

        {/* Account */}
        <div className="mt-8 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-bold">Account</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
              <p className="mt-1 text-sm text-foreground">manelopez1995@gmail.com</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
              <input
                type="text"
                defaultValue="Manel"
                className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="mt-5 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-bold">Subscription</h2>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Free Plan</p>
              <p className="text-xs text-muted-foreground">5 processes · 2 sources each · 30 day retention</p>
            </div>
            <button
              type="button"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.02]"
            >
              Upgrade to Pro
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { name: "Free", price: "$0", features: ["5 processes", "2 sources/process", "3 BI charts", "30 day retention"], current: true },
              { name: "Pro", price: "$19/mo", features: ["20 processes", "10 sources/process", "Unlimited charts", "1 year retention"] },
              { name: "Business", price: "$49/mo", features: ["Unlimited processes", "Unlimited sources", "Unlimited charts", "Unlimited retention"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-4 ${
                  plan.current ? "border-brand bg-brand/5" : "border-border"
                }`}
              >
                <p className="text-sm font-bold">{plan.name}</p>
                <p className="mt-1 text-xl font-extrabold text-foreground">{plan.price}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <span className="mt-3 inline-block text-xs font-semibold text-brand">Current plan</span>
                ) : (
                  <button
                    type="button"
                    className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    Select
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-5 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-bold">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when metrics change significantly</p>
            </div>
            <button
              type="button"
              className="relative h-6 w-11 rounded-full bg-brand/20 transition-colors"
            >
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-brand transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
