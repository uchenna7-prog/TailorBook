import { useState, useRef, useCallback, useEffect } from 'react'
import { useCustomers } from '../../contexts/CustomerContext'
import Header from '../../components/Header/Header'
import ConfirmSheet from '../../components/ConfirmSheet/ConfirmSheet'
import Toast from '../../components/Toast/Toast'
import styles from './Orders.module.css'

// ── STORAGE ──
const ORDERS_KEY = 'tailorbook_orders'

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveOrders(orders) {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)) }
  catch {}
}

// ── HELPERS ──
function isOverdue(order) {
  if (!order.dueDate || order.status === 'completed') return false
  return new Date(order.dueDate + 'T23:59:59') < new Date()
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

// ── ADD ORDER MODAL ──
function AddOrderModal({ isOpen, onClose, onSave, customers }) {
  const [desc, setDesc] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [custQuery, setCustQuery] = useState('')
  const [selectedCust, setSelectedCust] = useState(null)
  const [custDropOpen, setCustDropOpen] = useState(false)

  const filteredCusts = custQuery.trim()
    ? customers.filter(c =>
        c.name.toLowerCase().includes(custQuery.toLowerCase()) ||
        c.phone?.includes(custQuery)
      )
    : customers

  const reset = () => {
    setDesc('')
    setDueDate('')
    setCustQuery('')
    setSelectedCust(null)
    setCustDropOpen(false)
  }

  const handleSave = () => {
    if (!desc.trim() || !selectedCust) return

    onSave({
      id: Date.now() + Math.random(),
      desc: desc.trim(),
      dueDate,
      status: 'pending',
      customerId: selectedCust.id,
      customerName: selectedCust.name,
      createdAt: new Date().toISOString()
    })

    reset()
    onClose()
  }

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.modalOpen : ''}`}>
      <div className={styles.modalHeader}>
        <span className={styles.modalTitle}>New Order</span>
        <button className={styles.modalClose} onClick={onClose}>
          <span className="mi">close</span>
        </button>
      </div>

      <div className={styles.modalBody}>
        {/* Outfit */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Outfit *</label>
          <textarea
            className={styles.textarea}
            placeholder="e.g. Senator wear, Agbada, Wedding gown..."
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>

        {/* Customer */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Client *</label>

          {selectedCust ? (
            <div className={styles.selectedChip}>
              <span className={styles.chipName}>{selectedCust.name}</span>
              <button
                className={styles.chipRemove}
                onClick={() => setSelectedCust(null)}
              >
                <span className="mi">close</span>
              </button>
            </div>
          ) : (
            <div className={styles.searchWrap}>
              <span className="mi">search</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search client..."
                value={custQuery}
                onChange={e => {
                  setCustQuery(e.target.value)
                  setCustDropOpen(true)
                }}
                onFocus={() => setCustDropOpen(true)}
              />

              {custDropOpen && custQuery && (
                <div className={styles.dropdown}>
                  {filteredCusts.length === 0 ? (
                    <div className={styles.dropEmpty}>No clients found</div>
                  ) : (
                    filteredCusts.map(c => (
                      <button
                        key={c.id}
                        className={styles.dropItem}
                        onClick={() => {
                          setSelectedCust(c)
                          setCustQuery('')
                          setCustDropOpen(false)
                        }}
                      >
                        <div className={styles.dropName}>{c.name}</div>
                        <div className={styles.dropMeta}>{c.phone}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Delivery Date</label>
          <input
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.modalSaveBar}>
        <button className={styles.btnSave} onClick={handleSave}>
          Add Order
        </button>
      </div>
    </div>
  )
}

// ── ORDER CARD ──
function OrderCard({ order, onDelete, onOpen }) {
  const overdue = isOverdue(order)
  const due = daysUntil(order.dueDate)

  return (
    <div
      className={`${styles.card} ${order.status === 'completed' ? styles.done : ''} ${overdue ? styles.overdue : ''}`}
      onClick={onOpen}
    >
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{order.desc}</div>

        <div className={styles.cardMeta}>
          <span className={styles.metaChip}>
            <span className="mi">person</span>
            {order.customerName}
          </span>

          {order.dueDate && (
            <span className={`${styles.metaChip} ${overdue ? styles.metaOverdue : ''}`}>
              <span className="mi">schedule</span>
              {due}
            </span>
          )}
        </div>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={e => {
          e.stopPropagation()
          onDelete(order)
        }}
      >
        <span className="mi">delete_outline</span>
      </button>
    </div>
  )
}

// ── ORDER DETAIL ──
function OrderDetail({ order, onClose, onUpdate, onDelete }) {
  if (!order) return null

  return (
    <div
      className={styles.detailOverlay}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.detailPanel}>
        <div className={styles.detailHeader}>
          <div className={styles.detailTitle}>Order Details</div>
          <button onClick={onClose}>
            <span className="mi">close</span>
          </button>
        </div>

        <div className={styles.detailBody}>
          <p className={styles.detailDesc}>{order.desc}</p>

          <div className={styles.detailGrid}>
            <div className={styles.detailCell}>
              <div className={styles.detailCellLabel}>Client</div>
              <div className={styles.detailCellVal}>{order.customerName}</div>
            </div>

            <div className={styles.detailCell}>
              <div className={styles.detailCellLabel}>Status</div>
              <div className={styles.detailCellVal}>{order.status}</div>
            </div>
          </div>

          <button
            className={styles.statusBtn}
            onClick={() => onUpdate(order.id)}
          >
            Mark as Completed
          </button>

          <button
            className={styles.detailDeleteBtn}
            onClick={() => onDelete(order)}
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ── TABS ──
const TABS = [
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'overdue', label: 'Overdue' },
]

// ── MAIN PAGE ──
export default function Orders({ onMenuClick }) {
  const { customers } = useCustomers()

  const [orders, setOrders] = useState(() => loadOrders())
  const [activeTab, setActiveTab] = useState('active')
  const [modalOpen, setModalOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [toast, setToast] = useState('')
  const timer = useRef()

  const showToast = useCallback(msg => {
    setToast(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2000)
  }, [])

  useEffect(() => saveOrders(orders), [orders])

  const addOrder = order => {
    setOrders(prev => [order, ...prev])
    showToast('Order added')
  }

  const markCompleted = id => {
    setOrders(prev =>
      prev.map(o =>
        String(o.id) === String(id) ? { ...o, status: 'completed' } : o
      )
    )
    setDetail(null)
    showToast('Order completed ✓')
  }

  const handleDelete = () => {
    if (!confirmDel) return
    setOrders(prev => prev.filter(o => String(o.id) !== String(confirmDel.id)))
    setConfirmDel(null)
    setDetail(null)
    showToast('Order deleted')
  }

  const filtered = orders.filter(o => {
    if (activeTab === 'active') return o.status !== 'completed' && !isOverdue(o)
    if (activeTab === 'pending') return o.status === 'pending'
    if (activeTab === 'completed') return o.status === 'completed'
    if (activeTab === 'overdue') return isOverdue(o)
    return true
  })

  const counts = {
    active: orders.filter(o => o.status !== 'completed' && !isOverdue(o)).length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    overdue: orders.filter(o => isOverdue(o)).length,
  }

  return (
    <div className={styles.page}>
      <Header onMenuClick={onMenuClick} />

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className={`${styles.tabBadge} ${tab.id === 'overdue' ? styles.badgeOverdue : ''}`}>
                {counts[tab.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* List */}
      <div className={styles.listArea}>
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <span className="mi" style={{ fontSize: '2.5rem', opacity: 0.2 }}>
              assignment
            </span>
            <p>No orders here.</p>
          </div>
        )}

        {filtered.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onDelete={setConfirmDel}
            onOpen={() => setDetail(order)}
          />
        ))}
      </div>

      {/* FAB */}
      <button className={styles.fab} onClick={() => setModalOpen(true)}>
        <span className="mi">add</span>
      </button>

      <AddOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addOrder}
        customers={customers}
      />

      {detail && (
        <OrderDetail
          order={detail}
          onClose={() => setDetail(null)}
          onUpdate={markCompleted}
          onDelete={setConfirmDel}
        />
      )}

      <ConfirmSheet
        open={!!confirmDel}
        title="Delete Order?"
        message="This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />

      <Toast message={toast} />
    </div>
  )
}