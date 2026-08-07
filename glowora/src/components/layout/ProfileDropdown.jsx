import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { User, Package, Heart, Settings, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { label: 'My Profile', to: '/profile', icon: User },
  { label: 'Orders', to: '/orders', icon: Package },
  { label: 'Wishlist', to: '/wishlist', icon: Heart },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard },
]

export default function ProfileDropdown({ open, onClose }) {
  const { user } = useAuth();
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 z-50 w-72 rounded-xl2 border border-line bg-white p-2 shadow-soft"
          >
            <div className="flex items-center gap-3 border-b border-line px-3 py-3">
              
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                <p className="truncate font-mono text-[10px] text-ink/40">{user.business}</p>
              </div>
            </div>
            <div className="py-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-ink/75 hover:bg-sand-light hover:text-ink">
                  <l.icon size={15} /> {l.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-line pt-1">
              <Link to="/login" onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-clay hover:bg-clay/5">
                <LogOut size={15} /> Sign out
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
