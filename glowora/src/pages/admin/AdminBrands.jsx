import React from 'react'
import { Pencil, Plus } from 'lucide-react'
import { Badge } from '../../components/ui/Primitives.jsx'
import { brands } from '../../lib/data.js'

export default function AdminBrands() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Brands</h2>
        <button className="btn-primary !py-2.5"><Plus size={15} /> Add brand</button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <div key={b.id} className="rounded-xl2 border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-light font-display text-sm">{b.logo}</span>
                <div>
                  <p className="font-medium text-ink">{b.name}</p>
                  <p className="text-xs text-ink/45">{b.products} SKUs</p>
                </div>
              </div>
              <button className="text-ink/40 hover:text-gold-dark"><Pencil size={14} /></button>
            </div>
            <div className="mt-4"><Badge tone="gold">{b.tier}</Badge></div>
          </div>
        ))}
      </div>
    </div>
  )
}
