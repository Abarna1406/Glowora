import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../lib/api.js'

// ---------------------------------------------------------------------------
// AuthContext
// ---------------------------------------------------------------------------
// Single source of truth for the currently authenticated professional
// account. Wraps the Module 1 auth endpoints (/api/auth/login,
// /api/auth/register) and persists the session to localStorage so a page
// refresh doesn't log the user out.
//
// Exposes: user, token, isAuthenticated, loading, error, login(), register(),
// logout(), clearError().
// ---------------------------------------------------------------------------

const TOKEN_KEY = 'bph_token'
const USER_KEY = 'bph_user'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Normalises whatever shape the API error comes back in into a single
 * human-readable string, so every page can just do `catch (err) { setError(err.message) }`.
 */
function extractErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  )
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persistSession = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
    setToken(nextToken)
    setUser(nextUser)
  }

  /**
   * login — POST /api/auth/login
   * On success, stores the JWT + user and returns the user object so the
   * calling page can redirect.
   */
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { token: nextToken, user: nextUser } = data.data
      persistSession(nextToken, nextUser)
      return nextUser
    } catch (err) {
      const message = extractErrorMessage(err)
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * register — POST /api/auth/register
   * Backend returns a token immediately on successful registration, so we
   * log the user straight in (same as login) rather than requiring a
   * separate sign-in step afterwards.
   */
  const register = useCallback(async ({ name, email, password, role }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role })
      const { token: nextToken, user: nextUser } = data.data
      persistSession(nextToken, nextUser)
      return nextUser
    } catch (err) {
      const message = extractErrorMessage(err)
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /** logout — clears local session. No server call required for JWT auth. */
  const logout = useCallback(() => {
    persistSession(null, null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  // Keep multiple tabs in sync — if the user logs out in one tab, reflect
  // that here instead of leaving a stale "authenticated" state around.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === TOKEN_KEY) setToken(e.newValue)
      if (e.key === USER_KEY) setUser(e.newValue ? JSON.parse(e.newValue) : null)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    setSession: persistSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
