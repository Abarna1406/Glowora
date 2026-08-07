import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useStore } from '../../lib/store.jsx'
import { EmptyState } from '../ui/Primitives.jsx'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartSubtotal } = useStore()

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-porcelain shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h3 className="font-display text-xl text-ink">Your cart · {cart.length} SKU{cart.length !== 1 && 's'}</h3>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <EmptyState icon={ShoppingBag} title="Your cart is empty" sub="Browse the catalogue and add professional-grade products." />
              ) : (
                <div className="space-y-5">
                  {cart.map((c) => (
                    <div key={c.productId} className="flex gap-4 border-b border-line pb-5">
                      <img src={c.product.img} alt={c.product.name} className="h-20 w-20 rounded-lg object-cover"  loading="lazy" decoding="async" />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] text-ink/40">{c.product.brand}</p>
                        <p className="truncate font-display text-[15px] text-ink">{c.product.name}</p>
                        <p className="mt-1 font-mono text-xs text-ink/50">MOQ {c.product.moq} · ₹{c.product.price.toLocaleString('en-IN')}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center rounded-full border border-ink/15">
                            <button onClick={() => updateQty(c.productId, c.qty - 1)} className="p-1.5"><Minus size={12} /></button>
                            <span className="w-8 text-center font-mono text-xs">{c.qty}</span>
                            <button onClick={() => updateQty(c.productId, c.qty + 1)} className="p-1.5"><Plus size={12} /></button>
                          </div>
                          <button onClick={() => removeFromCart(c.productId)} className="text-ink/35 hover:text-clay">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="font-mono text-sm text-ink">₹{(c.qty * c.product.price).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-ink/60">Subtotal</span>
                  <span className="font-mono text-lg text-ink">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-secondary mb-2 w-full">View cart</Link>
                <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-primary w-full">Checkout</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
