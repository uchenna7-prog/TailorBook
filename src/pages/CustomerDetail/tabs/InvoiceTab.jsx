import { useState } from 'react'
import InvoiceView from './InvoiceView'
import ConfirmSheet from '../../../components/ConfirmSheet/ConfirmSheet'
import Header from '../../../components/Header/Header'
import styles from './InvoiceTab.module.css'

function fmt(currency = '₦', amount) {
  const n = parseFloat(amount) || 0
  return `${currency}${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
}

const STATUS_LABELS = { unpaid: 'Unpaid', paid: 'Paid', overdue: 'Overdue' }

// ─────────────────────────────────────────────────────────────
// Invoice card
// ─────────────────────────────────────────────────────────────

function InvoiceCard({ invoice, currency, onTap, isLast }) {
  // ── FIX: derive total from itemised prices when available,
  //    otherwise fall back to the stored price field (never × qty).
  const total = invoice.items?.length > 0
    ? invoice.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    : (parseFloat(invoice.price) || 0)

  const statusLabel = STATUS_LABELS[invoice.status] || invoice.status

  return (
    <div
      className={`${styles.invoiceListItem} ${isLast ? styles.invoiceListItemLast : ''}`}
      onClick={onTap}
    >
      {/* Left: grey outer box with white inner box */}
      <div className={styles.invoiceListOuter}>
        <div className={styles.invoiceListInner}>
          <span className="mi" style={{ fontSize: '1.5rem', color: 'var(--text3)' }}>receipt_long</span>
        </div>
      </div>

      {/* Info */}
      <div className={styles.invoiceListInfo}>
        <div className={styles.invoiceListDesc}>{invoice.orderDesc || 'Order'}</div>
        <div className={styles.invoiceListSub}>Generated on {invoice.date}</div>
        <div className={styles.invoiceListStatusRow}>
          <span className="mi" style={{ fontSize: '0.85rem', color: 'var(--text3)', verticalAlign: 'middle' }}>autorenew</span>
          <span className={styles.invoiceListStatusText}>{statusLabel}</span>
        </div>
        <div className={styles.invoiceListAmount}>{fmt(currency, total)}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className={styles.empty}>
      <span className="mi" style={{ fontSize: '2.5rem', color: 'var(--text3)' }}>receipt_long</span>
      <p className={styles.emptyTitle}>No invoices yet</p>
      <p className={styles.emptySub}>
        Go to the Orders tab and tap{' '}
        <strong>Generate Invoice</strong> on any order.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main InvoiceTab
// ─────────────────────────────────────────────────────────────

export default function InvoiceTab({
  invoices = [],
  customer,
  onStatusChange,
  onDelete,
  showToast,
}) {
  const [viewingInvoice, setViewingInvoice] = useState(null)
  const [deleteTarget,   setDeleteTarget]   = useState(null)

  const currency = (() => {
    try {
      const s = JSON.parse(localStorage.getItem('tailorbook_settings') || '{}')
      return s.invoiceCurrency || '₦'
    } catch { return '₦' }
  })()

  const confirmDelete = () => {
    onDelete(deleteTarget)
    showToast('Invoice deleted')
    setDeleteTarget(null)
    if (viewingInvoice?.id === deleteTarget) setViewingInvoice(null)
  }

  const handleStatusChange = (id, newStatus) => {
    onStatusChange(id, newStatus)
    showToast(`Marked as ${newStatus}`)
    if (viewingInvoice?.id === id) {
      setViewingInvoice(prev => ({ ...prev, status: newStatus }))
    }
  }

  // Group invoices by date
  const grouped = invoices.reduce((acc, inv) => {
    const key = inv.date || 'Unknown Date'
    if (!acc[key]) acc[key] = []
    acc[key].push(inv)
    return acc
  }, {})

  if (invoices.length === 0) return <EmptyState />

  return (
    <>
      {Object.entries(grouped).map(([date, dateInvoices]) => (
        <div key={date} className={styles.invoiceGroup}>
          <div className={styles.invoiceGroupDate}>{date}</div>
          <div className={styles.invoiceGroupDivider} />

          {dateInvoices.map((inv, idx) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              currency={currency}
              isLast={idx === dateInvoices.length - 1}
              onTap={() => setViewingInvoice(inv)}
            />
          ))}
        </div>
      ))}

      {viewingInvoice && (
        <div className={styles.modalOverlay}>
          <Header 
            type="back"
            title="Invoice Details"
            onBackClick={() => setViewingInvoice(null)}
            customActions={[
              { icon: 'delete_outline', label: 'Delete', onClick: () => setDeleteTarget(viewingInvoice.id), color: 'var(--danger)' }
            ]}
          />
          <InvoiceView
            invoice={viewingInvoice}
            customer={customer}
            onClose={() => setViewingInvoice(null)}
            onStatusChange={handleStatusChange}
            onDelete={(id) => setDeleteTarget(id)}
            showToast={showToast}
          />
        </div>
      )}

      <ConfirmSheet
        open={!!deleteTarget}
        title="Delete this invoice?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
