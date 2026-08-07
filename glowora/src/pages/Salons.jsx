import React, { useMemo, useState, useEffect } from 'react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import VenueCard from '../components/cards/VenueCard.jsx'
import Pagination from '../components/shared/Pagination.jsx'
import { salons, services } from '../lib/data.js'

const PAGE_SIZE = 12

export default function Salons() {
  const CITIES = ['All Cities', ...Array.from(new Set(salons.map((s) => s.city)))]

  const [city, setCity] = useState('All Cities')
  const [serviceId, setServiceId] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return salons.filter((s) => {
      if (city !== 'All Cities' && s.city !== city) return false
      if (serviceId && !s.serviceIds.includes(serviceId)) return false
      return true
    })
  }, [city, serviceId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Salons' }]} />
      <SectionHeading
        eyebrow="Book A Salon"
        title="Salons near you"
        sub="Certified salons offering hair, skin, nail and grooming services — book a slot in a few taps."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={city}
          onChange={(e) => { setCity(e.target.value); setPage(1) }}
          className="rounded-full border border-line bg-white px-4 py-2.5 font-mono text-xs text-ink/70 outline-none focus:border-gold"
        >
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={serviceId}
          onChange={(e) => { setServiceId(e.target.value); setPage(1) }}
          className="rounded-full border border-line bg-white px-4 py-2.5 font-mono text-xs text-ink/70 outline-none focus:border-gold"
        >
          <option value="">All services</option>
          {services.filter((s) => s.category !== 'Spa').map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <span className="ml-auto font-mono text-xs text-ink/40">{filtered.length} salons</span>
      </div>

      {pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink/50">No salons match these filters yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((s, i) => <VenueCard key={s.id} venue={s} basePath="/salons" index={i} />)}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </Container>
  )
}
