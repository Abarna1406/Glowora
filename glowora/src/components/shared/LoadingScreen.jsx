import React from 'react'
import Logo from './Logo.jsx'

// ---------------------------------------------------------------------------
// LoadingScreen
// ---------------------------------------------------------------------------
// Shown as the <Suspense> fallback while a lazily-loaded page chunk is being
// fetched (see App.jsx). Route-level code splitting means this only appears
// briefly on first visit to a given page, not on every navigation once a
// chunk is cached.
// ---------------------------------------------------------------------------
export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-porcelain">
      <Logo size="lg" />
      <div className="h-1 w-32 overflow-hidden rounded-full bg-sand">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gold" />
      </div>
    </div>
  )
}
