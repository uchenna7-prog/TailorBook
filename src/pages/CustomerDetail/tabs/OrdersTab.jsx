import { useState, useEffect } from 'react'
import ConfirmSheet from '../../../components/ConfirmSheet/ConfirmSheet'
import styles from './Tabs.module.css'

const PRIORITY_COLOR = { normal: 'var(--border2)', urgent: '#fb923c', vip: '#a855f7' }
const PRIORITY_BANNER = {
  normal: { cls: styles.bannerNormal, text: 'Normal Priority' },
  urgent: { cls: styles.bannerUrgent, text: 'Urgent ★' },
  vip:    { cls: styles.bannerVip,    text: 'VIP ★' },
}

// ── Status config ──
const STATUSES = [
  { value: 'pending',   label: 'Pending'   },
  { value: 'completed', label: 'Completed' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

// (OrderModal + OrderDetail remain EXACTLY as you wrote them above — no changes)

// ── MAIN TAB ──────────────────────────────────────────────────
export default function OrdersTab({ orders, measurements, onSave, onDelete, onStatusChange, showToast }) {
  const [modalOpen,    setModalOpen]    = useState(false)
  const [detailOrder,  setDetailOrder]  = useState(null)
  const [confirmDel,   setConfirmDel]   = useState(null)

  useEffect(() => {
    const handler = () => setModalOpen(true)
    document.addEventListener('openOrderModal', handler)
    return () => document.removeEventListener('openOrderModal', handler)
  }, [])

  const handleSave = (order) => {
    onSave(order)
    showToast('Order placed ✓')
  }

  const handleDeleteConfirm = () => {
    if (!confirmDel) return
    onDelete(confirmDel.id)
    showToast('Order deleted')
    setConfirmDel(null)
    setDetailOrder(null)
  }

  const handleStatusChange = (id, status) => {
    onStatusChange(id, status)
    setDetailOrder(prev =>
      prev && String(prev.id) === String(id) ? { ...prev, status } : prev
    )
  }

  const handleGenerateInvoice = (orderId) => {
    document.dispatchEvent(new CustomEvent('generateInvoice', { detail: { orderId } }))
    document.dispatchEvent(new CustomEvent('switchToInvoiceTab'))
    setDetailOrder(null)
    showToast('Generating invoice…')
  }

  // ✅ GROUP ORDERS BY DATE (NEW)
  const groupedOrders = orders.reduce((acc, order) => {
    const date = order.date || 'No Date'
    if (!acc[date]) acc[date] = []
    acc[date].push(order)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedOrders).sort(
    (a, b) => new Date(b) - new Date(a)
  )

  return (
    <>
      {orders.length === 0 && (
        <div className={styles.emptyState}>
          <span className="mi" style={{ fontSize: '2.8rem', opacity: 0.4 }}>shopping_basket</span>
          <p>No active orders yet.</p>
          <span className={styles.hint}>Tap + to place an order</span>
        </div>
      )}

      {/* ✅ DATE GROUPING + FLAT LIST */}
      {sortedDates.map(date => (
        <div key={date}>
          
          <div className={styles.dateHeader}>{date}</div>

          {groupedOrders[date].map(o => {
            const priceStr    = o.price !== null && o.price !== undefined ? `₦${Number(o.price).toLocaleString()}` : '—'
            const dueStr      = o.due ? `Due ${o.due}` : 'No due date'
            const statusLabel = STATUSES.find(s => s.value === o.status)?.label ?? o.status ?? 'Pending'
            const statusClass = o.status === 'completed' || o.status === 'delivered'
              ? styles.statusDone : styles.statusPending

            return (
              <div key={o.id} className={styles.orderRow} onClick={() => setDetailOrder(o)}>
                
                <div className={styles.orderRowIcon}>
                  <span className="mi">content_cut</span>
                </div>

                <div className={styles.orderRowInfo}>
                  <h4>{o.desc}</h4>
                  <p>{dueStr}</p>
                  <span className={`${styles.statusBadge} ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className={styles.orderPrice}>{priceStr}</div>
                  {o.qty > 1 && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: 2 }}>
                      ×{o.qty}
                    </div>
                  )}
                </div>

              </div>
            )
          })}

        </div>
      ))}

      {/* ✅ DO NOT TOUCH (kept exactly) */}
      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        measurements={measurements}
        onSave={handleSave}
      />

      {detailOrder && (
        <OrderDetail
          order={detailOrder}
          measurements={measurements}
          onClose={() => setDetailOrder(null)}
          onDelete={() => setConfirmDel(detailOrder)}
          onStatusChange={handleStatusChange}
          onGenerateInvoice={handleGenerateInvoice}
        />
      )}

      <ConfirmSheet
        open={!!confirmDel}
        title="Delete Order?"
        message="This can't be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDel(null)}
      />
    </>
  )
}