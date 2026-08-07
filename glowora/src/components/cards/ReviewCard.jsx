import React from 'react'
import { RatingStars } from '../ui/Primitives.jsx'

export default function ReviewCard({ review }) {
  return (
    <div className="rounded-xl2 border border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-base text-ink">{review.name}</p>
          <p className="font-mono text-[11px] text-ink/40">{review.role}</p>
        </div>
        <RatingStars rating={review.rating} compact />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/65">{review.text}</p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest2 text-ink/30">{review.date}</p>
    </div>
  )
}
