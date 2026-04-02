import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  subscribeToCustomers,
  addCustomer    as fsAdd,
  updateCustomer as fsUpdate,
  deleteCustomer as fsDelete,
} from '../services/customerService'

const CustomerContext = createContext(null)

export function CustomerProvider({ children }) {
  const { user } = useAuth()

  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    if (!user) {
      setCustomers([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsub = subscribeToCustomers(
      user.uid,
      (data) => { setCustomers(data); setLoading(false) },
      (err)  => { setError(err.message); setLoading(false) }
    )

    return unsub
  }, [user])

  const addCustomer = useCallback(async (customer) => {
    if (!user) { alert('NO USER - not logged in'); return }
    try {
      const { id: _localId, ...data } = customer
      alert('Saving to Firestore: ' + JSON.stringify(data).slice(0, 100))
      const result = await fsAdd(user.uid, data)
      alert('Saved! ID: ' + result)
      return result
    } catch (err) {
      alert('ERROR: ' + err.message)
      setError(err.message)
      throw err
    }
  }, [user])

  const updateCustomer = useCallback(async (id, updates) => {
    if (!user) return
    try {
      await fsUpdate(user.uid, String(id), updates)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const deleteCustomer = useCallback(async (id) => {
    if (!user) return
    try {
      await fsDelete(user.uid, String(id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const getCustomer = useCallback((id) => {
    return customers.find(c => String(c.id) === String(id)) ?? null
  }, [customers])

  return (
    <CustomerContext.Provider value={{
      customers,
      loading,
      error,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      getCustomer,
    }}>
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomers() {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomers must be used inside CustomerProvider')
  return ctx
}
