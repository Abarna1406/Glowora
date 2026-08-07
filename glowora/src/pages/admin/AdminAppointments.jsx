import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, MapPin, Search, CheckCircle2, XCircle, Hourglass, RefreshCw, CreditCard } from 'lucide-react'
import api from '../../lib/api.js'
import toast from 'react-hot-toast'

const STATUS_TABS = ['All', 'Upcoming', 'Completed', 'Cancelled']

const statusStyle = {
  Upcoming:  { pill: 'bg-amber-100 text-amber-700',  icon: <Hourglass size={13} className="text-amber-500" /> },
  Completed: { pill: 'bg-green-100 text-green-700',  icon: <CheckCircle2 size={13} className="text-green-500" /> },
  Cancelled: { pill: 'bg-red-100 text-red-500',      icon: <XCircle size={13} className="text-red-400" /> },
}

const payStyle = (s) =>
  s === 'paid'     ? 'bg-green-100 text-green-700' :
  s === 'refunded' ? 'bg-blue-100 text-blue-700'   :
                     'bg-amber-100 text-amber-700'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [activeTab, setActiveTab]       = useState('All')
  const [search, setSearch]             = useState('')

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = {}
      if (activeTab !== 'All') params.status = activeTab
      const res = await api.get('/admin/appointments', { params })
      setAppointments(res.data.data)
    } catch {
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [activeTab])

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase()
    return (
      !q ||
      a.salonName?.toLowerCase().includes(q) ||
      a.offeringName?.toLowerCase().includes(q) ||
      a.customer?.name?.toLowerCase().includes(q) ||
      a.customer?.email?.toLowerCase().includes(q) ||
      a.bookingId?.toLowerCase().includes(q)
    )
  })

  const counts = {
    All:       appointments.length,
    Upcoming:  appointments.filter(a => a.bookingStatus === 'Upcoming').length,
    Completed: appointments.filter(a => a.bookingStatus === 'Completed').length,
    Cancelled: appointments.filter(a => a.bookingStatus === 'Cancelled').length,
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Appointments</h1>
          <p className="mt-1 text-sm text-ink/50">All salon &amp; spa bookings across the platform</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex w-fit items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-sand-light/50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              activeTab === tab
                ? 'border-pink-300 bg-pink-50 shadow-md shadow-pink-100'
                : 'border-line bg-white hover:border-pink-200'
            }`}
          >
            <p className="font-mono text-2xl font-bold text-ink">{counts[tab]}</p>
            <p className={`mt-0.5 text-sm font-medium ${activeTab === tab ? 'text-pink-600' : 'text-ink/50'}`}>{tab}</p>
          </button>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, service, salon…"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink/30 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.filter(t => t !== 'All').map((tab) => {
            const s = statusStyle[tab]
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab === activeTab ? 'All' : tab)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab
                    ? 'border-pink-400 bg-pink-500 text-white'
                    : 'border-line bg-white text-ink/60 hover:border-pink-300 hover:text-ink'
                }`}
              >
                {s.icon} {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-line bg-white py-24 text-sm text-ink/40">
          <RefreshCw size={20} className="mr-2 animate-spin" /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white py-24 text-center">
          <Calendar size={40} className="mb-3 text-ink/20" />
          <p className="text-sm font-medium text-ink/40">No appointments found</p>
          <p className="text-xs text-ink/30">Try a different filter or search term</p>
        </div>
      ) : (
        <>
          {/* Mobile / Tablet — card stack (hidden on xl+) */}
          <div className="flex flex-col gap-3 xl:hidden">
            {filtered.map((a) => {
              const ss = statusStyle[a.bookingStatus] || statusStyle.Upcoming
              return (
                <div key={a._id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  {/* top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-600">
                        {a.customer?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{a.customer?.name || '—'}</p>
                        <p className="truncate text-xs text-ink/40">{a.customer?.email || '—'}</p>
                      </div>
                    </div>
                    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ss.pill}`}>
                      {ss.icon} {a.bookingStatus}
                    </span>
                  </div>

                  {/* details grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-ink/70">
                    <div className="flex items-start gap-1.5">
                      <MapPin size={12} className="mt-0.5 shrink-0 text-ink/30" />
                      <div>
                        <p className="font-medium text-ink">{a.salonName || '—'}</p>
                        <p className="text-ink/50">{a.offeringName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Calendar size={12} className="mt-0.5 shrink-0 text-ink/30" />
                      <div>
                        <p className="font-medium text-ink">
                          {new Date(a.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-ink/50 flex items-center gap-1"><Clock size={10} /> {a.bookingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <User size={12} className="mt-0.5 shrink-0 text-ink/30" />
                      <div>
                        <p className="font-medium text-ink">{a.staff?.name || '—'}</p>
                        <p className="text-ink/50">{a.staff?.role || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CreditCard size={12} className="mt-0.5 shrink-0 text-ink/30" />
                      <div>
                        <p className="font-mono font-bold text-ink">₹{(a.price || 0).toLocaleString('en-IN')}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${payStyle(a.paymentStatus)}`}>
                          {a.paymentStatus} · {a.paymentMethod?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 font-mono text-[11px] font-semibold text-pink-500">{a.bookingId}</p>
                </div>
              )
            })}
          </div>

          {/* Desktop — full table (shown only on xl+) */}
          <div className="hidden xl:block overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-line/60 bg-sand-light/30">
                    {['Booking ID','Customer','Salon / Spa','Service','Date & Time','Professional','Amount','Payment','Status'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink/50 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {filtered.map((a) => {
                    const ss = statusStyle[a.bookingStatus] || statusStyle.Upcoming
                    return (
                      <tr key={a._id} className="transition-colors hover:bg-pink-50/20">
                        <td className="px-4 py-4 font-mono text-xs font-bold text-pink-600 whitespace-nowrap">{a.bookingId}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                              {a.customer?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-ink whitespace-nowrap">{a.customer?.name || '—'}</p>
                              <p className="text-xs text-ink/40">{a.customer?.email || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-sm text-ink whitespace-nowrap">
                            <MapPin size={12} className="shrink-0 text-ink/30" /> {a.salonName || '—'}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-ink whitespace-nowrap">{a.offeringName}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-ink">
                            <Calendar size={12} className="shrink-0 text-ink/30" />
                            {new Date(a.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-ink/50">
                            <Clock size={10} /> {a.bookingTime}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-ink">
                            <User size={12} className="shrink-0 text-ink/30" /> {a.staff?.name || '—'}
                          </div>
                          <p className="text-xs text-ink/40">{a.staff?.role || ''}</p>
                        </td>
                        <td className="px-4 py-4 font-mono text-sm font-bold text-ink whitespace-nowrap">
                          ₹{(a.price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${payStyle(a.paymentStatus)}`}>
                            {a.paymentStatus} · {a.paymentMethod?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ss.pill}`}>
                            {ss.icon} {a.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-line/60 px-5 py-3">
              <p className="text-xs text-ink/40">Showing {filtered.length} of {appointments.length} appointments</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
