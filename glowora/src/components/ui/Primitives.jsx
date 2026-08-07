import React from 'react'
import { Star } from 'lucide-react'

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1400px] section-pad ${className}`}>{children}</div>
}

export function Eyebrow({ children }) {
  return <p className="eyebrow mb-3">{children}</p>
}

export function SectionHeading({ eyebrow, title, sub, align = 'left' }) {
  return (
    <div className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : ''}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl md:text-[2.75rem] leading-[1.08] font-medium text-ink">{title}</h2>
      {sub && <p className="mt-4 text-ink/60 text-[15px] leading-relaxed">{sub}</p>}
    </div>
  )
}

export function Price({ price, mrp, size = 'md' }) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }
  return (
    <div className="flex items-baseline gap-2 font-mono">
      <span className={`${sizes[size]} text-ink font-medium`}>₹{price.toLocaleString('en-IN')}</span>
      {mrp && mrp > price && <span className="text-xs text-ink/35 line-through">₹{mrp.toLocaleString('en-IN')}</span>}
    </div>
  )
}

export function RatingStars({ rating, reviews, compact }) {
  return (
    <div className="flex items-center gap-1.5 text-ink/70">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < Math.round(rating) ? 'fill-gold text-gold' : 'fill-transparent text-ink/20'}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-ink/50">
        {rating}
        {!compact && reviews != null && <> · {reviews}</>}
      </span>
    </div>
  )
}

export function Badge({ children, tone = 'ink' }) {
  const tones = {
    ink: 'bg-ink text-porcelain',
    gold: 'bg-gold/15 text-gold-dark border border-gold/30',
    sand: 'bg-sand text-ink/70',
    clay: 'bg-clay/10 text-clay border border-clay/25',
    outline: 'border border-ink/15 text-ink/60',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Divider({ className = '' }) {
  return <div className={`h-px w-full bg-line ${className}`} />
}

export function IndexNumber({ n }) {
  return <span className="font-mono text-xs text-gold-dark">{String(n).padStart(2, '0')}</span>
}

export function EmptyState({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line py-20 text-center">
      {Icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sand-light">
          <Icon size={22} className="text-gold-dark" />
        </div>
      )}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {sub && <p className="mt-2 max-w-sm text-sm text-ink/55">{sub}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-sand ${className}`} />
}
