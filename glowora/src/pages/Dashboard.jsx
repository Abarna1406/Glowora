import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Heart, ShoppingBag, User, Award, ArrowUpRight } from 'lucide-react'
import { Container, Badge } from '../components/ui/Primitives.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const quickLinks = [
  { label: 'Orders', to: '/orders', icon: Package, sub: 'Track current & past orders' },
  { label: 'Cart', to: '/cart', icon: ShoppingBag, sub: 'Resume your last order' },
  { label: 'Wishlist', to: '/wishlist', icon: Heart, sub: 'Saved listings' },
  { label: 'Profile', to: '/profile', icon: User, sub: 'Business & account details' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <Container className="py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Your Account</p>
          <h1 className="mt-1 font-display text-3xl text-ink md:text-4xl">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-2 text-sm text-ink/55">{user?.email}</p>
        </div>
        {user?.role && <Badge tone="gold"><Award size={11} /> {user.role} Account</Badge>}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((l) => (
          <Link key={l.to} to={l.to} className="group rounded-xl2 border border-line bg-white p-6 transition hover:border-gold/40">
            <div className="flex items-center justify-between">
              <l.icon size={20} className="text-gold-dark" />
              <ArrowUpRight size={14} className="text-ink/25 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
            </div>
            <p className="mt-5 font-display text-lg text-ink">{l.label}</p>
            <p className="mt-1 text-xs text-ink/50">{l.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl2 border border-line bg-sand-light p-8">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Getting started</p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/60">
          Your professional account is verified for trade pricing. Browse the full catalogue to place your first order, or head to Membership to compare priority shipping tiers.
        </p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse the catalogue</Link>
      </div>
    </Container>
  )
}
