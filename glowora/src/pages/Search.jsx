import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react'
import { Container } from '../components/ui/Primitives.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import VenueCard from '../components/cards/VenueCard.jsx'
import ServiceCard from '../components/cards/ServiceCard.jsx'
import { products, salons, spas, services, trendingSearches } from '../lib/data.js'

const recent = ['Vitamin C serum', 'Nord Therme', 'Hair colour']
const tabs = ['All', 'Products', 'Salons', 'Spas', 'Services']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('All')
  const navigate = useNavigate()

  const matches = useMemo(() => {
    if (!query.trim()) return { products: [], salons: [], spas: [], services: [] }
    const q = query.toLowerCase()
    return {
      products: products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
      salons: salons.filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)),
      spas: spas.filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)),
      services: services.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)),
    }
  }, [query])

  const totalResults = matches.products.length + matches.salons.length + matches.spas.length + matches.services.length

  const handleServiceSelect = (service) => {
    const firstMatch = salons.find((s) => s.serviceIds.includes(service.id))
    navigate(firstMatch ? `/book/${firstMatch.id}?service=${service.id}` : '/salons')
  }

  return (
    <Container className="py-10">
      <div className="relative mx-auto max-w-2xl">
        <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, salons, spas or services"
          className="w-full rounded-full border border-line bg-white py-4 pl-14 pr-12 text-sm text-ink outline-none focus:border-gold"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-ink/40">
            <X size={16} />
          </button>
        )}
      </div>

      {!query.trim() ? (
        <div className="mx-auto mt-10 max-w-2xl space-y-10">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">
              <Clock size={12} /> Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {recent.map((r) => (
                <button key={r} onClick={() => setQuery(r)} className="rounded-full border border-line px-4 py-2 text-xs text-ink/70 hover:border-gold hover:text-ink">{r}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">
              <TrendingUp size={12} /> Trending on Glowora
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((r) => (
                <button key={r} onClick={() => setQuery(r)} className="rounded-full bg-sand-light px-4 py-2 text-xs text-ink/70 hover:bg-gold/15">{r}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wide transition ${
                  tab === t ? 'border-gold bg-gold/10 text-gold-dark' : 'border-line text-ink/55 hover:border-ink/25'
                }`}
              >
                {t}
                {t !== 'All' && ` (${matches[t.toLowerCase()].length})`}
              </button>
            ))}
          </div>

          <p className="mb-6 text-sm text-ink/55">{totalResults} results for &ldquo;{query}&rdquo;</p>

          {totalResults === 0 ? (
            <p className="py-16 text-center text-sm text-ink/45">No results matched. Try a brand, salon, city or service name instead.</p>
          ) : (
            <div className="space-y-14">
              {(tab === 'All' || tab === 'Products') && matches.products.length > 0 && (
                <div>
                  {tab === 'All' && <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Products</p>}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
                    {matches.products.slice(0, tab === 'All' ? 8 : undefined).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                  </div>
                </div>
              )}
              {(tab === 'All' || tab === 'Salons') && matches.salons.length > 0 && (
                <div>
                  {tab === 'All' && <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Salons</p>}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {matches.salons.slice(0, tab === 'All' ? 3 : undefined).map((s, i) => <VenueCard key={s.id} venue={s} basePath="/salons" index={i} />)}
                  </div>
                </div>
              )}
              {(tab === 'All' || tab === 'Spas') && matches.spas.length > 0 && (
                <div>
                  {tab === 'All' && <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Spas</p>}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {matches.spas.slice(0, tab === 'All' ? 3 : undefined).map((s, i) => <VenueCard key={s.id} venue={s} basePath="/spas" index={i} />)}
                  </div>
                </div>
              )}
              {(tab === 'All' || tab === 'Services') && matches.services.length > 0 && (
                <div>
                  {tab === 'All' && <p className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Services</p>}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {matches.services.slice(0, tab === 'All' ? 4 : undefined).map((s, i) => <ServiceCard key={s.id} service={s} index={i} onSelect={handleServiceSelect} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Container>
  )
}
