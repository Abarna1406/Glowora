import React from 'react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import BrandCard from '../components/cards/BrandCard.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { brands } from '../lib/data.js'

export default function Brands() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Brands' }]} />
      <SectionHeading
        eyebrow="The Registry"
        title="Trusted beauty brands on Glowora"
        sub="Every brand listed here is verified for authenticity — genuine formulations, batch-tested stock and real salon reviews included."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b, i) => <BrandCard key={b.id} brand={b} index={i} />)}
      </div>
    </Container>
  )
}
