import React, { useState, useEffect } from 'react'
import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight, Activity, CalendarCheck, Clock } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Badge } from '../../components/ui/Primitives.jsx'
import { orders, categories, brands, salons, spas, services, products } from '../../lib/data.js'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'
import toast from 'react-hot-toast'

const revenueData = [
  { m: 'Feb', v: 412000 }, { m: 'Mar', v: 468000 }, { m: 'Apr', v: 445000 },
  { m: 'May', v: 512000 }, { m: 'Jun', v: 588000 }, { m: 'Jul', v: 642000 },
]
const categorySales = [
  { name: 'Hair Care', v: 32 }, { name: 'Skin Care', v: 27 }, { name: 'Colour', v: 18 },
  { name: 'Spa', v: 12 }, { name: 'Nail', v: 8 }, { name: 'Other', v: 3 },
]
const ordersByDay = [
  { d: 'Mon', v: 24 }, { d: 'Tue', v: 31 }, { d: 'Wed', v: 28 }, { d: 'Thu', v: 40 },
  { d: 'Fri', v: 36 }, { d: 'Sat', v: 22 }, { d: 'Sun', v: 14 }
]
const PIE_COLORS = ['#EC4899', '#F472B6', '#DB2777', '#F9A8D4', '#FCE7F3', '#9D174D']

const stats = [
  { label: 'Total Revenue (30d)', value: '₹6,42,000', delta: '+8.4%', icon: TrendingUp },
  { label: 'Total Orders (30d)', value: '386', delta: '+5.1%', icon: ShoppingCart },
  { label: 'Active Customers', value: '1,240', delta: '+2.3%', icon: Users },
  { label: 'Live Products', value: '48', delta: '+3 new', icon: Package },
]

const statusTone = { 'In Transit': 'gold', Delivered: 'sand', Cancelled: 'clay' }

export default function Dashboard() {
  const { user } = useAuth();
  const [recentApts, setRecentApts] = useState([]);

  useEffect(() => {
    api.get('/admin/appointments').then(res => {
      setRecentApts(res.data.data.slice(0, 5));
    }).catch(() => {});
  }, []);

  const handleSeed = async () => {
    try {
      toast.loading('Seeding database (this might take a few seconds)...', { id: 'seed' })
      const res = await api.post('/admin/seed', { categories, brands, salons, spas, services, products })
      toast.success(res.data.message || 'Database seeded successfully!', { id: 'seed' })
    } catch (err) {
      toast.error('Seeding failed. Check console.', { id: 'seed' })
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-sand-light/20 p-8 font-sans">
      
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Overview</h1>
          <p className="text-sm text-ink/60 mt-1">Welcome back, {user?.name || 'Admin'}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSeed} className="flex items-center gap-2 rounded-xl border border-line bg-ink px-4 py-2 text-sm font-medium text-porcelain shadow-sm transition hover:bg-gold hover:text-ink hover:border-gold">
            <Activity size={16} /> Seed Database
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-sand-light/50">
            <Activity size={16} className="text-gold" /> Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-ink/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-ink/10">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold shadow-inner shadow-gold/20">
                <s.icon size={22} strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 font-mono text-[11px] font-medium text-green-700">
                <ArrowUpRight size={14} /> {s.delta}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="font-display text-3xl font-bold tracking-tight text-ink">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-ink/50">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
        
        {/* Revenue Area Chart */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-ink/5 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Revenue Trend</h2>
              <p className="text-xs text-ink/50">Monthly gross sales</p>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#1F293780' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide />
                <Tooltip 
                  formatter={(v) => `₹${v.toLocaleString('en-IN')}`} 
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontSize: 13, fontWeight: 500 }} 
                />
                <Area type="monotone" dataKey="v" stroke="#EC4899" strokeWidth={3} fill="url(#revGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-ink/5 backdrop-blur-xl">
          <div className="mb-2">
            <h2 className="font-display text-lg font-semibold text-ink">Sales by Category</h2>
            <p className="text-xs text-ink/50">Top performing segments</p>
          </div>
          
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} dataKey="v" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3} cornerRadius={4}>
                  {categorySales.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontSize: 12 }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            {categorySales.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs font-medium text-ink/70">
                <span className="h-3 w-3 rounded-md shadow-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        
        {/* Weekly Orders Bar Chart */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-ink/5 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="font-display text-lg font-semibold text-ink">Orders This Week</h2>
            <p className="text-xs text-ink/50">Daily order volume</p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByDay}>
                <XAxis dataKey="d" tick={{ fontSize: 12, fill: '#1F293780' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'rgba(212, 175, 55, 0.05)'}}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontSize: 12 }} 
                />
                <Bar dataKey="v" fill="#F472B6" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-ink/5 backdrop-blur-xl flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Recent Orders</h2>
              <p className="text-xs text-ink/50">Latest transactions</p>
            </div>
            <button className="text-sm font-medium text-gold hover:text-gold-dark transition-colors">
              View All Orders →
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-line/60">
                  <th className="pb-4 pl-2 text-xs font-semibold uppercase tracking-wider text-ink/50">Order ID</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-ink/50">Date</th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-ink/50">Status</th>
                  <th className="pb-4 pr-2 text-right text-xs font-semibold uppercase tracking-wider text-ink/50">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-sand-light/30">
                    <td className="py-4 pl-2 font-mono text-sm font-medium text-ink">{o.id}</td>
                    <td className="py-4 text-sm text-ink/70">{o.date}</td>
                    <td className="py-4">
                      <Badge tone={statusTone[o.status] || 'sand'}>{o.status}</Badge>
                    </td>
                    <td className="py-4 pr-2 text-right font-mono text-sm font-semibold text-ink">
                      ₹{o.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Recent Appointments */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-ink/5 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Recent Appointments</h2>
            <p className="text-xs text-ink/50">Latest salon & spa bookings</p>
          </div>
          <a href="/admin/appointments" className="text-sm font-medium text-gold hover:text-gold-dark transition-colors">View All →</a>
        </div>
        {recentApts.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl bg-sand-light/40 p-4 text-sm text-ink/40">
            <CalendarCheck size={18} className="shrink-0" /> No appointments yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line/60">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">ID</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">Customer</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">Salon / Spa</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">Service</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">Date</th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-ink/40">Amount</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {recentApts.map((a) => (
                  <tr key={a._id} className="transition-colors hover:bg-pink-50/30">
                    <td className="py-3 font-mono text-xs font-semibold text-pink-600">{a.bookingId}</td>
                    <td className="py-3 text-sm text-ink">{a.customer?.name || '—'}</td>
                    <td className="py-3 text-sm text-ink/70">{a.salonName}</td>
                    <td className="py-3 text-sm text-ink/70">{a.offeringName}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-xs text-ink/60">
                        <Clock size={11} /> {a.bookingTime} · {new Date(a.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono text-sm font-semibold">₹{(a.price || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        a.bookingStatus === 'Upcoming' ? 'bg-amber-100 text-amber-700' :
                        a.bookingStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-600'
                      }`}>{a.bookingStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
