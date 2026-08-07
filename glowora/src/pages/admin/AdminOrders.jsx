import React, { useEffect, useState } from 'react'
import { Eye, Loader2 } from 'lucide-react'
import { Badge } from '../../components/ui/Primitives.jsx'
import api from '../../lib/api'

const statusTone = { Processing: 'ink', 'In Transit': 'gold', Delivered: 'sand', Cancelled: 'clay' }

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/admin/orders')
        setOrders(data.data || [])
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div>
      <h2 className="font-display text-2xl text-ink">Orders</h2>
      <p className="mt-1 text-sm text-ink/50">All orders placed across verified professional accounts</p>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gold" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl2 border border-line bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink/40">
                <th className="p-4 font-normal">Order ID</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Items</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Total</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-ink/50">No orders found.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-line/70 last:border-0 hover:bg-sand-light/50">
                    <td className="p-4 font-mono text-xs text-ink">{o.orderNumber}</td>
                    <td className="p-4 text-ink/80">{o.user?.name || 'Guest'}</td>
                    <td className="p-4 text-ink/60">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-ink/60">{o.items.length} items</td>
                    <td className="p-4"><Badge tone={statusTone[o.orderStatus] || 'ink'}>{o.orderStatus}</Badge></td>
                    <td className="p-4 font-mono text-ink">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right"><button className="text-ink/40 hover:text-gold-dark"><Eye size={15} /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
