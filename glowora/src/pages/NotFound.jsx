import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Primitives.jsx'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32 text-center">
      <p className="font-mono text-xs text-gold-dark">Error 404</p>
      <h1 className="mt-3 font-display text-4xl text-ink">This listing has moved</h1>
      <p className="mt-3 max-w-sm text-sm text-ink/55">The page you're looking for isn't in the catalogue. It may have been renamed or removed.</p>
      <Link to="/" className="btn-primary mt-8">Return home</Link>
    </Container>
  )
}
