import React from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Boxes,
  Ticket, Star, Settings, ArrowLeft, Bell, CalendarCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Logo from '../shared/Logo.jsx'

const links = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { label: 'Appointments', to: '/admin/appointments', icon: CalendarCheck },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Brands', to: '/admin/brands', icon: Tag },
  { label: 'Categories', to: '/admin/categories', icon: Boxes },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
  { label: 'Coupons', to: '/admin/coupons', icon: Ticket },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const { user } = useAuth()
  const location = useLocation()
  return (
    <div className="flex min-h-screen bg-porcelain">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="border-b border-line px-6 py-5">
          <Logo size="sm" />
          <span className="ml-1 font-mono text-[10px] uppercase tracking-widest2 text-gold-dark">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${
                  isActive ? 'bg-ink text-porcelain' : 'text-ink/60 hover:bg-sand-light hover:text-ink'
                }`
              }
            >
              <l.icon size={16} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] text-ink/60 hover:bg-sand-light">
            <ArrowLeft size={15} /> Back to storefront
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-porcelain/90 px-6 py-4 backdrop-blur lg:px-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest2 text-ink/40">Operations</p>
            <h1 className="font-display text-xl text-ink">Welcome back, {user.name.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/60 hover:text-ink">
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold" />
            </button>
            <img
  src={
    user?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=EC4899&color=fff`
  }
  alt={user?.name || "User"}
  className="h-20 w-20 rounded-full object-cover"
/>
          </div>
        </header>
        <div className="px-6 py-8 lg:px-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
