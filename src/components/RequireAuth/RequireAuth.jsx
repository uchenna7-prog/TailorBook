// src/components/RequireAuth/RequireAuth.jsx
// ─────────────────────────────────────────────────────────────
// Wrap any route with this to require authentication.
// Usage in App.jsx:
//   <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
// ─────────────────────────────────────────────────────────────

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function RequireAuth({ children }) {
  const { user }   = useAuth()
  const location   = useLocation()

  if (!user) {
    // Redirect to login, preserving the URL they were trying to reach
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
