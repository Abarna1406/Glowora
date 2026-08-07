import React from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { Check, CalendarCheck, ArrowRight } from 'lucide-react'
import { Container } from '../components/ui/Primitives.jsx'

export default function BookingSuccess() {
  const { state } = useLocation()

  if (!state) {
    return <Navigate to="/salons" replace />
  }

  const { bookingId, venueName, offeringName, date, time, staffName, price } = state

  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
        <Check size={26} className="text-gold-dark" />
      </div>
      <p className="eyebrow mt-6">Booking Confirmed</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Your appointment is booked</h1>
      <p className="mt-3 max-w-md text-sm text-ink/55">
        Booking <span className="font-mono text-ink">{bookingId}</span> at <span className="text-ink">{venueName}</span> is confirmed. A confirmation has been sent to your email.
      </p>

      <div className="mt-8 w-full max-w-sm rounded-xl2 border border-line bg-sand-light p-6 text-left text-sm">
        <div className="flex justify-between py-1.5"><span className="text-ink/55">Service</span><span className="text-ink">{offeringName}</span></div>
        <div className="flex justify-between py-1.5"><span className="text-ink/55">Date</span><span className="text-ink">{date}</span></div>
        <div className="flex justify-between py-1.5"><span className="text-ink/55">Time</span><span className="text-ink">{time}</span></div>
        <div className="flex justify-between py-1.5"><span className="text-ink/55">Professional</span><span className="text-ink">{staffName}</span></div>
        <div className="flex justify-between border-t border-line pt-2 font-medium"><span className="text-ink/55">Total</span><span className="font-mono text-ink">{price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Free'}</span></div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/appointments" className="btn-primary"><CalendarCheck size={15} /> View appointments</Link>
        <Link to="/" className="btn-secondary">Back to home <ArrowRight size={15} /></Link>
      </div>
    </Container>
  )
}
