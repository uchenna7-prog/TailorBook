import { useBrand } from '../../../contexts/BrandContext'
import styles from './InvoiceView.module.css'

function fmt(currency, amount) {
  const n = parseFloat(amount) || 0
  return `${currency}${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function calcSubtotal(price, qty) {
  return (parseFloat(price) || 0) * (parseFloat(qty) || 1)
}

function calcTax(subtotal, taxRate, showTax) {
  if (!showTax || !taxRate) return 0
  return subtotal * (taxRate / 100)
}

function getDueDate(invoice, dueDays) {
  if (invoice.due) return invoice.due
  try {
    const d = new Date(invoice.date)
    d.setDate(d.getDate() + (dueDays || 7))
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '—' }
}

const STATUS_NEXT = { unpaid: 'paid', paid: 'unpaid', overdue: 'paid' }

// ─────────────────────────────────────────────────────────────
// (ALL YOUR TEMPLATE CODE — UNCHANGED)
// ─────────────────────────────────────────────────────────────

// ... everything you pasted above remains EXACTLY the same ...

// ─────────────────────────────────────────────────────────────
// InvoiceView — full-screen overlay
// ─────────────────────────────────────────────────────────────

export default function InvoiceView({
  invoice,
  customer,
  onClose,
  onStatusChange,
  onDelete
}) {
  const { brand } = useBrand()

  const templateKey = brand.template || 'editable'
  const Template    = TEMPLATE_MAP[templateKey] || EditableTemplate

  const handleShare = () => {
    const text =
      `*${brand.name || 'Invoice'}*\n` +
      `Invoice: ${invoice.number}\n` +
      `Date: ${invoice.date}\n` +
      `Amount: ${brand.currency}${invoice.price}\n` +
      `Status: ${invoice.status}\n\n` +
      (brand.footer || '')

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className={styles.overlay}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <button className={styles.topBtn} onClick={onClose}>
          <span className="mi">arrow_back</span>
        </button>
        <div className={styles.topCenter}>
          <div className={styles.topInvNum}>{invoice.number}</div>
          <div className={`${styles.statusBadge} ${styles[`status_${invoice.status}`]}`}>
            {invoice.status}
          </div>
        </div>
        <button className={styles.topBtn} onClick={handleShare}>
          <span className="mi">share</span>
        </button>
      </div>

      {/* ── Template area ── */}
      <div className={styles.scrollArea}>
        <div className={styles.paperWrap}>
          <Template invoice={invoice} customer={customer} brand={brand} />
        </div>

        {/* Linked measurements note */}
        {invoice.linkedNames?.length > 0 && (
          <div className={styles.linkedNote}>
            <span className="mi" style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>straighten</span>
            <span className={styles.linkedNoteText}>
              Measurements: {invoice.linkedNames.join(', ')}
            </span>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className={styles.notesBox}>
            <div className={styles.notesLabel}>Notes</div>
            <div className={styles.notesText}>{invoice.notes}</div>
          </div>
        )}

        {/* ── ACTIONS (ADDED) ── */}
        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() =>
              onStatusChange(invoice.id, STATUS_NEXT[invoice.status] || 'paid')
            }
          >
            <span className="mi">
              {invoice.status === 'paid' ? 'undo' : 'check_circle'}
            </span>
            {invoice.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
          </button>

          <button
            className={styles.dangerBtn}
            onClick={() => onDelete(invoice.id)}
          >
            <span className="mi">delete</span>
            Delete Invoice
          </button>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}