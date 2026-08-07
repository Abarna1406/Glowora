import React from 'react'
import { Container, SectionHeading, Eyebrow } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'

const milestones = [
  { year: '2019', text: 'Founded in Chennai to bring trusted beauty brands and salon booking into a single, easy platform.' },
  { year: '2021', text: 'Crossed 20 professional beauty brands and introduced tiered membership for salons and spas.' },
  { year: '2023', text: 'Opened appointment booking for salons and spas, alongside same-day product delivery in major cities.' },
  { year: '2026', text: 'Now serving 1,240+ salons, spas and beauty professionals — plus thousands of everyday shoppers — across the region.' },
]

export default function About() {
  return (
    <div>
      <div className="relative h-80 overflow-hidden md:h-[420px]">
        <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1400" alt="Salon team" className="h-full w-full object-cover"  loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-ink/55" />
        <Container className="absolute inset-x-0 bottom-0 pb-10">
          <Eyebrow>Our Story</Eyebrow>
          <h1 className="mt-2 max-w-xl font-display text-4xl text-porcelain md:text-5xl">Built for beauty, from product to appointment</h1>
        </Container>
      </div>

      <Container className="py-16">
        <Breadcrumb items={[{ label: 'About' }]} />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Mission" title="One platform for beauty products & salon services" sub="Glowora exists because finding trusted beauty brands and booking a great salon or spa shouldn't take five different apps. We bring products and appointments together in one place." />
            <p className="text-sm leading-relaxed text-ink/60">
              We work directly with beauty brands and verified salons and spas to bring authentic products and real appointment availability to one platform — with pricing, delivery and booking built around how beauty actually gets bought and booked.
            </p>
          </div>
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Milestones</p>
            <div className="space-y-6 border-l border-line pl-6">
              {milestones.map((m) => (
                <div key={m.year} className="relative">
                  <span className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full bg-gold" />
                  <p className="font-mono text-xs text-gold-dark">{m.year}</p>
                  <p className="mt-1 text-sm text-ink/65">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
