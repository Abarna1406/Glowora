import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Truck, CreditCard, Landmark, Wallet, Check, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Container } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { useStore } from '../lib/store.jsx'
import api from '../lib/api.js'

const steps = ['Address', 'Delivery', 'Payment']
const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card (Stripe)', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery / Pay at Salon', icon: Wallet },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
]

export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useStore()
  const [step, setStep] = useState(0)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('cod') // Default to COD to prevent stripe error out of box
  const [loading, setLoading] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null)
  const [address, setAddress] = useState({
    businessName: 'Lumen Studio & Spa',
    addressLine1: '14, MG Road',
    city: 'Madurai',
    pinCode: '625001',
    state: 'Tamil Nadu',
    gstin: '33AAAAA0000A1Z5'
  })
  const navigate = useNavigate()

  const discount = applied ? Math.round(cartSubtotal * 0.1) : 0
  const shipping = delivery === 'priority' ? 799 : cartSubtotal > 15000 || applied ? 0 : 499
  const total = cartSubtotal - discount + shipping

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)
      const { data } = await api.post('/orders', {
        address,
        deliveryMethod: delivery,
        paymentMethod: payment,
        discount, // Pass discount to backend
        cartItems: cart.map(c => ({ 
          product: c.productId,           // dummy id like 'glw-1000' or real ObjectId
          name: c.product?.name || '',
          sku: c.product?.sku || '',
          img: c.product?.img || '',
          price: c.product?.price || 0,
          qty: c.qty,
        })),
      })
      
      if (data.stripeSessionUrl) {
        window.location.href = data.stripeSessionUrl
      } else {
        clearCart()
        navigate('/checkout/success')
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      toast.error(error.response?.data?.message || 'Failed to place order. If using card, ensure Stripe keys are configured.', {
        style: {
          background: '#FDF2F8', // Tailwind bg-pink-50
          color: '#BE185D', // Tailwind text-pink-700
          border: '1px solid #FBCFE8', // Tailwind border-pink-200
        },
        iconTheme: {
          primary: '#BE185D',
          secondary: '#FDF2F8',
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="font-display text-3xl text-ink md:text-4xl">Checkout</h1>

      <div className="mt-6 flex items-center gap-3 font-mono text-[11px] text-ink/40">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span className="h-px w-8 bg-line" />}
            <span className={i <= step ? 'text-ink' : ''}>{String(i + 1).padStart(2, '0')} {s}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 0 && (
            <div>
              <p className="mb-5 flex items-center gap-2 font-display text-xl text-ink"><MapPin size={18} className="text-gold-dark" /> Delivery address</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input placeholder="Business / salon name" className="input-field sm:col-span-2" value={address.businessName} onChange={(e) => setAddress({ ...address, businessName: e.target.value })} />
                <input placeholder="Address line 1" className="input-field sm:col-span-2" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} />
                <input placeholder="City" className="input-field" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input placeholder="PIN code" className="input-field" value={address.pinCode} onChange={(e) => setAddress({ ...address, pinCode: e.target.value })} />
                <input placeholder="State" className="input-field" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                <input placeholder="GSTIN (for invoicing)" className="input-field" value={address.gstin} onChange={(e) => setAddress({ ...address, gstin: e.target.value })} />
              </div>
              <button onClick={() => setStep(1)} className="btn-primary mt-8">Continue to delivery</button>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-5 flex items-center gap-2 font-display text-xl text-ink"><Truck size={18} className="text-gold-dark" /> Delivery method</p>
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard shipping', desc: '5–7 business days', price: cartSubtotal > 15000 ? 'Free' : '₹499' },
                  { id: 'priority', label: 'Priority shipping', desc: '2–3 business days · Gold & Platinum benefit', price: '₹799' },
                ].map((d) => (
                  <label key={d.id} className={`flex cursor-pointer items-center justify-between rounded-xl2 border p-5 ${delivery === d.id ? 'border-gold bg-gold/5' : 'border-line'}`}>
                    <span className="flex items-center gap-3">
                      <input type="radio" checked={delivery === d.id} onChange={() => setDelivery(d.id)} className="text-gold focus:ring-gold" />
                      <span>
                        <span className="block text-sm font-medium text-ink">{d.label}</span>
                        <span className="block text-xs text-ink/50">{d.desc}</span>
                      </span>
                    </span>
                    <span className="font-mono text-sm text-ink">{d.price}</span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary">Continue to payment</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-5 flex items-center gap-2 font-display text-xl text-ink"><CreditCard size={18} className="text-gold-dark" /> Payment method</p>
              <div className="space-y-3">
                {paymentMethods.map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl2 border p-5 ${payment === m.id ? 'border-gold bg-gold/5' : 'border-line'}`}>
                    <input type="radio" checked={payment === m.id} onChange={() => setPayment(m.id)} className="text-gold focus:ring-gold" />
                    <m.icon size={18} className="text-ink/50" />
                    <span className="text-sm font-medium text-ink">{m.label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                  <Check size={15} /> {loading ? 'Processing...' : `Place order · ₹${total.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl2 border border-line bg-sand-light p-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Order summary</p>
          <div className="max-h-64 space-y-4 overflow-y-auto">
            {cart.map((c) => (
              <div key={c.productId} className="flex items-center gap-3">
                <img src={c.product.img} alt="" className="h-12 w-12 rounded-lg object-cover"  loading="lazy" decoding="async" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-ink">{c.product.name}</p>
                  <p className="font-mono text-[10px] text-ink/40">Qty {c.qty}</p>
                </div>
                <p className="font-mono text-xs text-ink">₹{(c.qty * c.product.price).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-5 border-t border-line pt-5">
            <div className="flex gap-2">
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="input-field flex-1 !bg-white" />
              <button
                onClick={() => {
                  if (coupon) {
                    setApplied(coupon.toUpperCase());
                    toast.success(`Code ${coupon.toUpperCase()} applied!`);
                  }
                }}
                className="flex items-center gap-1 rounded-lg border border-ink/15 px-4 text-xs font-medium text-ink hover:border-gold"
              >
                <Tag size={12} /> Apply
              </button>
            </div>
            {applied && <p className="mt-2 font-mono text-[11px] text-moss">Code {applied} applied — 10% off</p>}
          </div>

          <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-ink/60"><span>Subtotal</span><span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span></div>
            {discount > 0 && <div className="flex justify-between text-moss"><span>Discount</span><span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between text-ink/60"><span>Shipping</span><span className="font-mono">{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-medium text-ink"><span>Total</span><span className="font-mono">₹{total.toLocaleString('en-IN')}</span></div>
          </div>
        </aside>
      </div>
    </Container>
  )
}
