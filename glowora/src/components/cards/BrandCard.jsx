import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function BrandCard({ brand, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
    >
      <Link to={`/brands/${brand.id}`} className="group block overflow-hidden rounded-xl2 border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card">
        <div className="relative h-44 overflow-hidden">
          <img src={brand.cover} alt={brand.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"  loading="lazy" decoding="async" />
          {/* Premium Promotional Video Hover */}
          <video
            src={brand.videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-porcelain font-display text-sm text-ink">
            {brand.logo}
          </div>
          <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-widest2 text-porcelain/80">
            {brand.tier}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="font-display text-lg text-ink">{brand.name}</h3>
            <ArrowUpRight size={16} className="mt-1 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
          </div>
          <p className="mt-1 text-sm text-ink/55">{brand.tagline}</p>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-ink/40">
            <span>{brand.origin}</span>
            <span>{brand.products} SKUs</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
