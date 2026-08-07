import React from 'react'
import { Check, X } from 'lucide-react'
import { RatingStars } from '../../components/ui/Primitives.jsx'

const pending = [
  { id: 1, product: 'Restorative Bond Shampoo', author: 'Studio Alina', rating: 5, text: 'Consistent batch to batch — our colourists love it.' },
  { id: 2, product: 'Ammonia-Free Colour Crème', author: 'Belline Hair', rating: 4.5, text: 'Excellent coverage, wish larger formats shipped faster.' },
  { id: 3, product: 'Thermal Clay Body Wrap', author: 'Nord Spa Oslo', rating: 5, text: 'Clients specifically request this treatment now.' },
]

export default function AdminReviews() {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Reviews</h2>
      <p className="mt-1 text-sm text-ink/50">Pending moderation from verified purchases</p>

      <div className="mt-6 space-y-4">
        {pending.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 rounded-xl2 border border-line bg-white p-6">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-medium text-ink">{r.product}</p>
                <RatingStars rating={r.rating} compact />
              </div>
              <p className="mt-1 text-xs text-ink/45">by {r.author}</p>
              <p className="mt-2 max-w-lg text-sm text-ink/65">{r.text}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-moss hover:border-moss"><Check size={15} /></button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-clay hover:border-clay"><X size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
