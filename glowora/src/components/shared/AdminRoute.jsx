import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

// ---------------------------------------------------------------------------
// AdminRoute
// ---------------------------------------------------------------------------
// Wrap the /admin route tree. Unlike ProtectedRoute (any signed-in account),
// this also checks user.role === 'Admin' — matching the backend's
// `authorize('Admin')` guard on every /api/admin/* route. Without this,
// the admin UI shell was reachable by anyone who typed /admin in the URL,
// even though the actual data calls would still fail server-side.
//
// Usage (in App.jsx):
//   <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
// ---------------------------------------------------------------------------
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user?.role !== 'Admin') {
    return <Navigate to="/" replace />
  }

  return children
}