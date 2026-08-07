import React from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowUpRight } from 'lucide-react'
import { Price } from '../ui/Primitives.jsx'

export default function ServiceCard({ service, onSelect, index = 0 }) {
  return (
    <motion.button
      onClick={() => onSelect?.(service)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="group relative flex w-full flex-col items-start overflow-hidden rounded-xl2 border border-line bg-white p-6 text-left transition-all hover:border-gold/40 hover:shadow-card"
    >
      <video
        src="https://cdn.coverr.co/videos/coverr-skincare-routine-2639/1080p.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/40 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      
      <div className="relative z-10 w-full">
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-gold-dark group-hover:text-gold">{service.category}</span>
        <h3 className="mt-2 font-display text-lg text-ink transition-colors group-hover:text-white">{service.name}</h3>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/50 transition-colors group-hover:text-white/70">
          <Clock size={12} /> {service.duration}
        </p>
        <div className="mt-4 flex w-full items-center justify-between border-t border-line pt-3 transition-colors group-hover:border-white/20">
          {service.priceFrom > 0 ? (
            <div className="group-hover:text-white transition-colors"><Price price={service.priceFrom} size="sm" /></div>
          ) : (
            <span className="font-mono text-sm text-moss group-hover:text-gold">Free</span>
          )}
          <ArrowUpRight size={14} className="text-ink/25 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </div>
      </div>
    </motion.button>
  )
}
