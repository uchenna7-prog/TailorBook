import { useState, useRef, useCallback, useEffect } from 'react'
import { useCustomers } from '../../contexts/CustomerContext'
import Header from '../../components/Header/Header'
import ConfirmSheet from '../../components/ConfirmSheet/ConfirmSheet'
import Toast from '../../components/Toast/Toast'
import styles from './Tasks.module.css'

// ── STORAGE ──
const TASKS_KEY = 'tailorbook_tasks'

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveTasks(tasks) {
  try { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)) }
  catch { /* ignore */ }
}

// ── HELPERS ──
const PRIORITY_LABELS = { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' }
const PRIORITY_COLORS = {
  low:    { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.4)', text: '#94a3b8' },
  normal: { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.4)',  text: '#818cf8' },
  high:   { bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.4)',  text: '#fb923c' },
  urgent: { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.4)',   text: '#ef4444' },
}

function isOverdue(task) {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate + 'T23:59:59') < new Date()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  const diff = Math.round((due - today) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `${diff}d left`
}

// ── ADD TASK MODAL ──
function AddTaskModal({ isOpen, onClose, onSave, customers }) {
  const [desc, setDesc]           = useState('')
  const [notes, setNotes]         = useState('')
  const [priority, setPriority]   = useState('normal')
  const [dueDate, setDueDate]     = useState('')
  const [dueTime, setDueTime]     = useState('')
  const [reminder, setReminder]   = useState(false)
  const [custQuery, setCustQuery] = useState('')
  const [selectedCust, setSelectedCust] = useState(null)
  const [custDropOpen, setCustDropOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDropOpen, setOrderDropOpen] = useState(false)
  const [category, setCategory]   = useState('general')

  const ORDERS_FOR_CUST = selectedCust
    ? (() => {
        try {
          const raw = localStorage.getItem(`tailorbook_orders_${selectedCust.id}`)
          return raw ? JSON.parse(raw) : []
        } catch { return [] }
      })()
    : []

  const filteredCusts = custQuery.trim()
    ? customers.filter(c => c.name.toLowerCase().includes(custQuery.toLowerCase()) || c.phone?.includes(custQuery))
    : customers

  const reset = () => {
    setDesc(''); setNotes(''); setPriority('normal'); setDueDate(''); setDueTime('')
    setReminder(false); setCustQuery(''); setSelectedCust(null); setCustDropOpen(false)
    setSelectedOrder(null); setOrderDropOpen(false); setCategory('general')
  }

  const handleClose = () => { reset(); onClose() }

  const handleSave = () => {
    if (!desc.trim()) return
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    onSave({
      id: Date.now() + Math.random(),
      desc: desc.trim(),
      notes: notes.trim(),
      priority,
      dueDate,
      dueTime,
      reminder,
      category,
      customerId:    selectedCust  ? String(selectedCust.id)   : null,
      customerName:  selectedCust  ? selectedCust.name         : null,
      orderId:       selectedOrder ? String(selectedOrder.id)  : null,
      orderDesc:     selectedOrder ? selectedOrder.desc        : null,
      status: 'pending',
      createdAt: today,
    })
    reset()
    onClose()
  }

  const CATEGORIES = [
    { id: 'general',     label: 'General',     icon: 'assignment' },
    { id: 'sewing',      label: 'Sewing',       icon: 'content_cut' },
    { id: 'delivery',    label: 'Delivery',     icon: 'local_shipping' },
    { id: 'payment',     label: 'Payment',      icon: 'payments' },
    { id: 'fitting',     label: 'Fitting',      icon: 'checkroom' },
    { id: 'shopping',    label: 'Shopping',     icon: 'shopping_cart' },
  ]

  if (!isOpen) return null

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.modalOpen : ''}`}>
      <div className={styles.modalHeader}>
        <button className={styles.modalClose} onClick={handleClose}>
          <span className="mi">arrow_back</span>
        </button>
        <span className={styles.modalTitle}>New Task</span>
        <button className={styles.headerSaveBtn} onClick={handleSave}>Add</button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>What needs to be done? *</label>
          <textarea
            className={styles.textarea}
            placeholder="e.g. Finish sewing the Senator suit"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={2}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Category</label>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.categoryChip} ${category === cat.id ? styles.categoryActive : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                <span className="mi" style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Priority</label>
          <div className={styles.priorityRow}>
            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`${styles.priorityChip} ${priority === key ? styles.priorityActive : ''}`}
                style={priority === key ? {
                  background: PRIORITY_COLORS[key].bg,
                  borderColor: PRIORITY_COLORS[key].border,
                  color: PRIORITY_COLORS[key].text,
                } : {}}
                onClick={() => setPriority(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <label className={styles.fieldLabel}>Due Date</label>
            <input type="date" className={styles.input} value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <label className={styles.fieldLabel}>Due Time</label>
            <input type="time" className={styles.input} value={dueTime} onChange={e => setDueTime(e.target.value)} />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Reminder</div>
              <div className={styles.toggleSub}>Get notified when due</div>
            </div>
            <button className={`${styles.toggle} ${reminder ? styles.toggleOn : ''}`} onClick={() => setReminder(p => !p)}>
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Related Client</label>
          {selectedCust ? (
            <div className={styles.selectedChip}>
              <span className={styles.chipName}>{selectedCust.name}</span>
              <button className={styles.chipRemove} onClick={() => { setSelectedCust(null); setSelectedOrder(null) }}>
                <span className="mi">close</span>
              </button>
            </div>
          ) : (
            <div className={styles.searchWrap}>
              <span className="mi" style={{ color: 'var(--text3)', fontSize: '1.1rem' }}>search</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search client..."
                value={custQuery}
                onChange={e => { setCustQuery(e.target.value); setCustDropOpen(true) }}
              />
              {custDropOpen && custQuery && (
                <div className={styles.dropdown}>
                  {filteredCusts.slice(0, 5).map(c => (
                    <button key={c.id} className={styles.dropItem} onClick={() => { setSelectedCust(c); setCustQuery(''); setCustDropOpen(false) }}>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── TASK CARD ──
function TaskCard({ task, onToggle, onDelete, onOpen }) {
  const overdue = isOverdue(task)
  const pc = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.normal
  const due = daysUntil(task.dueDate)
  const CATEGORY_ICONS = { general: 'assignment', sewing: 'content_cut', delivery: 'local_shipping', payment: 'payments', fitting: 'checkroom', shopping: 'shopping_cart' }

  return (
    <div className={`${styles.taskCard} ${task.status === 'done' ? styles.taskDone : ''} ${overdue ? styles.taskOverdue : ''}`} onClick={onOpen}>
      <div className={styles.priorityBar} style={{ background: pc.text }} />
      <button className={`${styles.checkbox} ${task.status === 'done' ? styles.checkboxDone : ''}`} onClick={e => { e.stopPropagation(); onToggle(task.id) }}>
        {task.status === 'done' && <span className="mi" style={{ fontSize: '1rem' }}>check</span>}
      </button>
      <div className={styles.taskContent}>
        <div className={styles.taskDesc}>{task.desc}</div>
        <div className={styles.taskMeta}>
          {task.category && task.category !== 'general' && <span className={styles.metaChip}><span className="mi" style={{ fontSize: '0.85rem' }}>{CATEGORY_ICONS[task.category]}</span> {task.category}</span>}
          {task.customerName && <span className={styles.metaChip}><span className="mi" style={{ fontSize: '0.75rem' }}>person</span> {task.customerName}</span>}
          {task.dueDate && <span className={`${styles.metaChip} ${overdue ? styles.metaOverdue : ''}`}><span className="mi" style={{ fontSize: '0.75rem' }}>schedule</span> {due}</span>}
        </div>
      </div>
    </div>
  )
}

// ── MAIN PAGE ──
const TABS = [{ id: 'all', label: 'All' }, { id: 'pending', label: 'Pending' }, { id: 'done', label: 'Done' }, { id: 'overdue', label: 'Overdue' }]

export default function Tasks({ onMenuClick }) {
  const { customers } = useCustomers()
  const [tasks, setTasks] = useState(() => loadTasks())
  const [activeTab, setActiveTab] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => { saveTasks(tasks) }, [tasks])

  const addTask = (task) => { setTasks(prev => [task, ...prev]); setToastMsg('Task added ✓'); setTimeout(() => setToastMsg(''), 2000) }
  const toggleTask = (id) => setTasks(prev => prev.map(t => String(t.id) === String(id) ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t))

  const filtered = tasks.filter(t => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return t.status !== 'done' && !isOverdue(t)
    if (activeTab === 'done') return t.status === 'done'
    if (activeTab === 'overdue') return isOverdue(t)
    return true
  })

  return (
    <div className={styles.page}>
      <Header onMenuClick={onMenuClick} />
      
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <div key={tab.id} className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </div>
        ))}
      </div>

      <div className={styles.listArea}>
        {filtered.map(task => (
          <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={setConfirmDel} />
        ))}
      </div>

      <button className={styles.fab} onClick={() => setModalOpen(true)}>
        <span className="mi">add</span>
      </button>

      <AddTaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={addTask} customers={customers} />
      <Toast message={toastMsg} />
    </div>
  )
}
