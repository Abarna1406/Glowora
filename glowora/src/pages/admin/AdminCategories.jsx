import React from 'react'
import { Pencil, Plus } from 'lucide-react'
import { categories } from '../../lib/data.js'

export default function AdminCategories() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Categories</h2>
        <button className="btn-primary !py-2.5"><Plus size={15} /> Add category</button>
      </div>
      <div className="overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink/40">
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Code</th>
              <th className="p-4 font-normal">Listings</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-line/70 last:border-0 hover:bg-sand-light/50">
                <td className="flex items-center gap-3 p-4">
                  <img src={c.img} alt="" className="h-10 w-10 rounded-lg object-cover"  loading="lazy" decoding="async" />
                  <span className="font-medium text-ink">{c.name}</span>
                </td>
                <td className="p-4 font-mono text-xs text-ink/55">{c.code}</td>
                <td className="p-4 text-ink/60">{c.count}</td>
                <td className="p-4 text-right"><button className="text-ink/40 hover:text-gold-dark"><Pencil size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
