import React, { useMemo, useState, useEffect } from 'react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import VenueCard from '../components/cards/VenueCard.jsx'
import Pagination from '../components/shared/Pagination.jsx'
import { spas } from '../lib/data.js'

const PAGE_SIZE = 12

export default function Spas() {
  const CITIES = ['All Cities', ...Array.from(new Set(spas.map((s) => s.city)))]

  const [city, setCity] = useState('All Cities')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => spas.filter((s) => city === 'All Cities' || s.city === city), [city])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Spas' }]} />
      <SectionHeading
        eyebrow="Book A Spa"
        title="Spas &amp; wellness retreats"
        sub="Luxury spas offering massage, body treatments and thermal rituals — book a package in a few taps."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={city}
          onChange={(e) => { setCity(e.target.value); setPage(1) }}
          className="rounded-full border border-line bg-white px-4 py-2.5 font-mono text-xs text-ink/70 outline-none focus:border-gold"
        >
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="ml-auto font-mono text-xs text-ink/40">{filtered.length} spas</span>
      </div>

      {pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink/50">No spas match this city yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((s, i) => <VenueCard key={s.id} venue={s} basePath="/spas" index={i} />)}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </Container>
  )
}
