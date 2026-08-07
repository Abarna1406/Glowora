import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Heart, Package, Award, Settings as SettingsIcon, Edit3 } from 'lucide-react'
import { Container, Badge } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../lib/store.jsx'
import { orders } from '../lib/data.js'

const quickLinks = [
  { label: 'Orders', to: '/orders', icon: Package, sub: `${orders.length} orders placed` },
  { label: 'Wishlist', to: '/wishlist', icon: Heart, sub: 'Saved listings' },
  { label: 'Membership', to: '/membership', icon: Award, sub: 'Gold tier' },
  { label: 'Settings', to: '/settings', icon: SettingsIcon, sub: 'Notifications & security' },
]

export default function Profile() {
  const { user, wishlist, cart } = useStore()
  const { user: authUser } = useAuth()

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Profile' }]} />

      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={authUser?.name || user.name}
            className="h-20 w-20 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />

          <div>
            <h1 className="font-display text-2xl text-ink md:text-3xl">
              {authUser?.name || user.name}
            </h1>

            <p className="text-sm text-ink/55">
              {authUser?.role || user.role} · {authUser?.business || user.business}
            </p>

            <div className="mt-2">
              <Badge tone="gold">
                {authUser?.tier || user.tier} Member
              </Badge>
            </div>
          </div>
        </div>

        <button className="btn-secondary">
          <Edit3 size={14} /> Edit profile
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-xl2 border border-line bg-white p-6 transition hover:border-gold/40"
          >
            <l.icon size={20} className="text-gold-dark" />
            <p className="mt-4 font-display text-lg text-ink">{l.label}</p>
            <p className="mt-1 text-xs text-ink/50">{l.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl2 border border-line bg-white p-7">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">
            Personal details
          </p>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/50">Full name</dt>
              <dd className="text-ink">{authUser?.name || user.name}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-ink/50">Email</dt>
              <dd className="text-ink">{authUser?.email || user.email}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-ink/50">Business</dt>
              <dd className="text-ink">{authUser?.business || user.business}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-ink/50">Role</dt>
              <dd className="text-ink">{authUser?.role || user.role}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl2 border border-line bg-sand-light p-7">
          <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">
            <MapPin size={13} /> Saved address
          </p>

          <p className="text-sm leading-relaxed text-ink/75">
            Lumen Studio & Spa
            <br />
            14, MG Road, Madurai
            <br />
            Tamil Nadu 625001, India
          </p>

          <button className="btn-ghost mt-4 !px-0">
            Add another address
          </button>
        </div>
      </div>
    </Container>
  )
}