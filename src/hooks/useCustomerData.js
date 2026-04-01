// src/hooks/useCustomerData.js
// ─────────────────────────────────────────────────────────────
// Provides real-time Firestore data for a single customer:
//   measurements, orders, and invoices.
// All three are live listeners — UI updates instantly on any
// device when data changes.
//
// Data paths:
//   users/{uid}/customers/{customerId}/measurements/{id}
//   users/{uid}/customers/{customerId}/orders/{id}
//   users/{uid}/customers/{customerId}/invoices/{id}
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'

// ── Firestore services ────────────────────────────────────────
import {
  subscribeToOrders,
  addOrder          as fsAddOrder,
  updateOrder       as fsUpdateOrder,
  updateOrderStatus as fsUpdateOrderStatus,
  deleteOrder       as fsDeleteOrder,
} from '../services/orderService'

import {
  subscribeToInvoices,
  addInvoice          as fsAddInvoice,
  updateInvoiceStatus as fsUpdateInvoiceStatus,
  deleteInvoice       as fsDeleteInvoice,
} from '../services/invoiceService'

import {
  subscribeToMeasurements,
  addMeasurement    as fsAddMeasurement,
  deleteMeasurement as fsDeleteMeasurement,
} from '../services/measurementService'

// ─────────────────────────────────────────────────────────────

export function useCustomerData(customerId) {
  const { user } = useAuth()

  const [measurements, setMeasurements] = useState([])
  const [orders,       setOrders]       = useState([])
  const [invoices,     setInvoices]     = useState([])

  // ── Real-time listeners ───────────────────────────────────
  useEffect(() => {
    if (!user || !customerId) {
      setMeasurements([])
      setOrders([])
      setInvoices([])
      return
    }

    const unsubMeas = subscribeToMeasurements(
      user.uid, customerId,
      (data) => setMeasurements(data),
      (err)  => console.error('[useCustomerData] measurements:', err)
    )

    const unsubOrders = subscribeToOrders(
      user.uid, customerId,
      (data) => setOrders(data),
      (err)  => console.error('[useCustomerData] orders:', err)
    )

    const unsubInvoices = subscribeToInvoices(
      user.uid, customerId,
      (data) => setInvoices(data),
      (err)  => console.error('[useCustomerData] invoices:', err)
    )

    return () => {
      unsubMeas()
      unsubOrders()
      unsubInvoices()
    }
  }, [user, customerId])

  // ── MEASUREMENTS ─────────────────────────────────────────

  const saveMeasurement = useCallback(async (entry) => {
    if (!user || !customerId) return
    try {
      const { id: _localId, ...data } = entry
      await fsAddMeasurement(user.uid, customerId, data)
    } catch (err) {
      console.error('[useCustomerData] saveMeasurement:', err)
      throw err
    }
  }, [user, customerId])

  const deleteMeasurement = useCallback(async (id) => {
    if (!user || !customerId) return
    try {
      await fsDeleteMeasurement(user.uid, customerId, String(id))
    } catch (err) {
      console.error('[useCustomerData] deleteMeasurement:', err)
      throw err
    }
  }, [user, customerId])

  // ── ORDERS ───────────────────────────────────────────────

  const saveOrder = useCallback(async (order) => {
    if (!user || !customerId) return
    try {
      const { id: _localId, ...data } = order
      await fsAddOrder(user.uid, customerId, data)
    } catch (err) {
      console.error('[useCustomerData] saveOrder:', err)
      throw err
    }
  }, [user, customerId])

  const updateOrderStatus = useCallback(async (id, status) => {
    if (!user || !customerId) return
    try {
      await fsUpdateOrderStatus(user.uid, customerId, String(id), status)
    } catch (err) {
      console.error('[useCustomerData] updateOrderStatus:', err)
      throw err
    }
  }, [user, customerId])

  const deleteOrder = useCallback(async (id) => {
    if (!user || !customerId) return
    try {
      await fsDeleteOrder(user.uid, customerId, String(id))
    } catch (err) {
      console.error('[useCustomerData] deleteOrder:', err)
      throw err
    }
  }, [user, customerId])

  // ── INVOICES ─────────────────────────────────────────────

  const saveInvoice = useCallback(async (invoice) => {
    if (!user || !customerId) return
    try {
      await fsAddInvoice(user.uid, customerId, invoice)
    } catch (err) {
      console.error('[useCustomerData] saveInvoice:', err)
      throw err
    }
  }, [user, customerId])

  const updateInvoiceStatus = useCallback(async (id, status) => {
    if (!user || !customerId) return
    try {
      await fsUpdateInvoiceStatus(user.uid, customerId, String(id), status)
    } catch (err) {
      console.error('[useCustomerData] updateInvoiceStatus:', err)
      throw err
    }
  }, [user, customerId])

  const deleteInvoice = useCallback(async (id) => {
    if (!user || !customerId) return
    try {
      await fsDeleteInvoice(user.uid, customerId, String(id))
    } catch (err) {
      console.error('[useCustomerData] deleteInvoice:', err)
      throw err
    }
  }, [user, customerId])

  // ─────────────────────────────────────────────────────────
  return {
    measurements, saveMeasurement, deleteMeasurement,
    orders,       saveOrder,       updateOrderStatus, deleteOrder,
    invoices,     saveInvoice,     updateInvoiceStatus, deleteInvoice,
  }
}
