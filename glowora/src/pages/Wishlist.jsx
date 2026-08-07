import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Container, EmptyState } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import ProductCard from '../components/cards/ProductCard.jsx'
import { useStore } from '../lib/store.jsx'

export default function Wishlist() {
  const { wishlist } = useStore()
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <h1 className="font-display text-3xl text-ink md:text-4xl">Your wishlist</h1>
      <p className="mt-2 text-sm text-ink/55">{wishlist.length} saved listings</p>

      {wishlist.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Heart} title="Nothing saved yet" sub="Tap the heart icon on any listing to save it here for later." action={<Link to="/shop" className="btn-primary">Browse catalogue</Link>} />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {wishlist.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </Container>
  )
}
