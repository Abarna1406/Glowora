import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, User } from 'lucide-react'
import { Container, Badge, EmptyState } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { appointments } from '../lib/data.js'

const tabs = [
  { id: 'Upcoming', label: 'Upcoming' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Cancelled', label: 'Cancelled' },
]

const statusTone = { Upcoming: 'gold', Completed: 'sand', Cancelled: 'clay' }

export default function Appointments() {
  const [tab, setTab] = useState('Upcoming')
  const filtered = appointments.filter((a) => a.status === tab)

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Appointments' }]} />
      <h1 className="font-display text-3xl text-ink md:text-4xl">Your appointments</h1>

      <div className="mt-6 flex gap-6 border-b border-line">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`pb-4 text-sm font-medium ${tab === t.id ? 'border-b-2 border-gold text-ink' : 'text-ink/45'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title={`No ${tab.toLowerCase()} appointments`}
            sub="Book a salon or spa appointment to see it here."
            action={<Link to="/salons" className="btn-primary">Browse salons</Link>}
          />
        ) : (
          filtered.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl2 border border-line bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-light"><CalendarCheck size={16} className="text-gold-dark" /></div>
                <div>
                  <p className="font-mono text-sm text-ink">{a.id}</p>
                  <p className="mt-0.5 text-sm text-ink">{a.service} · {a.salonName}</p>
                  <p className="font-mono text-[11px] text-ink/40">{a.date} · {a.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink/45"><User size={12} /> {a.professional}</span>
                <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                <p className="font-mono text-sm text-ink">₹{a.total.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  )
}
