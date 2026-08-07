import React, { useState } from 'react'
import { Package, Check, Circle } from 'lucide-react'
import { Container, Badge } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { orders, orderTimeline } from '../lib/data.js'

const tabs = [
  { id: 'current', label: 'Current', match: (s) => s === 'In Transit' },
  { id: 'completed', label: 'Completed', match: (s) => s === 'Delivered' },
  { id: 'cancelled', label: 'Cancelled', match: (s) => s === 'Cancelled' },
]

const statusTone = { 'In Transit': 'gold', Delivered: 'sand', Cancelled: 'clay' }

export default function Orders() {
  const [tab, setTab] = useState('current')
  const [expanded, setExpanded] = useState(orders[0]?.id)
  const filtered = orders.filter((o) => tabs.find((t) => t.id === tab).match(o.status))

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Orders' }]} />
      <h1 className="font-display text-3xl text-ink md:text-4xl">Your orders</h1>

      <div className="mt-6 flex gap-6 border-b border-line">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`pb-4 text-sm font-medium ${tab === t.id ? 'border-b-2 border-gold text-ink' : 'text-ink/45'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {filtered.length === 0 && <p className="py-16 text-center text-sm text-ink/45">No {tab} orders.</p>}
        {filtered.map((o) => (
          <div key={o.id} className="rounded-xl2 border border-line bg-white">
            <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="flex w-full flex-wrap items-center justify-between gap-4 p-6 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-light"><Package size={16} className="text-gold-dark" /></div>
                <div>
                  <p className="font-mono text-sm text-ink">{o.id}</p>
                  <p className="font-mono text-[11px] text-ink/40">Placed {o.date} · {o.items} items</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                <p className="font-mono text-sm text-ink">₹{o.total.toLocaleString('en-IN')}</p>
              </div>
            </button>
            {expanded === o.id && (
              <div className="border-t border-line p-6">
                <p className="mb-5 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Tracking timeline · ETA {o.eta}</p>
                <div className="space-y-0">
                  {orderTimeline.map((step, i) => (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${step.done ? 'bg-gold text-ink' : 'border border-ink/20 text-ink/30'}`}>
                          {step.done ? <Check size={12} /> : <Circle size={8} />}
                        </div>
                        {i < orderTimeline.length - 1 && <div className={`h-10 w-px ${step.done ? 'bg-gold' : 'bg-line'}`} />}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm ${step.done ? 'text-ink' : 'text-ink/40'}`}>{step.label}</p>
                        <p className="font-mono text-[11px] text-ink/35">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  )
}
