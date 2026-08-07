import axios from 'axios'

// ---------------------------------------------------------------------------
// api — shared Axios instance for every backend call in the app.
//
// - Base URL points at the Module 1 Express API (override with VITE_API_URL
//   in a .env file for staging/production).
// - Request interceptor attaches the stored JWT as a Bearer token on every
//   outgoing request, so individual pages/services never touch headers.
// - Response interceptor clears stale credentials on a 401 (expired/invalid
//   token) so the app doesn't keep sending a dead token in a retry loop.
// ---------------------------------------------------------------------------

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bph_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token missing/expired/invalid — drop local credentials.
      // Route-level protection (ProtectedRoute) handles the actual redirect.
      localStorage.removeItem('bph_token')
      localStorage.removeItem('bph_user')
    }
    return Promise.reject(error)
  },
)

export default api
