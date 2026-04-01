import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  subscribeToTasks,
  addTask    as fsAdd,
  updateTask as fsUpdate,
  toggleTask as fsToggle,
  deleteTask as fsDelete,
} from '../services/taskService'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const { user } = useAuth()

  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // ── Real-time listener — all tasks for this user ──────────
  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsub = subscribeToTasks(
      user.uid,
      (data) => { setTasks(data); setLoading(false) },
      (err)  => { setError(err.message); setLoading(false) }
    )

    return unsub
  }, [user])

  // ── CRUD ─────────────────────────────────────────────────

  const addTask = useCallback(async (data) => {
    if (!user) return
    try {
      const { id: _localId, ...taskData } = data
      return await fsAdd(user.uid, taskData)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const updateTask = useCallback(async (id, data) => {
    if (!user) return
    try {
      await fsUpdate(user.uid, String(id), data)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  // Toggle done/undone
  const toggleTask = useCallback(async (id, currentDone) => {
    if (!user) return
    try {
      await fsToggle(user.uid, String(id), currentDone)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const deleteTask = useCallback(async (id) => {
    if (!user) return
    try {
      await fsDelete(user.uid, String(id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user])

  const getTask = useCallback((id) => {
    return tasks.find(t => String(t.id) === String(id)) ?? null
  }, [tasks])

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      getTask,
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider')
  return ctx
}
