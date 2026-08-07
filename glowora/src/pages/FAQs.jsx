import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { faqs } from '../lib/data.js'

export default function FAQs() {
  const [open, setOpen] = useState(0)
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'FAQs' }]} />
      <SectionHeading eyebrow="Support" title="Frequently asked questions" align="center" />
      <div className="mx-auto max-w-2xl divide-y divide-line border-y border-line">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
              <span className="font-display text-lg text-ink">{f.q}</span>
              <ChevronDown size={16} className={`shrink-0 text-ink/40 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="pb-5 text-sm leading-relaxed text-ink/60">{f.a}</p>}
          </div>
        ))}
      </div>
    </Container>
  )
}
