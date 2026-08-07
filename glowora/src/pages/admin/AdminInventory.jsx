import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '../../components/ui/Primitives.jsx'
import { products } from '../../lib/data.js'

export default function AdminInventory() {
  const rows = products.slice(0, 16)
  const low = (i) => (i * 13) % 40
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Inventory</h2>
      <p className="mt-1 text-sm text-ink/50">Live stock levels across the warehouse network</p>

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink/40">
              <th className="p-4 font-normal">Product</th>
              <th className="p-4 font-normal">SKU</th>
              <th className="p-4 font-normal">Units in stock</th>
              <th className="p-4 font-normal">Reorder level</th>
              <th className="p-4 font-normal text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const stock = low(i)
              const critical = stock < 15
              return (
                <tr key={p.id} className="border-b border-line/70 last:border-0 hover:bg-sand-light/50">
                  <td className="p-4 font-medium text-ink">{p.name}</td>
                  <td className="p-4 font-mono text-xs text-ink/55">{p.sku}</td>
                  <td className="p-4 text-ink/60">{stock} units</td>
                  <td className="p-4 text-ink/60">20 units</td>
                  <td className="p-4 text-right">
                    {critical ? (
                      <Badge tone="clay"><AlertTriangle size={10} /> Reorder soon</Badge>
                    ) : (
                      <Badge tone="sand">Healthy</Badge>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
