import React, { useMemo, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, CreditCard, Wallet, Landmark, Check } from 'lucide-react'
import { Container } from '../components/ui/Primitives.jsx'
import Breadcrumb from '../components/shared/Breadcrumb.jsx'
import { salons, spas, services, TIME_SLOTS } from '../lib/data.js'
import toast from 'react-hot-toast'
import api from '../lib/api.js'

const steps = ['Service', 'Date & Time', 'Professional', 'Payment']
const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'cod', label: 'Pay at Salon', icon: Wallet },
  { id: 'upi', label: 'UPI / Netbanking', icon: Landmark },
]

function nextDays(count) {
  const out = []
  const today = new Date('2026-07-31')
  for (let i = 1; i <= count; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    out.push(d)
  }
  return out
}

export default function BookAppointment() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const venue = salons.find((v) => v.id === id) || spas.find((v) => v.id === id)
  const isSpa = venue?.type === 'Spa'

  const offerings = isSpa
    ? venue.packages.map((pkg) => ({ id: pkg.name, name: pkg.name, duration: pkg.duration, price: pkg.price }))
    : services.filter((s) => venue?.serviceIds.includes(s.id)).map((s) => ({ id: s.id, name: s.name, duration: s.duration, price: s.priceFrom }))

  const preselectedId = searchParams.get('service') || searchParams.get('package')

  const [step, setStep] = useState(0)
  const [selectedOffering, setSelectedOffering] = useState(
    offerings.find((o) => o.id === preselectedId || o.name === preselectedId) || offerings[0] || null,
  )
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(venue?.staff?.[0] || null)
  const [payment, setPayment] = useState('cod')
  const [loading, setLoading] = useState(false)

  const dateOptions = useMemo(() => nextDays(10), [])

  if (!venue) {
    return (
      <Container className="py-20 text-center">
        <p className="text-sm text-ink/55">We couldn't find that salon or spa.</p>
      </Container>
    )
  }

  const isBooked = (time) => venue.bookedSlots.includes(time)

  const canContinue = {
    0: Boolean(selectedOffering),
    1: Boolean(selectedDate && selectedTime),
    2: Boolean(selectedStaff),
    3: true,
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      const { data } = await api.post('/appointments', {
        salonId: venue.id,
        offeringName: selectedOffering?.name,
        serviceId: selectedOffering?.id, // Note: This might be a string like "Haircut" for packages, backend handles it
        staffName: selectedStaff?.name,
        staffRole: selectedStaff?.role,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        price: selectedOffering?.price,
        paymentMethod: payment,
      })

      if (data.stripeSessionUrl) {
        window.location.href = data.stripeSessionUrl
      } else {
        navigate('/booking/success', {
          state: {
            bookingId: data.data?.bookingId || `APT-${Math.floor(50000 + Math.random() * 9000)}`,
            venueName: venue.name,
            offeringName: selectedOffering?.name,
            date: selectedDate,
            time: selectedTime,
            staffName: selectedStaff?.name,
            price: selectedOffering?.price,
          },
        })
      }
    } catch (error) {
      console.error('Failed to book appointment:', error)
      toast.error(error.response?.data?.message || 'Failed to book appointment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { label: isSpa ? 'Spas' : 'Salons', to: isSpa ? '/spas' : '/salons' },
          { label: venue.name, to: `${isSpa ? '/spas' : '/salons'}/${venue.id}` },
          { label: 'Book' },
        ]}
      />
      <h1 className="font-display text-3xl text-ink md:text-4xl">Book at {venue.name}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] text-ink/40">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span className="h-px w-8 bg-line" />}
            <span className={i <= step ? 'text-ink' : ''}>{String(i + 1).padStart(2, '0')} {s}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-10 max-w-2xl">
        {step === 0 && (
          <div>
            <p className="mb-5 font-display text-xl text-ink">Choose {isSpa ? 'a package' : 'a service'}</p>
            <div className="space-y-3">
              {offerings.map((o) => (
                <label key={o.id} className={`flex cursor-pointer items-center justify-between rounded-xl2 border p-5 ${selectedOffering?.id === o.id ? 'border-gold bg-gold/5' : 'border-line'}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" checked={selectedOffering?.id === o.id} onChange={() => setSelectedOffering(o)} className="text-gold focus:ring-gold" />
                    <span>
                      <span className="block text-sm font-medium text-ink">{o.name}</span>
                      <span className="block text-xs text-ink/50">{o.duration}</span>
                    </span>
                  </span>
                  <span className="font-mono text-sm text-ink">{o.price > 0 ? `₹${o.price.toLocaleString('en-IN')}` : 'Free'}</span>
                </label>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={!canContinue[0]} className="btn-primary mt-8 disabled:cursor-not-allowed disabled:opacity-50">Continue</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-5 flex items-center gap-2 font-display text-xl text-ink"><Calendar size={18} className="text-gold-dark" /> Choose date</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dateOptions.map((d) => {
                const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                const iso = d.toISOString().slice(0, 10)
                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDate(iso)}
                    className={`shrink-0 rounded-xl2 border px-4 py-3 text-center font-mono text-xs ${selectedDate === iso ? 'border-gold bg-gold/10 text-gold-dark' : 'border-line text-ink/60'}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <p className="mb-3 mt-8 flex items-center gap-2 font-display text-xl text-ink"><Clock size={18} className="text-gold-dark" /> Choose time</p>
            {Object.entries(TIME_SLOTS).map(([period, slots]) => (
              <div key={period} className="mt-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">{period}</p>
                <div className="flex flex-wrap gap-2">
                  {slots.map((t) => {
                    const booked = isBooked(t)
                    return (
                      <button
                        key={t}
                        disabled={booked}
                        onClick={() => setSelectedTime(t)}
                        className={`rounded-full border px-4 py-2 font-mono text-xs transition ${
                          booked
                            ? 'cursor-not-allowed border-line text-ink/25 line-through'
                            : selectedTime === t
                              ? 'border-gold bg-gold text-porcelain'
                              : 'border-line text-ink/70 hover:border-gold/40'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="mt-8 flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary">Back</button>
              <button onClick={() => setStep(2)} disabled={!canContinue[1]} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-5 flex items-center gap-2 font-display text-xl text-ink"><User size={18} className="text-gold-dark" /> Choose a professional</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {venue.staff.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedStaff(member)}
                  className={`rounded-xl2 border p-4 text-center transition ${selectedStaff?.id === member.id ? 'border-gold bg-gold/5' : 'border-line'}`}
                >
                  <img src={member.avatar} alt={member.name} className="mx-auto h-16 w-16 rounded-full object-cover"  loading="lazy" decoding="async" />
                  <p className="mt-3 text-sm font-medium text-ink">{member.name}</p>
                  <p className="font-mono text-[10px] text-ink/45">{member.role}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
              <button onClick={() => setStep(3)} disabled={!canContinue[2]} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-5 flex items-center gap-2 font-display text-xl text-ink"><CreditCard size={18} className="text-gold-dark" /> Payment method</p>
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl2 border p-5 ${payment === m.id ? 'border-gold bg-gold/5' : 'border-line'}`}>
                  <input type="radio" checked={payment === m.id} onChange={() => setPayment(m.id)} className="text-gold focus:ring-gold" />
                  <m.icon size={18} className="text-ink/50" />
                  <span className="text-sm font-medium text-ink">{m.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 rounded-xl2 border border-line bg-sand-light p-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-ink/40">Booking summary</p>
              <div className="space-y-2 text-sm text-ink/70">
                <div className="flex justify-between"><span>Venue</span><span className="text-ink">{venue.name}</span></div>
                <div className="flex justify-between"><span>{isSpa ? 'Package' : 'Service'}</span><span className="text-ink">{selectedOffering?.name}</span></div>
                <div className="flex justify-between"><span>Date</span><span className="text-ink">{selectedDate}</span></div>
                <div className="flex justify-between"><span>Time</span><span className="text-ink">{selectedTime}</span></div>
                <div className="flex justify-between"><span>Professional</span><span className="text-ink">{selectedStaff?.name}</span></div>
                <div className="flex justify-between border-t border-line pt-2 font-medium"><span>Total</span><span className="font-mono text-ink">{selectedOffering?.price > 0 ? `₹${selectedOffering.price.toLocaleString('en-IN')}` : 'Free'}</span></div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary" disabled={loading}>Back</button>
              <button onClick={handleConfirm} disabled={loading} className="btn-primary flex-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent"></span>
                    Processing Payment...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><Check size={15} /> Confirm & Pay</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
