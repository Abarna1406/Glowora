import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import { EmptyState } from '../ui/Primitives.jsx'
import { Link } from 'react-router-dom'

export default function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, addToCart, toggleWishlist } = useStore()
  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm" onClick={() => setWishlistOpen(false)} />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-porcelain shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h3 className="font-display text-xl text-ink">Wishlist · {wishlist.length}</h3>
              <button onClick={() => setWishlistOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {wishlist.length === 0 ? (
                <EmptyState icon={Heart} title="Nothing saved yet" sub="Tap the heart on any product to save it here." />
              ) : (
                <div className="space-y-5">
                  {wishlist.map((p) => (
                    <div key={p.id} className="flex gap-4 border-b border-line pb-5">
                      <img src={p.img} alt={p.name} className="h-20 w-20 rounded-lg object-cover"  loading="lazy" decoding="async" />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] text-ink/40">{p.brand}</p>
                        <p className="truncate font-display text-[15px] text-ink">{p.name}</p>
                        <div className="mt-2 flex gap-3">
                          <button onClick={() => addToCart(p.id, p.moq)} className="flex items-center gap-1 font-mono text-[11px] text-gold-dark"><ShoppingBag size={12} /> Add</button>
                          <button onClick={() => toggleWishlist(p.id)} className="font-mono text-[11px] text-ink/40">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-line px-6 py-5">
              <Link to="/wishlist" onClick={() => setWishlistOpen(false)} className="btn-secondary w-full">View full wishlist</Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
