import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ShoppingBag, Share2, ShieldCheck, Minus, Plus, Truck, Check, PlaySquare } from 'lucide-react'
import { Container, Price, RatingStars, Badge, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import ReviewCard from '../components/cards/ReviewCard.jsx'
import { products } from '../lib/data.js'
import { useStore } from '../lib/store.jsx'

const sampleReviews = [
  { name: 'Studio Alina', role: 'Salon · Seoul', rating: 5, text: 'Consistent batch to batch — our colourists no longer adjust process time between orders.', date: 'Jun 2026' },
  { name: 'Belline Hair', role: 'Salon · Milan', rating: 4.5, text: 'Excellent product, wish the 1L format shipped faster in peak season.', date: 'May 2026' },
  { name: 'Skin Clinic Priya', role: 'Clinic · Bengaluru', rating: 5, text: 'Clients ask specifically for this line now. Reordering monthly.', date: 'Apr 2026' },
]

const tabs = ['Description', 'Ingredients', 'Usage', 'Reviews']

export default function ProductDetails() {
  const { id } = useParams()
  const product = products.find((p) => p.id === id) || products[0]
  const { addToCart, toggleWishlist, wishlistIds } = useStore()
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(product.moq)
  const [tab, setTab] = useState('Description')
  const inWishlist = wishlistIds.includes(product.id)
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Shop', to: '/shop' }, { label: product.category, to: `/category/${product.categoryId}` }, { label: product.name }]} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-xl2 bg-black relative aspect-[4/5] sm:aspect-auto sm:h-[460px]">
            {product.videoUrl && activeImg === 'video' ? (
              <iframe
                src={product.videoUrl.replace('watch?v=', 'embed/')}
                className="h-full w-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img src={product.gallery[activeImg] || product.img} alt={product.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            )}
            {product.isAnimated && (
              <div className="absolute top-4 left-4 bg-gold/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest backdrop-blur-md">
                3D / Animated
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.videoUrl && (
              <button onClick={() => setActiveImg('video')} className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-ink/5 flex items-center justify-center ${activeImg === 'video' ? 'border-gold' : 'border-transparent'}`}>
                <PlaySquare className="text-ink/40" />
              </button>
            )}
            {product.gallery?.map((g, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${activeImg === i ? 'border-gold' : 'border-transparent'}`}>
                <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-[11px] text-ink/40">{product.sku}</p>
            {product.professionalOnly && <Badge tone="gold"><ShieldCheck size={10} /> Professional Use</Badge>}
            {!product.inStock && <Badge tone="clay">Out of stock</Badge>}
          </div>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest2 text-ink/40">
            <Link to={`/brands/${product.brandId}`} className="hover:text-gold-dark">{product.brand}</Link>
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink md:text-4xl">{product.name}</h1>
          <div className="mt-3"><RatingStars rating={product.rating} reviews={product.reviews} /></div>

          <div className="mt-6"><Price price={product.price} mrp={product.mrp} size="lg" /></div>
          <p className="mt-1 font-mono text-xs text-ink/45">per unit · {product.unit} · MOQ {product.moq} units</p>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/60">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-ink/15">
              <button onClick={() => setQty((q) => Math.max(product.moq, q - product.moq))} className="p-3"><Minus size={14} /></button>
              <span className="w-10 text-center font-mono text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + product.moq)} className="p-3"><Plus size={14} /></button>
            </div>
            <button onClick={() => addToCart(product.id, qty)} className="btn-primary min-w-[160px] flex-1">
              <ShoppingBag size={15} /> Add to cart
            </button>
            <button onClick={() => toggleWishlist(product.id)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 hover:border-clay">
              <Heart size={17} className={inWishlist ? 'fill-clay text-clay' : 'text-ink/60'} />
            </button>
            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/60 hover:border-gold">
              <Share2 size={16} />
            </button>
          </div>

          <div className="mt-8 space-y-2 rounded-xl2 border border-line bg-sand-light p-5">
            <p className="flex items-center gap-2 text-xs text-ink/60"><Truck size={14} className="text-gold-dark" /> Priority shipping for Gold & Platinum members</p>
            <p className="flex items-center gap-2 text-xs text-ink/60"><ShieldCheck size={14} className="text-gold-dark" /> Verified professional listing — batch-tested</p>
          </div>

          <div className="mt-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Benefits</p>
            <ul className="space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-ink/65"><Check size={14} className="mt-0.5 shrink-0 text-gold-dark" /> {b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <div className="flex flex-wrap gap-8 border-b border-line">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pb-4 text-sm font-medium transition ${tab === t ? 'border-b-2 border-gold text-ink' : 'text-ink/45'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="max-w-2xl py-8 text-sm leading-relaxed text-ink/65">
          {tab === 'Description' && <p>{product.description}</p>}
          {tab === 'Ingredients' && <p className="font-mono text-xs leading-relaxed">{product.ingredients}</p>}
          {tab === 'Usage' && <p>{product.usage}</p>}
          {tab === 'Reviews' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {sampleReviews.map((r, i) => <ReviewCard key={i} review={r} />)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading eyebrow="Complete The Order" title="Related listings" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </Container>
  )
}
