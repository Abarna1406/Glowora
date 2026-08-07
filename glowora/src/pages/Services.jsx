import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import ServiceCard from '../components/cards/ServiceCard.jsx'
import { services, salons } from '../lib/data.js'

const serviceCategories = ['All', ...Array.from(new Set(services.map((s) => s.category)))]

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('All')
  const navigate = useNavigate()

  const filtered = useMemo(
    () => services.filter((s) => activeCategory === 'All' || s.category === activeCategory),
    [activeCategory],
  )

  const handleSelect = (service) => {
    // Jump to the salon directory pre-filtered to salons offering this service.
    const firstMatch = salons.find((s) => s.serviceIds.includes(service.id))
    if (firstMatch) {
      navigate(`/book/${firstMatch.id}?service=${service.id}`)
    } else {
      navigate('/salons')
    }
  }

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Services' }]} />
      <SectionHeading
        eyebrow="What Are You Booking?"
        title="Browse services"
        sub="From a quick trim to a full bridal package — pick a service and we'll show you where to book it."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {serviceCategories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wide transition ${
              activeCategory === c ? 'border-gold bg-gold/10 text-gold-dark' : 'border-line text-ink/55 hover:border-ink/25'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} onSelect={handleSelect} />
        ))}
      </div>
    </Container>
  )
}
