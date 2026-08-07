import React from 'react'

// ---------------------------------------------------------------------------
// AmbientBackground
// ---------------------------------------------------------------------------
// Renders once, fixed behind all page content, so every public page shares
// the same soft luxury atmosphere (blush gradient wash + slow-drifting
// blurred glow shapes) instead of a plain white background — without
// needing to edit every individual page. Purely decorative: pointer-events
// disabled, negative z-index, no effect on layout or scroll height.
// ---------------------------------------------------------------------------
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sand-light via-porcelain to-porcelain">
      <div className="absolute -left-24 -top-32 h-[26rem] w-[26rem] animate-float-slow rounded-full bg-gold-light/25 blur-3xl" />
      <div className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] animate-float-slower rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 h-80 w-80 animate-float-slow rounded-full bg-sand-dark/25 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4),transparent_60%)]" />
    </div>
  )
}
