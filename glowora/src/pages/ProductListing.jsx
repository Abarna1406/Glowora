import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, X, ChevronDown, Star } from 'lucide-react'
import { Container, Price, RatingStars, Badge, Skeleton } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import Pagination from '../components/shared/Pagination.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import { products, categories, brands } from '../lib/data.js'
import { useStore } from '../lib/store.jsx'

const PAGE_SIZE = 12
const MAX_PRICE = 35000
const sortOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'discount', label: 'Highest Discount' },
]
const ratingOptions = [
  { id: 0, label: 'Any rating' },
  { id: 4.5, label: '4.5 & above' },
  { id: 4, label: '4 & above' },
  { id: 3.5, label: '3.5 & above' },
]

export default function ProductListing() {
  const { categoryId } = useParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { addToCart } = useStore()

  const [selectedCats, setSelectedCats] = useState(categoryId ? [categoryId] : [])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState(MAX_PRICE)
  const [minRating, setMinRating] = useState(0)
  const [proOnly, setProOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [discountOnly, setDiscountOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [bestsellerOnly, setBestsellerOnly] = useState(false)
  const [newArrivalOnly, setNewArrivalOnly] = useState(false)
  const [sort, setSort] = useState('relevance')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)

  const activeCategory = categoryId ? categories.find((c) => c.id === categoryId) : null

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedCats.length && !selectedCats.includes(p.categoryId)) return false
      if (selectedBrands.length && !selectedBrands.includes(p.brandId)) return false
      if (p.price > priceRange) return false
      if (minRating && p.rating < minRating) return false
      if (proOnly && !p.professionalOnly) return false
      if (inStockOnly && !p.inStock) return false
      if (discountOnly && p.discount < 10) return false
      if (featuredOnly && !p.featured) return false
      if (bestsellerOnly && !p.bestseller) return false
      if (newArrivalOnly && !p.newArrival) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'discount') list = [...list].sort((a, b) => b.discount - a.discount)
    return list
  }, [selectedCats, selectedBrands, priceRange, minRating, proOnly, inStockOnly, discountOnly, featuredOnly, bestsellerOnly, newArrivalOnly, sort])

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 320)
    return () => clearTimeout(t)
  }, [selectedCats, selectedBrands, priceRange, minRating, proOnly, inStockOnly, discountOnly, featuredOnly, bestsellerOnly, newArrivalOnly, sort, page, view])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggle = (arr, setArr, id) => setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id])

  const clearAll = () => {
    setSelectedCats([])
    setSelectedBrands([])
    setPriceRange(MAX_PRICE)
    setMinRating(0)
    setProOnly(false)
    setInStockOnly(false)
    setDiscountOnly(false)
    setFeaturedOnly(false)
    setBestsellerOnly(false)
    setNewArrivalOnly(false)
    setPage(1)
  }

  const FiltersPanel = (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Category</p>
        <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center justify-between text-sm text-ink/70">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked={selectedCats.includes(c.id)} onChange={() => { toggle(selectedCats, setSelectedCats, c.id); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
                {c.name}
              </span>
              <span className="font-mono text-xs text-ink/35">{c.count}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Brand</p>
        <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={selectedBrands.includes(b.id)} onChange={() => { toggle(selectedBrands, setSelectedBrands, b.id); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
              {b.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Price up to ₹{priceRange.toLocaleString('en-IN')}</p>
        <input type="range" min="200" max={MAX_PRICE} step="200" value={priceRange} onChange={(e) => { setPriceRange(Number(e.target.value)); setPage(1) }} className="w-full accent-gold" />
      </div>
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Rating</p>
        <div className="space-y-2.5">
          {ratingOptions.map((r) => (
            <label key={r.id} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input type="radio" name="rating" checked={minRating === r.id} onChange={() => { setMinRating(r.id); setPage(1) }} className="text-gold focus:ring-gold" />
              <span className="flex items-center gap-1">
                {r.id > 0 && <Star size={12} className="fill-gold text-gold" />}
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Availability &amp; Discount</p>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => { setInStockOnly(e.target.checked); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
          In stock only
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={discountOnly} onChange={(e) => { setDiscountOnly(e.target.checked); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
          On sale (10%+ off)
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={proOnly} onChange={(e) => { setProOnly(e.target.checked); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
          Professional use only
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => { setFeaturedOnly(e.target.checked); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={bestsellerOnly} onChange={(e) => { setBestsellerOnly(e.target.checked); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
          Best seller
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={newArrivalOnly} onChange={(e) => { setNewArrivalOnly(e.target.checked); setPage(1) }} className="rounded border-ink/30 text-gold focus:ring-gold" />
          New arrival
        </label>
      </div>
      <button onClick={clearAll} className="font-mono text-[11px] text-gold-dark hover:underline">
        Clear all filters
      </button>
    </div>
  )

  return (
    <Container className="py-10">
      <Breadcrumb items={activeCategory ? [{ label: 'Shop', to: '/shop' }, { label: activeCategory.name }] : [{ label: 'Shop' }]} />
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink md:text-4xl">{activeCategory ? activeCategory.name : 'The Full Catalogue'}</h1>
          <p className="mt-2 text-sm text-ink/55">{filtered.length} products across trusted beauty brands</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 border-r border-line pr-8">{FiltersPanel}</div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 text-sm text-ink/70 lg:hidden">
              <SlidersHorizontal size={15} /> Filters
            </button>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-full border border-line bg-white py-2 pl-4 pr-9 font-mono text-xs text-ink/70 outline-none focus:border-gold"
                >
                  {sortOptions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" />
              </div>
              <div className="flex items-center gap-1 rounded-full border border-line p-1">
                <button onClick={() => setView('grid')} className={`rounded-full p-1.5 ${view === 'grid' ? 'bg-ink text-porcelain' : 'text-ink/40'}`}><LayoutGrid size={14} /></button>
                <button onClick={() => setView('list')} className={`rounded-full p-1.5 ${view === 'list' ? 'bg-ink text-porcelain' : 'text-ink/40'}`}><List size={14} /></button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="mt-4 h-3.5 w-1/3" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="py-20 text-center text-sm text-ink/50">No products match these filters yet. Try widening your price range or clearing a filter.</div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {pageItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="space-y-5">
              {pageItems.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="flex gap-5 rounded-xl2 border border-line bg-white p-4 transition hover:border-gold/40">
                  <img src={p.img} alt={p.name} className="h-28 w-28 shrink-0 rounded-lg object-cover"  loading="lazy" decoding="async" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-[10px] text-ink/40">{p.sku}</p>
                        {p.discount > 0 && <Badge tone="gold">{p.discount}% off</Badge>}
                        {p.professionalOnly && <Badge tone="outline">Pro</Badge>}
                      </div>
                      <p className="mt-1 font-display text-lg text-ink">{p.name}</p>
                      <p className="mt-0.5 text-xs text-ink/45">{p.brand} · {p.unit}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Price price={p.price} mrp={p.mrp} />
                      <RatingStars rating={p.rating} reviews={p.reviews} compact />
                    </div>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); addToCart(p.id, p.moq) }} className="btn-secondary self-center !py-2.5 !px-4 text-xs">Add</button>
                </Link>
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-porcelain p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-lg text-ink">Filters</p>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            {FiltersPanel}
          </div>
        </div>
      )}
    </Container>
  )
}
