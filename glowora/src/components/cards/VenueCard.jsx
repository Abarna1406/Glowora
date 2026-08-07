import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { RatingStars, Badge } from '../ui/Primitives.jsx'

export default function VenueCard({ venue, basePath, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
    >
      <Link to={`${basePath}/${venue.id}`} className="group block overflow-hidden rounded-xl2 border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card">
        <div className="relative h-44 overflow-hidden">
          <img src={venue.coverImage} alt={venue.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"  loading="lazy" decoding="async" />
          {/* Premium Video Background on Hover */}
          <video
            src={venue.videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-porcelain font-display text-xs text-ink">
            {venue.logo}
          </div>
          <span className="absolute right-4 top-4"><Badge tone="gold">{venue.priceRange}</Badge></span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg text-ink">{venue.name}</h3>
            <RatingStars rating={venue.rating} compact />
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
            <MapPin size={11} /> {venue.area}, {venue.city}
          </p>
          <p className="mt-3 line-clamp-2 text-xs text-ink/55">{venue.description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-ink/40">
            <span>{venue.reviews} reviews</span>
            <span className="text-gold-dark">Book now →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
