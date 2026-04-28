// src/pages/CustomerDetail/tabs/ReceiptTab/ReceiptTab.jsx

import { useState } from 'react'
import ReceiptViewer from '../../../../components/ReceiptViewer/ReceiptViewer'
import ConfirmSheet from '../../../../components/ConfirmSheet/ConfirmSheet'
import styles from './ReceiptTab.module.css'


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

// Groups an array of receipts by their date field
// Returns: { "Jan 1 2025": [receipt, receipt], ... }
function groupReceiptsByDate(receipts) {
  return receipts.reduce((groups, receipt) => {
    const date = receipt.date || 'Unknown Date'
    if (!groups[date]) groups[date] = []
    groups[date].push(receipt)
    return groups
  }, {})
}

// Builds a map of orderId -> order items, for looking up images per receipt
function buildOrderItemsMap(orders) {
  const map = {}
  for (const order of orders) {
    if (order.id && order.items?.length > 0) {
      map[order.id] = order.items
    }
  }
  return map
}

// Gets the payment status label and styles for a receipt
function getPaymentStatus(receipt) {
  const thisPayment   = (receipt.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
  const totalPaid     = receipt.cumulativePaid != null ? parseFloat(receipt.cumulativePaid) : thisPayment
  const orderTotal    = parseFloat(receipt.orderPrice) || totalPaid
  const isPaidInFull  = totalPaid >= orderTotal && orderTotal > 0

  return {
    thisPayment,
    isPaidInFull,
    label: isPaidInFull ? 'Paid in Full' : 'Part Payment',
    badgeStyle: isPaidInFull
      ? { background: 'rgba(34,197,94,0.12)',  color: '#15803d', borderColor: 'rgba(34,197,94,0.3)'  }
      : { background: 'rgba(251,146,60,0.12)', color: '#c2410c', borderColor: 'rgba(251,146,60,0.3)' },
  }
}


// ─────────────────────────────────────────────────────────────
// ORDER MOSAIC THUMBNAIL
// Shows 1, 2, or 3+ item images in a tiled thumbnail box
// ─────────────────────────────────────────────────────────────

function OrderMosaic({ orderItems, fallbackIcon, fallbackColor }) {
  const images     = (orderItems || []).map(item => item.imgSrc ?? null).filter(Boolean)
  const totalItems = (orderItems || []).length

  // No images — show a fallback icon
  if (images.length === 0) {
    return (
      <div className={styles.mosaicOuterBox}>
        <div className={styles.mosaicInnerBox}>
          <span className="mi" style={{ fontSize: '1.5rem', color: fallbackColor || 'var(--text3)' }}>
            {fallbackIcon || 'receipt'}
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
// RECEIPT CARD — one row in the list
// ─────────────────────────────────────────────────────────────

function ReceiptCard({ receipt, currency, onTap, isLast, orderItems }) {
  const { thisPayment, isPaidInFull, label, badgeStyle } = getPaymentStatus(receipt)

  return (
    <div
      className={`${styles.receiptRow} ${isLast ? styles.receiptRowLast : ''}`}
      onClick={onTap}
    >
      <OrderMosaic
        orderItems={orderItems}
        fallbackIcon="receipt"
        fallbackColor={isPaidInFull ? '#22c55e' : '#fb923c'}
      />

      {/* Centre: order name + generated date */}
      <div className={styles.receiptRowInfo}>
        <div className={styles.receiptRowTitle}>{receipt.orderDesc || 'Payment'}</div>
        <div className={styles.receiptRowDate}>Generated {receipt.date}</div>
      </div>

      {/* Right: payment status badge + amount */}
      <div className={styles.receiptRowRight}>
        <span className={styles.receiptStatusBadge} style={badgeStyle}>
          {label}
        </span>
        <div className={styles.receiptRowAmount}>
          {formatMoney(currency, thisPayment)}
        </div>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// EMPTY STATE — shown when no receipts exist
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <span className="mi" style={{ fontSize: '2.5rem', color: 'var(--text3)' }}>receipt</span>
      <p className={styles.emptyStateTitle}>No receipts yet</p>
      <p className={styles.emptyStateSubtitle}>
        Go to the Payments tab, open a payment, and tap{' '}
        <strong>Generate Receipt</strong>.
      </p>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// RECEIPT TAB — main export
// ─────────────────────────────────────────────────────────────

export default function ReceiptTab({
  receipts = [],
  orders   = [],
  customer,
  onDelete,
  showToast,
}) {
  const [viewingReceipt, setViewingReceipt] = useState(null)
  const [deleteTarget,   setDeleteTarget]   = useState(null)

  const currency      = getCurrency()
  const orderItemsMap = buildOrderItemsMap(orders)
  const groupedByDate = groupReceiptsByDate(receipts)

  function handleConfirmDelete() {
    onDelete(deleteTarget)
    showToast('Receipt deleted')
    setDeleteTarget(null)
    if (viewingReceipt?.id === deleteTarget) setViewingReceipt(null)
  }

  if (receipts.length === 0) return <EmptyState />

  return (
    <>
      {Object.entries(groupedByDate).map(([date, dateReceipts]) => (
        <div key={date} className={styles.dateGroup}>
          <div className={styles.dateGroupLabel}>{date}</div>
          <div className={styles.dateGroupDivider} />

          {dateReceipts.map((receipt, index) => (
            <ReceiptCard
              key={receipt.id}
              receipt={receipt}
              currency={currency}
              isLast={index === dateReceipts.length - 1}
              onTap={() => setViewingReceipt(receipt)}
              orderItems={orderItemsMap[receipt.orderId] ?? receipt.orderItems ?? []}
            />
          ))}
        </div>
      ))}

      {viewingReceipt && (
        <ReceiptViewer
          receipt={viewingReceipt}
          customer={customer}
          onClose={() => setViewingReceipt(null)}
          onDelete={(id) => setDeleteTarget(id)}
          showToast={showToast}
        />
      )}

      <ConfirmSheet
        open={!!deleteTarget}
        title="Delete this receipt?"
        message="This can't be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}