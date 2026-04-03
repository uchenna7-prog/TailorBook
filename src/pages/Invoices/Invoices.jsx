// src/pages/Invoices/Invoices.jsx

import { useState, useEffect, useRef } from 'react'
import { useAuth }      from '../../contexts/AuthContext'
import { useCustomers } from '../../contexts/CustomerContext'
import { useSettings }  from '../../contexts/SettingsContext'
import { subscribeToInvoices, updateInvoiceStatus, deleteInvoice } from '../../services/invoiceService'
import Header      from '../../components/Header/Header'
import InvoiceView from '../CustomerDetail/tabs/InvoiceView'
import ConfirmSheet from '../../components/ConfirmSheet/ConfirmSheet'
import Toast        from '../../components/Toast/Toast'
import styles from './Invoices.module.css'

// ── Helpers ───────────────────────────────────────────────────

function calculateInvoiceTotal(invoice) {
  if (invoice.items && invoice.items.length > 0) {
    return invoice.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
  }
  return parseFloat(invoice.price) || 0
}

function fmt(currency = '₦', amount) {
  const n = parseFloat(amount) || 0
  return `${currency}${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
}

function isOverdue(invoice) {
  if (invoice.status === 'paid') return false
  if (!invoice.due) return false
  return new Date(invoice.due + 'T23:59:59') < new Date()
}

// ── Tabs ──────────────────────────────────────────────────────

const TABS = [
  { id: 'all',     label: 'All'     },
  { id: 'unpaid',  label: 'Unpaid'  },
  { id: 'paid',    label: 'Paid'    },
  { id: 'overdue', label: 'Overdue' },
]

// ── Invoice List Item ─────────────────────────────────────────

function InvoiceCard({ invoice, currency, onTap, isLast }) {
  const total   = calculateInvoiceTotal(invoice)
  const overdue = isOverdue(invoice)

  return (
    <div
      className={`${styles.invoiceListItem} ${isLast ? styles.invoiceListItemLast : ''} ${overdue ? styles.invoiceListItemOverdue : ''}`}
      onClick={onTap}
    >
      <div className={styles.invoiceListOuter}>
        <div className={styles.invoiceListInner}>
          <span className="mi" style={{ fontSize: '1.5rem', color: overdue ? '#ef4444' : 'var(--text3)' }}>
            receipt_long
          </span>
        </div>
      </div>

      <div className={styles.invoiceListInfo}>
        <div className={styles.invoiceListDesc}>{invoice.orderDesc || 'Order'}</div>
        <div className={styles.invoiceListOrdRow}>{invoice.number}</div>
        <div className={styles.invoiceListMeta}>
          <span className="mi" style={{ fontSize: '0.8rem', color: 'var(--text3)', verticalAlign: 'middle' }}>person</span>
          <span className={styles.invoiceListMetaText}>{invoice.customerName || '—'}</span>
        </div>
        <div className={styles.invoiceListAmount}>{fmt(currency, total)}</div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

export default function Invoices({ onMenuClick }) {
  const { user }       = useAuth()
  const { customers }  = useCustomers()
  const { settings }   = useSettings()
  const currency       = settings.invoiceCurrency || '₦'

  const [allInvoices,  setAllInvoices]  = useState([])
  const [activeTab,    setActiveTab]    = useState('all')
  const [viewing,      setViewing]      = useState(null)
  const [confirmDel,   setConfirmDel]   = useState(null)
  const [toastMsg,     setToastMsg]     = useState('')
  const unsubsRef  = useRef({})
  const toastTimer = useRef(null)

  // ── Subscribe to all customers' invoices ─────────────────
  useEffect(() => {
    Object.values(unsubsRef.current).forEach(u => u())
    unsubsRef.current = {}

    if (!user || !customers.length) {
      setAllInvoices([])
      return
    }

    const invoiceMap = {}
    customers.forEach(customer => {
      const unsub = subscribeToInvoices(
        user.uid,
        customer.id,
        (invoices) => {
          invoiceMap[customer.id] = invoices.map(inv => ({
            ...inv,
            customerName:  inv.customerName  || customer.name,
            customerPhone: inv.customerPhone || customer.phone || '',
            customerId:    customer.id,
          }))
          const flat = Object.values(invoiceMap)
            .flat()
            .sort((a, b) => {
              const aTime = a.createdAt?.toMillis?.() ?? 0
              const bTime = b.createdAt?.toMillis?.() ?? 0
              return bTime - aTime
            })
          setAllInvoices([...flat])
        },
        (err) => console.error('[Invoices]', customer.id, err)
      )
      unsubsRef.current[customer.id] = unsub
    })

    return () => {
      Object.values(unsubsRef.current).forEach(u => u())
      unsubsRef.current = {}
    }
  }, [user, customers])

  const showToast = (msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2400)
  }

  // ── Status change ─────────────────────────────────────────
  const handleStatusChange = async (invoiceId, newStatus) => {
    if (!user || !viewing) return
    try {
      await updateInvoiceStatus(user.uid, viewing.customerId, invoiceId, newStatus)
      // Keep viewing invoice in sync
      setViewing(prev => prev && prev.id === invoiceId ? { ...prev, status: newStatus } : prev)
      showToast(`Marked as ${newStatus}`)
    } catch {
      showToast('Failed to update status.')
    }
  }

  // ── Delete ────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!confirmDel || !user) return
    try {
      await deleteInvoice(user.uid, confirmDel.customerId, confirmDel.id)
      showToast('Invoice deleted')
      setViewing(null)
    } catch {
      showToast('Failed to delete invoice.')
    }
    setConfirmDel(null)
  }

  // ── Filter & group ────────────────────────────────────────
  const filtered = allInvoices.filter(inv => {
    if (activeTab === 'all')     return true
    if (activeTab === 'paid')    return inv.status === 'paid'
    if (activeTab === 'unpaid')  return inv.status !== 'paid' && !isOverdue(inv)
    if (activeTab === 'overdue') return isOverdue(inv)
    return true
  })

  const counts = {
    all:     allInvoices.length,
    unpaid:  allInvoices.filter(i => i.status !== 'paid' && !isOverdue(i)).length,
    paid:    allInvoices.filter(i => i.status === 'paid').length,
    overdue: allInvoices.filter(i => isOverdue(i)).length,
  }

  const grouped = filtered.reduce((acc, inv) => {
    const key = inv.date || 'Unknown Date'
    if (!acc[key]) acc[key] = []
    acc[key].push(inv)
    return acc
  }, {})

  // ── Build the customer object InvoiceView expects ─────────
  // InvoiceView's templates need { name, phone, address }
  const viewingCustomer = viewing
    ? {
        name:    viewing.customerName  || '',
        phone:   viewing.customerPhone || '',
        address: viewing.customerAddress || '',
      }
    : null

  return (
    <div className={styles.page}>
      <Header title="Invoices" onMenuClick={onMenuClick} />

      <div className={styles.tabs}>
        {TABS.map(tab => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={(e) => {
              setActiveTab(tab.id)
              e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }}
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

      <div className={styles.listArea}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span className="mi" style={{ fontSize: '2.8rem', opacity: 0.2 }}>receipt_long</span>
            <p>No invoices found.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, dateInvoices]) => (
            <div key={date} className={styles.invoiceGroup}>
              <div className={styles.invoiceGroupDate}>{date}</div>
              <div className={styles.invoiceGroupDivider} />
              {dateInvoices.map((inv, idx) => (
                <InvoiceCard
                  key={`${inv.customerId}-${inv.id}`}
                  invoice={inv}
                  currency={currency}
                  isLast={idx === dateInvoices.length - 1}
                  onTap={() => setViewing(inv)}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── Real InvoiceView with proper template rendering ── */}
      {viewing && viewingCustomer && (
        <InvoiceView
          invoice={viewing}
          customer={viewingCustomer}
          onClose={() => setViewing(null)}
          onStatusChange={handleStatusChange}
          onDelete={(id) => setConfirmDel(viewing)}
          showToast={showToast}
        />
      )}

      <ConfirmSheet
        open={!!confirmDel}
        title="Delete this invoice?"
        message="This can't be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDel(null)}
      />

      <Toast message={toastMsg} />
    </div>
  )
}
