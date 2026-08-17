"use client"

import { useSyncExternalStore } from "react"

export type SimSnapshot = {
  tick: number
  resources: number
  leads: number
  clients: number
  projects: number
  benefits: number
  maintenanceCost: number
  // per-tick flow rates (for the pipe particles / labels)
  flow: {
    marketing: number
    sales: number
    operations: number
    maintenance: number
  }
  history: {
    t: number
    leads: number
    clients: number
    benefits: number
    resources: number
    projects: number
  }[]
}

const HISTORY = 24

function seed(): SimSnapshot {
  const history = Array.from({ length: HISTORY }, (_, i) => ({
    t: i,
    leads: 40 + Math.round(Math.sin(i / 3) * 8 + i * 1.5),
    clients: 12 + Math.round(Math.cos(i / 4) * 3 + i * 0.6),
    benefits: 180 + Math.round(i * 9 + Math.sin(i / 2) * 20),
    resources: 620 - Math.round(i * 4 + Math.sin(i / 2) * 15),
    projects: 8 + Math.round(Math.sin(i / 5) * 2 + i * 0.3),
  }))
  const last = history[history.length - 1]
  return {
    tick: HISTORY,
    resources: last.resources,
    leads: last.leads,
    clients: last.clients,
    projects: last.projects,
    benefits: last.benefits,
    maintenanceCost: 14,
    flow: { marketing: 6, sales: 3, operations: 5, maintenance: 2 },
    history,
  }
}

let state: SimSnapshot = seed()
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | null = null

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function step() {
  const prev = state
  // Marketing motor consumes resources -> leads
  const marketing = Math.round(rand(3, 8))
  const newLeads = Math.round(marketing * rand(0.9, 1.6))
  // Sales motor converts leads -> clients
  const sales = Math.round(rand(2, 5))
  const newClients = Math.round(sales * rand(0.4, 0.9))
  // Operations converts clients -> projects + benefits, consumes resources
  const operations = Math.round(rand(4, 7))
  const newProjects = Math.round(rand(0, 2))
  const grossBenefit = Math.round(newClients * rand(6, 11) + prev.projects * rand(0.4, 0.9))
  // Maintenance consumes resources and eats into benefits, adjusts data
  const maintenance = Math.round(rand(1, 3))
  const maintenanceCost = Math.round(rand(8, 20))

  const resourceBurn = marketing + operations + maintenance
  const resourceRefill = Math.round(grossBenefit * 0.35) // reinvest part of benefit
  let resources = prev.resources - resourceBurn + resourceRefill
  resources = Math.max(120, Math.min(920, resources))

  const leads = prev.leads + newLeads - newClients // leads convert out to clients
  const clients = prev.clients + newClients
  const projects = prev.projects + newProjects
  const benefits = prev.benefits + grossBenefit - maintenanceCost

  const t = prev.tick + 1
  const history = [
    ...prev.history.slice(1),
    { t, leads, clients, benefits, resources, projects },
  ]

  state = {
    tick: t,
    resources,
    leads,
    clients,
    projects,
    benefits,
    maintenanceCost,
    flow: { marketing, sales, operations, maintenance },
    history,
  }
  listeners.forEach((l) => l())
}

function ensureRunning() {
  if (timer) return
  timer = setInterval(step, 1600)
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  ensureRunning()
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

function getSnapshot() {
  return state
}

export function useCompanySim() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
