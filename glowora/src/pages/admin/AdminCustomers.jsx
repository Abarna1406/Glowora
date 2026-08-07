import React from 'react'
import { Badge } from '../../components/ui/Primitives.jsx'

const customers = [
  { name: 'Lumen Studio & Spa', owner: 'Radhika Menon', city: 'Madurai', tier: 'Gold', orders: 18, spend: 214000 },
  { name: 'Studio Alina', owner: 'Alina Cho', city: 'Seoul', tier: 'Platinum', orders: 42, spend: 588000 },
  { name: 'Belline Hair', owner: 'Marco Belline', city: 'Milan', tier: 'Gold', orders: 27, spend: 312000 },
  { name: 'Skin Clinic Priya', owner: 'Priya Nair', city: 'Bengaluru', tier: 'Platinum', orders: 35, spend: 471000 },
  { name: 'Verde Nails Bar', owner: 'Sofia Reyes', city: 'Lisbon', tier: 'Silver', orders: 6, spend: 48000 },
]

export default function AdminCustomers() {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Customers</h2>
      <p className="mt-1 text-sm text-ink/50">1,240 verified professional accounts</p>

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink/40">
              <th className="p-4 font-normal">Business</th>
              <th className="p-4 font-normal">Owner</th>
              <th className="p-4 font-normal">City</th>
              <th className="p-4 font-normal">Tier</th>
              <th className="p-4 font-normal">Orders</th>
              <th className="p-4 font-normal text-right">Lifetime spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.name} className="border-b border-line/70 last:border-0 hover:bg-sand-light/50">
                <td className="p-4 font-medium text-ink">{c.name}</td>
                <td className="p-4 text-ink/60">{c.owner}</td>
                <td className="p-4 text-ink/60">{c.city}</td>
                <td className="p-4"><Badge tone="gold">{c.tier}</Badge></td>
                <td className="p-4 text-ink/60">{c.orders}</td>
                <td className="p-4 text-right font-mono text-ink">₹{c.spend.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
