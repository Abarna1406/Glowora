import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Change the page AND bring the user back to the top of the results —
  // otherwise clicking "2" or "Next" from the bottom of a long grid leaves
  // the browser scrolled to the bottom of the (now different) page.
  const goTo = (p) => {
    onChange(p)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <div className="mt-14 flex items-center justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => goTo(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/60 disabled:opacity-30 hover:border-gold hover:text-ink"
      >
        <ChevronLeft size={15} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs transition ${
            p === page ? 'bg-ink text-porcelain' : 'text-ink/60 hover:bg-sand-light'
          }`}
        >
          {String(p).padStart(2, '0')}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => goTo(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/60 disabled:opacity-30 hover:border-gold hover:text-ink"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}
