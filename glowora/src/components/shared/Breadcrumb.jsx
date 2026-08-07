import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav className="mb-6 flex items-center gap-2 font-mono text-[11px] text-ink/45">
      <Link to="/" className="hover:text-ink">Home</Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={11} />
          {item.to ? (
            <Link to={item.to} className="hover:text-ink">{item.label}</Link>
          ) : (
            <span className="text-ink/70">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
