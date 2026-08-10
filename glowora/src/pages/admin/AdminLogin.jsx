import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import Logo from '../../components/shared/Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { login, logout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin'

  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
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
      if (user.role !== 'Admin') {
        logout()
        setFormError('Unauthorized access. Admin privileges required.')
        return
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-porcelain px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <Logo />
          <span className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-gold-dark">Admin Portal</span>
        </div>

        <h1 className="mt-8 text-center font-display text-2xl text-ink">Sign In</h1>

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
              placeholder="admin@glowora.com"
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
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign in as Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
