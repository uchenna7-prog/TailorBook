// src/services/customerService.js
// ─────────────────────────────────────────────────────────────
// All Firestore calls for customers live here.
// Data path: users/{uid}/customers/{customerId}
//
// This keeps Firebase completely out of your components.
// Orders and tasks follow the exact same pattern — just swap
// 'customers' for 'orders' or 'tasks' and copy this file.
// ─────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Path helpers ──────────────────────────────────────────────

function customersRef(uid) {
  return collection(db, 'users', uid, 'customers')
}

function customerDoc(uid, customerId) {
  return doc(db, 'users', uid, 'customers', customerId)
}

// ── CRUD ─────────────────────────────────────────────────────

export async function addCustomer(uid, data) {
  const ref = await addDoc(customersRef(uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getCustomer(uid, customerId) {
  const snap = await getDoc(customerDoc(uid, customerId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getAllCustomers(uid) {
  const q    = query(customersRef(uid), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateCustomer(uid, customerId, data) {
  await updateDoc(customerDoc(uid, customerId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCustomer(uid, customerId) {
  await deleteDoc(customerDoc(uid, customerId))
}

// ── Real-time listener ────────────────────────────────────────
// NOTE: No orderBy here — orderBy('createdAt') on a snapshot requires
// a Firestore composite index and silently returns nothing if the index
// isn't ready or if createdAt hasn't been written yet (server timestamp
// is null locally for a brief moment after addDoc).
// We sort client-side instead, which is instant and always correct.

export function subscribeToCustomers(uid, callback, onError) {
  const q = query(customersRef(uid))

  return onSnapshot(
    q,
    (snap) => {
      const customers = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          // Sort newest first using createdAt if available, else 0
          const aTime = a.createdAt?.toMillis?.() ?? 0
          const bTime = b.createdAt?.toMillis?.() ?? 0
          return bTime - aTime
        })
      callback(customers)
    },
    (err) => {
      console.error('[customerService] snapshot error:', err)
      onError?.(err)
    }
  )
}
