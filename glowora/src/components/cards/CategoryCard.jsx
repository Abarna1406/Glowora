import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
    >
      <Link to={`/category/${category.id}`} className="group relative block h-72 overflow-hidden rounded-xl2 shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
        <img src={category.img} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"  loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <span className="absolute right-4 top-4 font-mono text-[10px] text-porcelain/70">{category.code}</span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-xl text-porcelain">{category.name}</h3>
          <p className="mt-1 text-xs text-porcelain/70">{category.blurb}</p>
          <p className="mt-3 font-mono text-[11px] text-gold-light">{category.count} listings →</p>
        </div>
      </Link>
    </motion.div>
  )
}
