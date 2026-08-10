import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/shared/Logo.jsx'
import { Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
import salon1 from '../assets/salon-1.png'

/** Minimal, brand-neutral "G" mark — UI only, no OAuth wired up. */
function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  )
}

export default function Login() {
  const { login, logout, loading, setSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [formError, setFormError] = useState(null)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.email || !form.password) {
      setFormError('Please enter both your email and password.')
      return
    }

    try {
      const user = await login(form.email, form.password)
      if (user.role === 'Admin') {
        logout()
        setFormError('Please use the Admin login page to sign in.')
        return
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(err.message)
    }
  }
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)

      // Backend (/api/auth/google) verifies a Firebase ID token, not raw
      // profile fields — so we must fetch and send the idToken.
      const idToken = await result.user.getIdToken()

      const apiBase = import.meta.env.VITE_API_URL || 'https://glowora.onrender.com/api'
      const res = await axios.post(`${apiBase}/auth/google`, { idToken })

      // Mirror what AuthContext's login()/register() do, so the rest of the
      // app (ProtectedRoute, api.js interceptor) sees the user as logged in.
      const { token, user } = res.data.data
      setSession(token, user)

      navigate(redirectTo, { replace: true })
    } catch (err) {
      console.log('Google login error:', err)
      const message = err.response?.data?.message || err.message || 'Google sign-in failed'
      setFormError(message)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={salon1}
          alt="Glowora Beauty Salon"
          className="h-full w-full object-cover brightness-90"
        />
        {/* Gradient overlay — pink tint at top, deep dark at bottom (like front page) */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/40 via-ink/30 to-ink/80" />
        {/* Subtle pink glow accent */}
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-porcelain">
          <p className="eyebrow !text-pink-300 tracking-widest">Beauty, Booked &amp; Delivered</p>
          <p className="mt-3 max-w-sm font-display text-2xl leading-snug text-white">
            &ldquo;Every product, every salon, every spa — in one beautiful account.&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-pink-400" />
            <div className="h-1 w-3 rounded-full bg-white/30" />
            <div className="h-1 w-3 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Brand logo */}
          <Logo />

          <h1 className="mt-8 font-display text-3xl text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink/55">Sign in to shop beauty products and manage your salon &amp; spa bookings.</p>

          {formError && (
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-clay/30 bg-clay/5 px-4 py-3 text-xs text-clay">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink/60">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@email.com"
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
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="input-field pr-10"
                  value={form.password}
                  onChange={onChange}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" aria-label="Toggle password visibility">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-ink/60">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-ink/30 text-gold focus:ring-gold" />
                Keep me signed in
              </label>
              <Link to="/forgot-password" className="text-gold-dark hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink/35">Or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* UI only — Google OAuth is not implemented */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/15 py-3.5 text-sm font-medium text-ink transition hover:border-ink/30"
          >
            <GoogleMark /> Continue with Google
          </button>

          <div className="mt-6 flex items-center gap-2 rounded-lg bg-sand-light px-4 py-3 text-xs text-ink/55">
            <ShieldCheck size={15} className="shrink-0 text-gold-dark" />
            Your orders, bookings and saved details stay private to your account.
          </div>

          <p className="mt-8 text-center text-sm text-ink/55">
            New to Glowora?{' '}
            <Link to="/register" className="font-medium text-gold-dark hover:underline">Create an account</Link>
          </p>
          <p className="mt-4 text-center text-sm text-ink/55">
            Are you an Admin?{' '}
            <Link to="/admin/login" className="font-medium text-pink-500 hover:underline">Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}