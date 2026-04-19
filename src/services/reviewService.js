// src/services/reviewService.js
// ─────────────────────────────────────────────────────────────
// Data path: users/{uid}/reviews/{reviewId}
//
// Each review doc stores:
//   customerName  — string
//   customerPhone — string (for WhatsApp link generation)
//   customerId    — string | null
//   review        — string  (the review text)
//   rating        — number  (1–5)
//   status        — 'pending' | 'approved' | 'rejected'
//   token         — string  (unique UUID used in the public review link)
//   createdAt     — serverTimestamp
//   updatedAt     — serverTimestamp
//   approvedAt    — serverTimestamp | null
// ─────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Path helpers ──────────────────────────────────────────────

function reviewsRef(uid) {
  return collection(db, 'users', uid, 'reviews')
}

function reviewDoc(uid, reviewId) {
  return doc(db, 'users', uid, 'reviews', reviewId)
}

// ── CRUD ──────────────────────────────────────────────────────

/**
 * Add a new pending review (called when customer submits via link).
 * @param {string} uid
 * @param {object} data - { customerName, customerPhone, customerId, review, rating, token }
 * @returns {string} new Firestore doc ID
 */
export async function addReview(uid, data) {
  const ref = await addDoc(reviewsRef(uid), {
    ...data,
    status:     'pending',
    approvedAt: null,
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  })
  return ref.id
}

/**
 * Update a review — used for approve / reject / edit.
 */
export async function updateReview(uid, reviewId, data) {
  await updateDoc(reviewDoc(uid, reviewId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Approve a review — sets status to 'approved' and stamps approvedAt.
 */
export async function approveReview(uid, reviewId) {
  await updateDoc(reviewDoc(uid, reviewId), {
    status:     'approved',
    approvedAt: serverTimestamp(),
    updatedAt:  serverTimestamp(),
  })
}

/**
 * Reject a review — sets status to 'rejected'.
 */
export async function rejectReview(uid, reviewId) {
  await updateDoc(reviewDoc(uid, reviewId), {
    status:     'rejected',
    approvedAt: null,
    updatedAt:  serverTimestamp(),
  })
}

/**
 * Delete a review permanently.
 */
export async function deleteReview(uid, reviewId) {
  await deleteDoc(reviewDoc(uid, reviewId))
}

// ── Real-time listener ────────────────────────────────────────

/**
 * Subscribe to all reviews for this tailor, sorted newest first.
 * Sorting is done client-side to avoid composite index requirement.
 */
export function subscribeToReviews(uid, callback, onError) {
  const q = query(reviewsRef(uid))

  return onSnapshot(
    q,
    (snap) => {
      const reviews = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0
          const bTime = b.createdAt?.toMillis?.() ?? 0
          return bTime - aTime
        })
      callback(reviews)
    },
    (err) => {
      console.error('[reviewService] snapshot error:', err)
      onError?.(err)
    }
  )
}
