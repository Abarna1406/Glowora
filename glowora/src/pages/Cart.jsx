import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import { Container, SectionHeading, EmptyState } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import { useStore } from '../lib/store.jsx'
import { products } from '../lib/data.js'

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartSubtotal } = useStore()
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null)

  const discount = applied ? Math.round(cartSubtotal * 0.1) : 0
  const shipping = cartSubtotal > 15000 || applied ? 0 : 499
  const total = cartSubtotal - discount + shipping
  const recommended = products.slice(10, 14)

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <h1 className="font-display text-3xl text-ink md:text-4xl">Your cart</h1>

      {cart.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={ShoppingBag} title="Your cart is empty" sub="Browse the catalogue to start building a professional order." action={<Link to="/shop" className="btn-primary">Browse catalogue</Link>} />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-line border-y border-line">
            {cart.map((c) => (
              <div key={c.productId} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
                <img src={c.product.img} alt={c.product.name} className="h-24 w-24 rounded-lg object-cover"  loading="lazy" decoding="async" />
                <div className="flex-1">
                  <p className="font-mono text-[10px] text-ink/40">{c.product.sku} · {c.product.brand}</p>
                  <Link to={`/product/${c.product.id}`} className="font-display text-lg text-ink hover:text-gold-dark">{c.product.name}</Link>
                  <p className="mt-1 font-mono text-xs text-ink/45">{c.product.unit} · MOQ {c.product.moq}</p>
                </div>
                <div className="flex items-center rounded-full border border-ink/15">
                  <button onClick={() => updateQty(c.productId, c.qty - c.product.moq)} className="p-2.5"><Minus size={13} /></button>
                  <span className="w-10 text-center font-mono text-xs">{c.qty}</span>
                  <button onClick={() => updateQty(c.productId, c.qty + c.product.moq)} className="p-2.5"><Plus size={13} /></button>
                </div>
                <p className="w-24 text-right font-mono text-sm text-ink">₹{(c.qty * c.product.price).toLocaleString('en-IN')}</p>
                <button onClick={() => removeFromCart(c.productId)} className="text-ink/35 hover:text-clay"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-xl2 border border-line bg-sand-light p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Order summary</p>
            <div className="mt-4 flex gap-2">
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="input-field flex-1 !bg-white" />
              <button
                onClick={() => setApplied(coupon ? coupon.toUpperCase() : null)}
                className="flex items-center gap-1 rounded-lg border border-ink/15 px-4 text-xs font-medium text-ink hover:border-gold"
              >
                <Tag size={12} /> Apply
              </button>
            </div>
            {applied && <p className="mt-2 font-mono text-[11px] text-moss">Code {applied} applied — 10% off</p>}

            <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between text-ink/60"><span>Subtotal</span><span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span></div>
              {discount > 0 && <div className="flex justify-between text-moss"><span>Discount</span><span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span></div>}
              <div className="flex justify-between text-ink/60"><span>Shipping</span><span className="font-mono">{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-medium text-ink"><span>Total</span><span className="font-mono">₹{total.toLocaleString('en-IN')}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 w-full">Proceed to checkout</Link>
            <Link to="/shop" className="btn-ghost mt-1 w-full">Continue shopping</Link>
          </aside>
        </div>
      )}

      <div className="mt-20">
        <SectionHeading eyebrow="Complete Your Order" title="Recommended for your back-bar" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {recommended.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </Container>
  )
}
