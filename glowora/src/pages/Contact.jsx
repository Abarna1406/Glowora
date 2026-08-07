import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'

const info = [
  { icon: Mail, label: 'hello@glowora.com', sub: 'For account and order queries' },
  { icon: Phone, label: '+91 44 2345 6789', sub: 'Mon–Sat, 9am–7pm IST' },
  { icon: MapPin, label: 'Chennai · Mumbai · Bengaluru', sub: 'Regional support hubs' },
]

export default function Contact() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <SectionHeading eyebrow="Get In Touch" title="Talk to our support team" sub="Our team responds within one business day. Platinum members reach a dedicated line." />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {info.map((i) => (
            <div key={i.label} className="flex items-start gap-4 rounded-xl2 border border-line bg-white p-6">
              <i.icon size={18} className="mt-0.5 text-gold-dark" />
              <div>
                <p className="text-sm font-medium text-ink">{i.label}</p>
                <p className="mt-1 text-xs text-ink/50">{i.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="space-y-4 rounded-xl2 border border-line bg-white p-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input placeholder="Full name" className="input-field" />
            <input placeholder="Business email" type="email" className="input-field" />
          </div>
          <input placeholder="Subject" className="input-field" />
          <textarea placeholder="How can we help?" rows={5} className="input-field resize-none" />
          <button type="submit" className="btn-primary">Send message</button>
        </form>
      </div>
    </Container>
  )
}
