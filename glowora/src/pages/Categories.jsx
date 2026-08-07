import React from 'react'
import { Container, SectionHeading } from '../components/ui/Primitives.jsx'
import CategoryCard from '../components/cards/CategoryCard.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { categories } from '../lib/data.js'

export default function Categories() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: 'Categories' }]} />
      <SectionHeading
        eyebrow="The Index"
        title="All departments"
        sub="Seven departments covering every service line a professional salon, spa or clinic runs."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => <CategoryCard key={c.id} category={c} index={i} />)}
      </div>
    </Container>
  )
}
