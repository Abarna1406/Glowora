import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Package, ArrowRight } from 'lucide-react'
import { Container } from '../components/ui/Primitives.jsx'

export default function OrderSuccess() {
  const orderId = 'ORD-' + Math.floor(80000 + Math.random() * 9000)
  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
        <Check size={26} className="text-gold-dark" />
      </div>
      <p className="eyebrow mt-6">Order Confirmed</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Thank you, your order is placed</h1>
      <p className="mt-3 max-w-md text-sm text-ink/55">
        Order <span className="font-mono text-ink">{orderId}</span> has been sent for verification and packing. You'll receive a GST invoice and tracking link by email shortly.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/orders" className="btn-primary"><Package size={15} /> Track this order</Link>
        <Link to="/shop" className="btn-secondary">Continue shopping <ArrowRight size={15} /></Link>
      </div>
    </Container>
  )
}
