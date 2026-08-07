import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { notifications } from '../../lib/data.js'

export default function NotificationDropdown({ open, onClose }) {
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
            className="absolute right-0 top-12 z-50 w-80 rounded-xl2 border border-line bg-white p-2 shadow-soft"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-display text-sm text-ink">Notifications</p>
              <Link to="/notifications" onClick={onClose} className="font-mono text-[10px] text-gold-dark hover:underline">View all</Link>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-2 rounded-lg px-3 py-2.5 hover:bg-sand-light">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.unread ? 'bg-gold' : 'bg-transparent'}`} />
                  <div>
                    <p className="text-[13px] leading-snug text-ink/80">{n.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-ink/35">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
