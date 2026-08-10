import React, { useState, useEffect } from 'react'
import { Package, Check, Circle, Loader2 } from 'lucide-react'
import { Container, Badge } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api.js'

const tabs = [
  { id: 'current', label: 'Current', match: (s) => s === 'In Transit' || s === 'Processing' || s === 'Pending' },
  { id: 'completed', label: 'Completed', match: (s) => s === 'Delivered' },
  { id: 'cancelled', label: 'Cancelled', match: (s) => s === 'Cancelled' },
]

const statusTone = { 'Processing': 'gold', 'Pending': 'gold', 'In Transit': 'gold', Delivered: 'sand', Cancelled: 'clay' }

export default function Orders() {
  const [tab, setTab] = useState('current')
  const [expanded, setExpanded] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/orders')
        .then((res) => {
          setOrders(res.data.data || [])
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    } else {
      setOrders([])
      setLoading(false)
    }
  }, [isAuthenticated])

  const filtered = orders.filter((o) => tabs.find((t) => t.id === tab).match(o.orderStatus || 'Processing'))

  if (loading) {
    return (
      <Container className="py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </Container>
    )
  }

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
        {filtered.map((o) => {
          const totalQty = o.items?.reduce((sum, item) => sum + item.qty, 0) || 0
          const orderDate = new Date(o.createdAt).toLocaleDateString()
          const etaDate = new Date(new Date(o.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString() // roughly 4 days from creation
          const status = o.orderStatus || 'Processing'
          
          // Use real timeline if exists, else fallback
          const orderTimeline = o.timeline && o.timeline.length > 0 ? o.timeline : [
             { label: 'Order placed', done: true, date: orderDate },
             { label: 'Verified & packed', done: status !== 'Pending', date: status !== 'Pending' ? orderDate : 'Pending' },
             { label: 'Dispatched', done: status === 'In Transit' || status === 'Delivered', date: status === 'In Transit' || status === 'Delivered' ? orderDate : 'Pending' },
             { label: 'Out for delivery', done: status === 'Delivered', date: status === 'Delivered' ? orderDate : 'Pending' },
             { label: 'Delivered', done: status === 'Delivered', date: status === 'Delivered' ? orderDate : 'Pending' },
          ]

          return (
            <div key={o._id} className="rounded-xl2 border border-line bg-white">
              <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="flex w-full flex-wrap items-center justify-between gap-4 p-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-light"><Package size={16} className="text-gold-dark" /></div>
                  <div>
                    <p className="font-mono text-sm text-ink">{o.orderNumber || o._id}</p>
                    <p className="font-mono text-[11px] text-ink/40">Placed {orderDate} · {totalQty} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone={statusTone[status] || 'gold'}>{status}</Badge>
                  <p className="font-mono text-sm text-ink">₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
              </button>
              {expanded === o._id && (
                <div className="border-t border-line p-6">
                  <p className="mb-5 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Tracking timeline · ETA {etaDate}</p>
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
          )
        })}
      </div>
    </Container>
  )
}
