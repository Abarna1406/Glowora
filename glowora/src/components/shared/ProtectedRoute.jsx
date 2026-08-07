import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

// ---------------------------------------------------------------------------
// ProtectedRoute
// ---------------------------------------------------------------------------
// Wrap any route element that requires a signed-in professional account.
// Redirects to /login when there's no valid session, preserving the
// original destination in location state so Login can send the user back
// where they were headed after a successful sign-in.
//
// Usage (in App.jsx):
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// ---------------------------------------------------------------------------
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
