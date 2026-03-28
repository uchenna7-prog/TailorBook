import { useState, useEffect, useCallback } from 'react'

// Per-customer localStorage keys
const measKey    = (id) => `tailorbook_measurements_${id}`
const ordersKey  = (id) => `tailorbook_orders_${id}`
const invoiceKey = (id) => `tailorbook_invoices_${id}`

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function persist(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) }
  catch { /* ignore */ }
}

export function useCustomerData(customerId) {
  const [measurements, setMeasurements] = useState([])
  const [orders, setOrders]             = useState([])
  const [invoices, setInvoices]         = useState([])

  // Load all three when customerId changes
  useEffect(() => {
    if (!customerId) return
    setMeasurements(load(measKey(customerId)))
    setOrders(load(ordersKey(customerId)))
    setInvoices(load(invoiceKey(customerId)))
  }, [customerId])

  // ── MEASUREMENTS ──
  const saveMeasurement = useCallback((entry) => {
    setMeasurements(prev => {
      const next = [entry, ...prev]
      persist(measKey(customerId), next)
      return next
    })
  }, [customerId])

  const deleteMeasurement = useCallback((id) => {
    setMeasurements(prev => {
      const next = prev.filter(m => String(m.id) !== String(id))
      persist(measKey(customerId), next)
      return next
    })
  }, [customerId])

  // ── ORDERS ──
  const saveOrder = useCallback((order) => {
    setOrders(prev => {
      const next = [order, ...prev]
      persist(ordersKey(customerId), next)
      return next
    })
  }, [customerId])

  const updateOrderStatus = useCallback((id, status) => {
    setOrders(prev => {
      const next = prev.map(o => String(o.id) === String(id) ? { ...o, status } : o)
      persist(ordersKey(customerId), next)
      return next
    })
  }, [customerId])

  const deleteOrder = useCallback((id) => {
    setOrders(prev => {
      const next = prev.filter(o => String(o.id) !== String(id))
      persist(ordersKey(customerId), next)
      return next
    })
  }, [customerId])

  // ── INVOICES ──
  const saveInvoice = useCallback((invoice) => {
    setInvoices(prev => {
      const next = [invoice, ...prev]
      persist(invoiceKey(customerId), next)
      return next
    })
  }, [customerId])

  const updateInvoiceStatus = useCallback((id, status) => {
    setInvoices(prev => {
      const next = prev.map(inv => String(inv.id) === String(id) ? { ...inv, status } : inv)
      persist(invoiceKey(customerId), next)
      return next
    })
  }, [customerId])

  const deleteInvoice = useCallback((id) => {
    setInvoices(prev => {
      const next = prev.filter(inv => String(inv.id) !== String(id))
      persist(invoiceKey(customerId), next)
      return next
    })
  }, [customerId])

  return {
    measurements, saveMeasurement, deleteMeasurement,
    orders, saveOrder, updateOrderStatus, deleteOrder,
    invoices, saveInvoice, updateInvoiceStatus, deleteInvoice,
  }
}
