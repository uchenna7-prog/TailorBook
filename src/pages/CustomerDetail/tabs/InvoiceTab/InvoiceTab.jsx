// src/pages/CustomerDetail/tabs/InvoiceTab/InvoiceTab.jsx

import { useState } from 'react'
import InvoiceViewer from '../../../../components/InvoiceViewer/InvoiceViewer'
import ConfirmSheet from '../../../../components/ConfirmSheet/ConfirmSheet'
import Header from '../../../../components/Header/Header'
import styles from './InvoiceTab.module.css'


// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  unpaid:    'Unpaid',
  part_paid: 'Part Payment',
  paid:      'Full Payment',
  overdue:   'Overdue',
}

const STATUS_STYLES = {
  paid:      { background: 'rgba(34,197,94,0.12)',  color: '#15803d', borderColor: 'rgba(34,197,94,0.3)'  },
  part_paid: { background: 'rgba(251,146,60,0.12)', color: '#c2410c', borderColor: 'rgba(251,146,60,0.3)' },
  unpaid:    { background: 'rgba(234,179,8,0.12)',  color: '#a16207', borderColor: 'rgba(234,179,8,0.3)'  },
  overdue:   { background: 'rgba(239,68,68,0.12)',  color: '#dc2626', borderColor: 'rgba(239,68,68,0.3)'  },
}


// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function formatMoney(currency = '₦', amount) {
  const number = parseFloat(amount) || 0
  return `${currency}${number.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
}

function getCurrency() {
  try {
    const settings = JSON.parse(localStorage.getItem('tailorbook_settings') || '{}')
    return settings.invoiceCurrency || '₦'
  } catch {
    return '₦'
  }
}

// Groups an array of invoices by their date field
// Returns: { "Jan 1 2025": [invoice, invoice], ... }
function groupInvoicesByDate(invoices) {
  return invoices.reduce((groups, invoice) => {
    const date = invoice.date || 'Unknown Date'
    if (!groups[date]) groups[date] = []
    groups[date].push(invoice)
    return groups
  }, {})
}

// Builds a map of orderId -> order items, for looking up images per invoice
function buildOrderItemsMap(orders) {
  const map = {}
  for (const order of orders) {
    if (order.id && order.items?.length > 0) {
      map[order.id] = order.items
    }
  }
  return map
}

// Calculates the total price for an invoice
function getInvoiceTotal(invoice) {
  if (invoice.items?.length > 0) {
    return invoice.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
  }
  return parseFloat(invoice.price) || 0
}


// ─────────────────────────────────────────────────────────────
// ORDER MOSAIC THUMBNAIL
// Shows 1, 2, or 3+ item images in a tiled thumbnail box
// ─────────────────────────────────────────────────────────────

function OrderMosaic({ orderItems, fallbackIcon }) {
  const images     = (orderItems || []).map(item => item.imgSrc ?? null).filter(Boolean)
  const totalItems = (orderItems || []).length

  // No images — show a fallback icon
  if (images.length === 0) {
    return (
      <div className={styles.mosaicOuterBox}>
        <div className={styles.mosaicInnerBox}>
          <span className="mi" style={{ fontSize: '1.5rem', color: 'var(--text3)' }}>
            {fallbackIcon || 'receipt_long'}
          </span>
        </div>
      </div>
    )
  }

  // Single image — full bleed
  if (totalItems === 1) {
    return (
      <div className={styles.mosaicOuterBox}>
        <div className={styles.mosaicInnerBox}>
          <img src={images[0]} alt="" className={styles.mosaicFullImage} />
        </div>
      </div>
    )
  }

  // Two items — left/right split
  if (totalItems === 2) {
    return (
      <div className={styles.mosaicOuterBox}>
        <div className={`${styles.mosaicInnerBox} ${styles.mosaicTiled}`}>
          <div className={styles.mosaicTileLeft}>
            <img src={images[0]} alt="" className={styles.mosaicTileImage} />
          </div>
          <div className={styles.mosaicDividerVertical} />
          <div className={styles.mosaicTileRight}>
            <div className={styles.mosaicTileCell}>
              {images[1]
                ? <img src={images[1]} alt="" className={styles.mosaicTileImage} />
                : <span className="mi" style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>checkroom</span>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Three or more — left + two stacked on right
  const extraCount = totalItems > 3 ? totalItems - 3 : 0

  return (
    <div className={styles.mosaicOuterBox}>
      <div className={`${styles.mosaicInnerBox} ${styles.mosaicTiled}`}>

        <div className={styles.mosaicTileLeft}>
          {images[0]
            ? <img src={images[0]} alt="" className={styles.mosaicTileImage} />
            : <span className="mi" style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>checkroom</span>
          }
        </div>

        <div className={styles.mosaicDividerVertical} />

        <div className={styles.mosaicTileRight}>

          <div className={styles.mosaicTileCell}>
            {images[1]
              ? <img src={images[1]} alt="" className={styles.mosaicTileImage} />
              : <span className="mi" style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>checkroom</span>
            }
          </div>

          <div className={styles.mosaicDividerHorizontal} />

          <div className={`${styles.mosaicTileCell} ${extraCount > 0 ? styles.mosaicTileCellWithOverlay : ''}`}>
            {images[2]
              ? <img src={images[2]} alt="" className={styles.mosaicTileImage} />
              : <span className="mi" style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>checkroom</span>
            }
            {extraCount > 0 && (
              <div className={styles.mosaicExtraOverlay}>+{extraCount}</div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// INVOICE CARD — one row in the list
// ─────────────────────────────────────────────────────────────

function InvoiceCard({ invoice, currency, onTap, isLast, orderItems }) {
  const total      = getInvoiceTotal(invoice)
  const statusKey  = invoice.status || 'unpaid'
  const badgeLabel = STATUS_LABELS[statusKey] || invoice.status
  const badgeStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.unpaid
  const pieceCount = invoice.items?.length > 0 ? invoice.items.length : (invoice.qty || null)

  return (
    <div
      className={`${styles.invoiceRow} ${isLast ? styles.invoiceRowLast : ''}`}
      onClick={onTap}
    >
      {/* Left: mosaic thumbnail */}
      <OrderMosaic orderItems={orderItems} fallbackIcon="receipt_long" />

      {/* Centre: order name + date + piece count */}
      <div className={styles.invoiceRowInfo}>
        <div className={styles.invoiceRowTitle}>{invoice.orderDesc || 'Order'}</div>
        <div className={styles.invoiceRowDate}>Generated {invoice.date}</div>
        {pieceCount && (
          <div className={styles.invoiceRowPieceCount}>
            {pieceCount} {pieceCount === 1 ? 'piece' : 'pieces'}
          </div>
        )}
      </div>

      {/* Right: status badge + total amount */}
      <div className={styles.invoiceRowRight}>
        <span className={styles.invoiceStatusBadge} style={badgeStyle}>
          {badgeLabel}
        </span>
        <div className={styles.invoiceRowAmount}>
          {formatMoney(currency, total)}
        </div>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// EMPTY STATE — shown when no invoices exist
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <span className="mi" style={{ fontSize: '2.5rem', color: 'var(--text3)' }}>receipt_long</span>
      <p className={styles.emptyStateTitle}>No invoices yet</p>
      <p className={styles.emptyStateSubtitle}>
        Go to the Orders tab and tap{' '}
        <strong>Generate Invoice</strong> on any order.
      </p>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// INVOICE TAB — main export
// ─────────────────────────────────────────────────────────────

export default function InvoiceTab({
  invoices = [],
  orders   = [],
  customer,
  onStatusChange,
  onDelete,
  showToast,
}) {
  const [viewingInvoice, setViewingInvoice] = useState(null)
  const [deleteTarget,   setDeleteTarget]   = useState(null)

  const currency      = getCurrency()
  const orderItemsMap = buildOrderItemsMap(orders)
  const groupedByDate = groupInvoicesByDate(invoices)

  function handleConfirmDelete() {
    onDelete(deleteTarget)
    showToast('Invoice deleted')
    setDeleteTarget(null)
    if (viewingInvoice?.id === deleteTarget) setViewingInvoice(null)
  }

  function handleStatusChange(id, newStatus) {
    onStatusChange(id, newStatus)
    showToast(`Marked as ${STATUS_LABELS[newStatus] || newStatus}`)
    if (viewingInvoice?.id === id) {
      setViewingInvoice(prev => ({ ...prev, status: newStatus }))
    }
  }

  if (invoices.length === 0) return <EmptyState />

  return (
    <>
      {Object.entries(groupedByDate).map(([date, dateInvoices]) => (
        <div key={date} className={styles.dateGroup}>
          <div className={styles.dateGroupLabel}>{date}</div>
          <div className={styles.dateGroupDivider} />

          {dateInvoices.map((invoice, index) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              currency={currency}
              isLast={index === dateInvoices.length - 1}
              onTap={() => setViewingInvoice(invoice)}
              orderItems={orderItemsMap[invoice.orderId] ?? []}
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
              {
                icon:    'delete_outline',
                label:   'Delete',
                onClick: () => setDeleteTarget(viewingInvoice.id),
                color:   'var(--danger)',
              },
            ]}
          />
          <InvoiceViewer
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
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}