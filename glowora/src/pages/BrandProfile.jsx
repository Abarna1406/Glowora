import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, SectionHeading, Badge } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import { brands, products } from '../lib/data.js'

export default function BrandProfile() {
  const { id } = useParams()
  const brand = brands.find((b) => b.id === id) || brands[0]
  const brandProducts = products.filter((p) => p.brandId === brand.id)

  return (
    <div>
      <div className="relative h-72 overflow-hidden md:h-96">
        <img src={brand.cover} alt={brand.name} className="h-full w-full object-cover"  loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-10">
          <Badge tone="gold">{brand.tier}</Badge>
          <h1 className="mt-4 font-display text-4xl text-porcelain md:text-5xl">{brand.name}</h1>
          <p className="mt-2 text-sm text-porcelain/70">{brand.tagline} · {brand.origin}</p>
        </Container>
      </div>

      <Container className="py-10">
        <Breadcrumb items={[{ label: 'Brands', to: '/brands' }, { label: brand.name }]} />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <SectionHeading eyebrow="Brand Story" title={`The ${brand.name} formulation house`} sub={brand.story} />
            <SectionHeading eyebrow="Full Catalogue" title={`${brandProducts.length} listings from ${brand.name}`} />
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {brandProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
          <aside className="h-fit rounded-xl2 border border-line bg-sand-light p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink/40">At a glance</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ink/50">Origin</dt><dd className="text-ink">{brand.origin}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/50">Partner tier</dt><dd className="text-ink">{brand.tier}</dd></div>
              <div className="flex justify-between"><dt className="text-ink/50">Active SKUs</dt><dd className="text-ink">{brand.products}</dd></div>
            </dl>
          </aside>
        </div>
      </Container>
    </div>
  )
}
