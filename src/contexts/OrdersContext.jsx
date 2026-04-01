import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  subscribeToOrders,
  addOrder          as fsAdd,
  updateOrder       as fsUpdate,
  updateOrderStatus as fsUpdateStatus,
  deleteOrder       as fsDelete,
} from '../services/orderService'

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const { user } = useAuth()

  // orders are keyed by customerId so each CustomerDetail
  // only loads the orders it needs
  const [ordersByCustomer, setOrdersByCustomer] = useState({})
  const [activeUnsubs,     setActiveUnsubs]     = useState({})

  // ── Subscribe to a specific customer's orders ─────────────
  // Call this from CustomerDetail when it mounts.
  // Returns the unsubscribe function so the caller can clean up.
  const subscribeCustomerOrders = useCallback((customerId) => {
    if (!user || !customerId) return () => {}

    // Already subscribed — don't create a duplicate listener
    if (activeUnsubs[customerId]) return activeUnsubs[customerId]

    const unsub = subscribeToOrders(
      user.uid,
      customerId,
      (orders) => {
        setOrdersByCustomer(prev => ({ ...prev, [customerId]: orders }))
      },
      (err) => console.error('[OrdersContext]', err)
    )

    setActiveUnsubs(prev => ({ ...prev, [customerId]: unsub }))
    return unsub
  }, [user, activeUnsubs])

  // Clean up all listeners when user logs out
  useEffect(() => {
    if (!user) {
      Object.values(activeUnsubs).forEach(unsub => unsub())
      setActiveUnsubs({})
      setOrdersByCustomer({})
    }
  }, [user])

  // ── Get orders for a specific customer ────────────────────
  const getOrders = useCallback((customerId) => {
    return ordersByCustomer[customerId] || []
  }, [ordersByCustomer])

  // ── CRUD — all scoped to customerId ──────────────────────

  const addOrder = useCallback(async (customerId, data) => {
    if (!user) return
    try {
      const { id: _localId, ...orderData } = data
      return await fsAdd(user.uid, customerId, orderData)
    } catch (err) {
      console.error('[OrdersContext] addOrder:', err)
      throw err
    }
  }, [user])

  const updateOrder = useCallback(async (customerId, orderId, data) => {
    if (!user) return
    try {
      await fsUpdate(user.uid, customerId, String(orderId), data)
    } catch (err) {
      console.error('[OrdersContext] updateOrder:', err)
      throw err
    }
  }, [user])

  const updateOrderStatus = useCallback(async (customerId, orderId, status) => {
    if (!user) return
    try {
      await fsUpdateStatus(user.uid, customerId, String(orderId), status)
    } catch (err) {
      console.error('[OrdersContext] updateOrderStatus:', err)
      throw err
    }
  }, [user])

  const deleteOrder = useCallback(async (customerId, orderId) => {
    if (!user) return
    try {
      await fsDelete(user.uid, customerId, String(orderId))
    } catch (err) {
      console.error('[OrdersContext] deleteOrder:', err)
      throw err
    }
  }, [user])

  return (
    <OrdersContext.Provider value={{
      getOrders,
      subscribeCustomerOrders,
      addOrder,
      updateOrder,
      updateOrderStatus,
      deleteOrder,
    }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
