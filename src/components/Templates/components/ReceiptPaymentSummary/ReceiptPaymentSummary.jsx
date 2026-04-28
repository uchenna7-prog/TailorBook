import { calcTax } from '../../utils/invoiceUtils'
import { resolveCumulativePaid, buildPaymentRows } from '../../../ReceiptViewer/utils'
import { fmt } from '../../utils/receiptUtils'

import styles from './ReceiptPaymentSummary.module.css'


export function ReceiptPaymentSummary({ receipt, brand }) {
  const { currency, showTax, taxRate } = brand

  // ── Totals ────────────────────────────────────────────────────────────────
  // These values are pre-computed and frozen at receipt generation time
  // inside handleGenerateReceipt. We read them directly from the receipt
  // instead of recalculating, because recalculating only sees receipt.payments
  // (current installments) and misses previousInstallments entirely.
  const orderTotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    : (parseFloat(receipt.orderPrice) || 0)

  const tax              = calcTax(orderTotal, taxRate, showTax)
  const thisPaymentTotal = (receipt.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
  const balanceRemaining = parseFloat(receipt.balance) >= 0
    ? parseFloat(receipt.balance)
    : Math.max(0, orderTotal - resolveCumulativePaid(receipt))
  const isFullyPaid      = receipt.isFullPayment ?? (balanceRemaining <= 0)

  // ── Build payment rows (previous installments + current payments) ─────────
  const paymentRows = buildPaymentRows(receipt)


  return (
    <div className={styles.container}>

      {/* ── Payment History Table (only shown when there are rows) ──── */}
      {paymentRows.length > 0 && (
        <div className={styles.historySection}>

          <div className={styles.sectionLabel}>Payment History</div>

          {/* Table header */}
          <div className={styles.tableHeader}>
            <span className={styles.colSerial}>S/N</span>
            <span className={styles.colDate}>Payment Date</span>
            <span className={styles.colAmount}>Amount</span>
          </div>

          {/* Payment rows */}
          {paymentRows.map((payment, index) => (
            <div key={payment.id ?? index} className={styles.tableRow}>

              <span className={`${styles.colSerial} ${payment._isCurrent ? styles.currentText : styles.previousText}`}>
                {payment._sn}
              </span>

              <span className={`${styles.colDate} ${payment._isCurrent ? styles.currentText : styles.previousText}`}>
                {payment.date}
                {payment.method && (
                  <span className={payment._isCurrent ? styles.methodCurrent : styles.methodPrevious}>
                    {' · '}{payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                  </span>
                )}
              </span>

              <span className={`${styles.colAmount} ${payment._isCurrent ? styles.amountCurrent : styles.previousText}`}>
                {fmt(currency, payment.amount)}
              </span>

            </div>
          ))}

        </div>
      )}

      {/* ── Totals Summary ───────────────────────────────────────────── */}
      <div className={styles.totalsSection}>

        {showTax && taxRate > 0 && (
          <div className={styles.totalsRow}>
            <span>Tax ({taxRate}%)</span>
            <span>{fmt(currency, tax)}</span>
          </div>
        )}

        {paymentRows.length > 0 && (
          <div className={styles.totalsRow}>
            <span>Total Paid</span>
            <span className={styles.amountPaid}>{fmt(currency, thisPaymentTotal)}</span>
          </div>
        )}

        {!isFullyPaid && (
          <div className={`${styles.totalsRow} ${styles.balanceRow}`}>
            <span>Balance Remaining</span>
            <span className={styles.amountBalance}>{fmt(currency, balanceRemaining)}</span>
          </div>
        )}

        <div className={styles.totalsFinalRow}>
          <span>{isFullyPaid ? 'PAID IN FULL' : 'AMOUNT RECEIVED'}</span>
          <div className={styles.finalAmountGroup}>
            {isFullyPaid && <span className={styles.paidBadge}>✓</span>}
            <span className={isFullyPaid ? styles.amountPaid : ''}>
              {fmt(currency, thisPaymentTotal)}
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}