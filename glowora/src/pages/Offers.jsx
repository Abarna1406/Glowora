import React from 'react'
import { Copy, Sparkles, Package2 } from 'lucide-react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import { coupons, products } from '../lib/data.js'
import toast from 'react-hot-toast'

const combos = [
  { title: 'Colour Studio Starter Set', desc: 'Lumière Lab colour crème + developer + gloss top coat', save: '18%', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800' },
  { title: 'Facial Room Essentials', desc: 'Terra Derma cleanse, peel and barrier repair trio', save: '15%', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800' },
  { title: 'Nail Bar Complete Kit', desc: 'Atelier Blanc base, builder gel and top coat set', save: '20%', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800' },
]

export default function Offers() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Offers' }]} />
      <SectionHeading eyebrow="Trade Offers" title="Coupons, festival deals & bundles" sub="Offers are validated at checkout against your membership tier and order volume." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.code} className="rounded-xl2 border border-dashed border-gold/50 bg-gold/5 p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-lg tracking-wide text-ink">{c.code}</p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  toast.success(`Coupon code ${c.code} copied! Use it at checkout.`);
                }}
                className="text-ink/40 hover:text-gold-dark"
              >
                <Copy size={15} />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink/65">{c.desc}</p>
            <div className="mt-4 flex justify-between font-mono text-[11px] text-ink/40">
              <span>{c.min}</span>
              <span>Expires {c.expires}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <SectionHeading eyebrow="Festival Collection" title="Limited-time festival deals" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {products.slice(20, 24).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading eyebrow="Bundle & Save" title="Combo offers" sub="Curated back-bar sets bundled directly with brand partners at a fixed group rate." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {combos.map((c) => (
            <div key={c.title} className="overflow-hidden rounded-xl2 border border-line bg-white">
              <div className="relative h-40">
                <img src={c.img} alt={c.title} className="h-full w-full object-cover"  loading="lazy" decoding="async" />
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[10px] text-porcelain"><Package2 size={11} /> Bundle</span>
              </div>
              <div className="p-5">
                <p className="font-display text-lg text-ink">{c.title}</p>
                <p className="mt-1 text-xs text-ink/50">{c.desc}</p>
                <p className="mt-3 flex items-center gap-1 font-mono text-xs text-gold-dark"><Sparkles size={12} /> Save {c.save} vs. individual pricing</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
