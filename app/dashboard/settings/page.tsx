"use client"

import { Settings, CreditCard, User, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        // Also fetch user's email since it's on auth.users
        setProfile({ ...data, email: user.email })
      }
    }
    loadProfile()
  }, [])

  const handleCheckout = async (priceId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = profile?.subscription_tier || 'free'

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
              <p className="mt-1 text-sm text-foreground">{profile?.email || 'Loading...'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
              <input
                type="text"
                defaultValue={profile?.full_name || ''}
                disabled
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
              <p className="text-sm font-semibold text-foreground capitalize">{currentPlan} Plan</p>
              <p className="text-xs text-muted-foreground">
                {currentPlan === 'free' ? '5 processes · 2 sources each · 30 day retention' : 'Unlimited features'}
              </p>
            </div>
            {currentPlan === 'free' ? (
              <button
                type="button"
                onClick={() => handleCheckout('price_12345')} // Replace with actual test Price ID
                disabled={loading}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                Upgrade to Pro
              </button>
            ) : (
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={loading}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                Manage Subscription
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { id: 'free', priceId: null, name: "Free", price: "$0", features: ["5 processes", "2 sources/process", "3 BI charts", "30 day retention"] },
              { id: 'pro', priceId: 'price_1U5WbvBwme82hGiKLqpZBcxw', name: "Pro", price: "$19/mo", features: ["20 processes", "10 sources/process", "Unlimited charts", "1 year retention"] },
              { id: 'business', priceId: 'price_1U5WbwBwme82hGiKmjln0H8T', name: "Business", price: "$49/mo", features: ["Unlimited processes", "Unlimited sources", "Unlimited charts", "Unlimited retention"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-4 ${
                  currentPlan === plan.id ? "border-brand bg-brand/5" : "border-border"
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
                {currentPlan === plan.id ? (
                  <span className="mt-3 inline-block text-xs font-semibold text-brand">Current plan</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => plan.priceId ? handleCheckout(plan.priceId) : handleManageSubscription()}
                    disabled={loading}
                    className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
                  >
                    Select
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
