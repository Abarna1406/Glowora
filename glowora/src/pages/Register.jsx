import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/shared/Logo.jsx'
import { Eye, EyeOff, AlertCircle, Loader2, Scissors, Sparkles, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

// Maps the storefront's professional-account language onto the backend's
// User.role enum (Admin | Salon | Spa | Beautician).
const roleOptions = [
  { id: 'Salon', label: 'Salon', icon: Scissors },
  { id: 'Spa', label: 'Spa', icon: Sparkles },
  { id: 'Beautician', label: 'Beautician', icon: Palette },
]

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('Salon')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [formError, setFormError] = useState(null)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setFormError('Please fill in every field.')
      return
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters long.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    try {
      await register({ name: form.name, email: form.email, password: form.password, role })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      {/* Brand logo */}
      <Logo />

      <h1 className="mt-8 font-display text-3xl text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink/55">Create an account to shop beauty products and book appointments in minutes.</p>

      {formError && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-clay/30 bg-clay/5 px-4 py-3 text-xs text-clay">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="mt-8">
        <p className="mb-3 text-xs font-medium text-ink/60">I am registering as a</p>
        <div className="grid grid-cols-3 gap-3">
          {roleOptions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`flex flex-col items-center gap-2 rounded-xl2 border py-4 text-xs font-medium transition ${
                role === r.id ? 'border-gold bg-gold/5 text-ink shadow-glow' : 'border-line text-ink/55 hover:border-ink/25'
              }`}
            >
              <r.icon size={18} className={role === r.id ? 'text-gold-dark' : 'text-ink/40'} />
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-ink/60">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Radhika Menon"
            className="input-field"
            value={form.name}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink/60">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@yoursalon.com"
            className="input-field"
            value={form.email}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink/60">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="At least 6 characters"
              className="input-field pr-10"
              value={form.password}
              onChange={onChange}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" aria-label="Toggle password visibility">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-ink/60">Confirm password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPw ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="Re-enter your password"
              className="input-field pr-10"
              value={form.confirmPassword}
              onChange={onChange}
            />
            <button type="button" onClick={() => setShowConfirmPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" aria-label="Toggle password visibility">
              {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-ink/55">
          <input type="checkbox" required className="mt-0.5 rounded border-ink/30 text-gold focus:ring-gold" />
          I agree to the Terms of Service and Privacy Policy.
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Register'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink/55">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-gold-dark hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
