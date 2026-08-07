import React from 'react'
import { Bell } from 'lucide-react'
import { Container, EmptyState } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { notifications } from '../lib/data.js'

export default function Notifications() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Notifications' }]} />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink md:text-4xl">Notifications</h1>
        <button className="font-mono text-[11px] text-gold-dark hover:underline">Mark all as read</button>
      </div>

      {notifications.length === 0 ? (
        <div className="mt-10"><EmptyState icon={Bell} title="You're all caught up" sub="New order and price updates will appear here." /></div>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-4 py-5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-gold' : 'bg-line'}`} />
              <div>
                <p className={`text-sm ${n.unread ? 'font-medium text-ink' : 'text-ink/60'}`}>{n.title}</p>
                <p className="mt-1 font-mono text-[11px] text-ink/35">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
