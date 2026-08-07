import React from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { coupons } from '../../lib/data.js'

export default function AdminCoupons() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Coupons</h2>
        <button className="btn-primary !py-2.5"><Plus size={15} /> Create coupon</button>
      </div>
      <div className="overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink/40">
              <th className="p-4 font-normal">Code</th>
              <th className="p-4 font-normal">Description</th>
              <th className="p-4 font-normal">Minimum</th>
              <th className="p-4 font-normal">Expires</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.code} className="border-b border-line/70 last:border-0 hover:bg-sand-light/50">
                <td className="p-4 font-mono text-ink">{c.code}</td>
                <td className="p-4 text-ink/60">{c.desc}</td>
                <td className="p-4 text-ink/60">{c.min}</td>
                <td className="p-4 text-ink/60">{c.expires}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2 text-ink/40">
                    <button className="hover:text-gold-dark"><Pencil size={14} /></button>
                    <button className="hover:text-clay"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
