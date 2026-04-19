// src/contexts/ReviewContext.jsx
// ─────────────────────────────────────────────────────────────
// Provides:
//   reviews        — all reviews, real-time from Firestore
//   pendingCount   — number of reviews awaiting approval
//   loading        — true while first fetch is in flight
//   error          — last error string or null
//   addReview      — async (data) => firestoreId
//   approveReview  — async (id)
//   rejectReview   — async (id)
//   deleteReview   — async (id)
//   updateReview   — async (id, data)
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  subscribeToReviews,
  addReview     as fsAddReview,
  approveReview as fsApproveReview,
  rejectReview  as fsRejectReview,
  deleteReview  as fsDeleteReview,
  updateReview  as fsUpdateReview,
} from '../services/reviewService'

const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const { user } = useAuth()

  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  // ── Real-time listener ───────────────────────────────────

  useEffect(() => {
    if (!user) {
      setReviews([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsub = subscribeToReviews(
      user.uid,
      (data) => { setReviews(data); setLoading(false) },
      (err)  => { setError(err.message); setLoading(false) }
    )

    return unsub
  }, [user])

  // ── Derived ──────────────────────────────────────────────

  const pendingCount = reviews.filter(r => r.status === 'pending').length

  // ── CRUD ─────────────────────────────────────────────────

  const addReview = useCallback(async (data) => {
    if (!user) return
    try {
      const { id: _localId, ...reviewData } = data
      return await fsAddReview(user.uid, reviewData)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const approveReview = useCallback(async (id) => {
    if (!user) return
    try {
      await fsApproveReview(user.uid, String(id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const rejectReview = useCallback(async (id) => {
    if (!user) return
    try {
      await fsRejectReview(user.uid, String(id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const deleteReview = useCallback(async (id) => {
    if (!user) return
    try {
      await fsDeleteReview(user.uid, String(id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const updateReview = useCallback(async (id, data) => {
    if (!user) return
    try {
      await fsUpdateReview(user.uid, String(id), data)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  return (
    <ReviewContext.Provider value={{
      reviews,
      pendingCount,
      loading,
      error,
      addReview,
      approveReview,
      rejectReview,
      deleteReview,
      updateReview,
    }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReviews must be used inside ReviewProvider')
  return ctx
}
