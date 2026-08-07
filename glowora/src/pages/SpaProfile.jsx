import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Calendar } from 'lucide-react'
import { Container, SectionHeading, RatingStars, Badge } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import ReviewCard from '../components/cards/ReviewCard.jsx'
import { spas } from '../lib/data.js'

const sampleReviews = [
  { name: 'Neha Kapoor', role: 'Verified Appointment', rating: 5, text: 'The hot stone therapy was exactly what I needed. Booking the slot online took two minutes.', date: 'Jul 2026' },
  { name: 'Arvind Rao', role: 'Verified Appointment', rating: 4.5, text: 'Booked the couples package for an anniversary — the space was calm and the therapists were excellent.', date: 'Jun 2026' },
]

export default function SpaProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const spa = spas.find((s) => s.id === id) || spas[0]

  return (
    <div>
      <div className="relative h-72 overflow-hidden md:h-96">
        <video
          src={spa.videoUrl || "https://media.istockphoto.com/id/1477889546/video/beautiful-woman-with-closed-eyes-relaxing-in-spa-salon-getting-face-massage-in-beauty-spa.mp4?s=mp4-640x640-is&k=20&c=M55h7VYv5UjACt6VnMeIQXfTvs0WN3S0ze1o9APTqug="}
          autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-10">
          <Badge tone="gold">{spa.type}</Badge>
          <h1 className="mt-4 font-display text-4xl text-porcelain md:text-5xl">{spa.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-porcelain/70">
            <MapPin size={14} /> {spa.address}
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <Breadcrumb items={[{ label: 'Spas', to: '/spas' }, { label: spa.name }]} />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <RatingStars rating={spa.rating} reviews={spa.reviews} />
              <span className="font-mono text-xs text-ink/40">{spa.priceRange} · {spa.reviews} reviews</span>
            </div>
            <SectionHeading eyebrow="Virtual Tour" title={`Experience ${spa.name}`} />
            <div className="overflow-hidden rounded-xl2 border border-line bg-sand-light relative h-64 md:h-80 mt-2 mb-12">
              <video
                src={spa.videoUrl || "https://cdn.coverr.co/videos/coverr-skincare-routine-2639/1080p.mp4"}
                poster="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-700 hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-porcelain">
                <h4 className="font-display text-2xl text-shadow">Experience Our Spa</h4>
                <p className="text-sm opacity-90 text-shadow-sm mt-1">A glimpse into pure relaxation at {spa.name}.</p>
              </div>
            </div>

            <SectionHeading eyebrow="Packages" title="Book a package" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {spa.packages.map((pkg) => (
                <button
                  key={pkg.name}
                  onClick={() => navigate(`/book/${spa.id}?package=${encodeURIComponent(pkg.name)}`)}
                  className="flex items-center justify-between rounded-xl2 border border-line bg-white p-5 text-left transition hover:border-gold/40"
                >
                  <div>
                    <p className="font-display text-base text-ink">{pkg.name}</p>
                    <p className="mt-1 font-mono text-xs text-ink/45">{pkg.duration} · ₹{pkg.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="font-mono text-[11px] text-gold-dark">Book →</span>
                </button>
              ))}
            </div>

            <SectionHeading eyebrow="Therapists" title="Available staff" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {spa.staff.map((member) => (
                <div key={member.id} className="rounded-xl2 border border-line bg-white p-4 text-center">
                  <img src={member.avatar} alt={member.name} className="mx-auto h-16 w-16 rounded-full object-cover"  loading="lazy" decoding="async" />
                  <p className="mt-3 text-sm font-medium text-ink">{member.name}</p>
                  <p className="font-mono text-[10px] text-ink/45">{member.role}</p>
                </div>
              ))}
            </div>

            <SectionHeading eyebrow="Gallery" title="Inside the spa" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {spa.gallery.map((g, i) => (
                <img key={i} src={g} alt="" className="h-32 w-full rounded-xl2 object-cover"  loading="lazy" decoding="async" />
              ))}
            </div>

            <SectionHeading eyebrow="Reviews" title="What guests say" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {sampleReviews.map((r, i) => <ReviewCard key={i} review={r} />)}
            </div>
          </div>

          <aside className="h-fit space-y-5 rounded-xl2 border border-line bg-sand-light p-6">
            <button onClick={() => navigate(`/book/${spa.id}`)} className="btn-primary w-full">
              <Calendar size={15} /> Book appointment
            </button>
            <div className="space-y-3 border-t border-line pt-5 text-sm">
              <p className="flex items-center gap-2 text-ink/65"><Clock size={14} className="text-gold-dark" /> {spa.openingHours}</p>
              <p className="flex items-center gap-2 text-ink/65"><Phone size={14} className="text-gold-dark" /> {spa.phone}</p>
              <p className="flex items-center gap-2 text-ink/65"><Mail size={14} className="text-gold-dark" /> {spa.email}</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-4 font-mono text-[11px] text-ink/40">
              Map placeholder — {spa.area}, {spa.city}
            </div>
          </aside>
        </div>
      </Container>
    </div>
  )
}
