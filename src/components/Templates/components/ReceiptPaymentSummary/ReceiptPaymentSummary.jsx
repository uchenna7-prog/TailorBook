import styles from "./ReceiptPaymentSummary.module.css"
import { calcTax } from "../../utils/invoiceUtils"
import { resolveCumulativePaid, buildPaymentRows } from "../../../ReceiptViewer/utils"
import { fmt } from "../../utils/receiptUtils"


export function ReceiptPaymentSummary({ receipt, brand }) {
  const { currency, showTax, taxRate } = brand

  const orderTotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    : (parseFloat(receipt.orderPrice) || 0)

  const tax            = calcTax(orderTotal, taxRate, showTax)
  const cumulativePaid = resolveCumulativePaid(receipt)
  const previousPaid   = parseFloat(receipt.previousPaid) || 0

  const thisPaymentTotal = (receipt.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
  const balanceRemaining = Math.max(0, orderTotal - cumulativePaid)
  const isFullPayment    = balanceRemaining <= 0

  const paymentRows = buildPaymentRows(receipt)

  return (
    <div className={styles.tableWrapper}>

      {/* Payment History */}
      {paymentRows.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, color: '#444', borderTop: '1px solid #eee', paddingTop: 10 }}>
            Payment History
          </div>
          <div className={styles.tHead}>
            <span style={{ flex: 1, textAlign: 'left' }}>S/N</span>
            <span className={styles.tColDesc} style={{ flex: 5, textAlign: 'left' }}>Payment Date</span>
            <span className={styles.tColNum} style={{ flex: 1, textAlign: 'center' }}>Amount</span>
          </div>
          {paymentRows.map((p, idx) => (
            <div key={p.id ?? idx} className={styles.tRowSub}>
              <span style={{ flex: 1, textAlign: 'left' }}>{p._sn}</span>
              <span className={styles.tColDesc} style={{ flex: 5, textAlign: 'left' }}>
                {p.date}{p.method ? (
                  <span style={{ flex: 1, textAlign: 'left' }}> · {p.method.charAt(0).toUpperCase() + p.method.slice(1)}</span>
                ) : null}
              </span>
              <span className={styles.tColNum} style={{ color: p._isCurrent ? '#16a34a' : '#6b7280', fontWeight: p._isCurrent ? 700 : 400 }}>{fmt(currency, p.amount)}</span>
            </div>
          ))}
          <div className={styles.summary} style={{ width: '100%', marginLeft: 0, marginTop: 10 }}>
            {showTax && taxRate > 0 && (
              <div className={styles.sumRow}><span>Tax ({taxRate}%)</span><span>{fmt(currency, tax)}</span></div>
            )}
            <div className={styles.sumRow}><span>Total Paid</span><span style={{ color: '#16a34a', fontWeight: 700 }}>{fmt(currency, thisPaymentTotal)}</span></div>
            {!isFullPayment && (
              <div className={styles.sumRow}><span>Balance Remaining</span><span style={{ color: '#ef4444', fontWeight: 700 }}>{fmt(currency, balanceRemaining)}</span></div>
            )}
            <div className={`${styles.sumRow} ${styles.sumTotal}`}>
              <span>{isFullPayment ? 'PAID IN FULL' : 'AMOUNT RECEIVED'}</span>
              <span style={{ color: isFullPayment ? '#16a34a' : '#1a1a1a' }}>{fmt(currency, thisPaymentTotal)}</span>
            </div>
          </div>
        </div>
      )}
      {paymentRows.length === 0 && (
        <div className={styles.summary} style={{ width: '100%', marginLeft: 0, marginTop: 10 }}>
          {showTax && taxRate > 0 && (
            <div className={styles.sumRow}><span>Tax ({taxRate}%)</span><span>{fmt(currency, tax)}</span></div>
          )}
          {!isFullPayment && (
            <div className={styles.sumRow}><span>Balance Remaining</span><span style={{ color: '#ef4444', fontWeight: 700 }}>{fmt(currency, balanceRemaining)}</span></div>
          )}
          <div className={`${styles.sumRow} ${styles.sumTotal}`}>
            <span>{isFullPayment ? 'PAID IN FULL' : 'AMOUNT RECEIVED'}</span>
            <span style={{ color: isFullPayment ? '#16a34a' : '#1a1a1a' }}>{fmt(currency, thisPaymentTotal)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
