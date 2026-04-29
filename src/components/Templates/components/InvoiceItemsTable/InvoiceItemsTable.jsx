import { calcTax } from "../../utils/invoiceUtils"
import styles from "./InvoiceItemsTable.module.css"
import { fmt } from "../../utils/invoiceUtils"
import { useBrandTokens } from "../../../../hooks/useBrandTokens"
import { useRef } from "react"

export function ItemsTable({ invoice, brand }) {

  const tableRef = useRef()

  useBrandTokens(brand.colourId, tableRef)

  const { currency, showTax, taxRate } = brand

  const subtotal = invoice.items?.length > 0
    ? invoice.items.reduce((sum, item) => sum + ((item.qty ?? 1) * (parseFloat(item.price) || 0)), 0)
    : 0

  const tax   = calcTax(subtotal, taxRate, showTax)
  const total = subtotal + tax

  return (
    <div className={styles.table} ref={tableRef}>

      {/* Order name + total — sits above the column headers */}
      <div className={styles.orderDescriptionRow}>
        <div className={styles.orderDescLabel}>{invoice.orderDesc || 'Garment Order'}</div>
        <div className={styles.orderDescAmount}>{fmt(currency, subtotal)}</div>
      </div>

      {/* Column headers */}
      <div className={styles.headerRow}>
        <span className={styles.colItem}>Item</span>
        <span className={styles.colPrice}>Unit Price</span>
        <span className={styles.colQty}>Qty</span>
        <span className={styles.colAmount}>Amount</span>
      </div>

      {/* Line items */}
      {invoice.items?.length > 0 && (
        <div className={styles.itemsBody}>
          {invoice.items.map((item, idx) => {
            const qty        = item.qty ?? 1
            const unitPrice  = parseFloat(item.price) || 0
            const lineAmount = qty * unitPrice
            return (
              <div key={idx} className={styles.itemRow}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemUnitPrice}>{fmt(currency, unitPrice)}</span>
                <span className={styles.itemQty}>{qty}</span>
                <span className={styles.itemLineAmount}>{fmt(currency, lineAmount)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary block */}
      <div className={styles.summaryBlock}>

        <div className={styles.summaryRow}>
          <span className={styles.summaryKey}>Subtotal</span>
          <span className={styles.summaryVal}>{fmt(currency, subtotal)}</span>
        </div>

        {showTax && taxRate > 0 && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Tax ({taxRate}%)</span>
            <span className={styles.summaryVal}>{fmt(currency, tax)}</span>
          </div>
        )}

        <div className={styles.summaryDivider} />

        <div className={styles.summaryTotalRow}>
          <span className={styles.summaryTotalKey}>Total Due</span>
          <span className={styles.summaryTotalVal}>{fmt(currency, total)}</span>
        </div>

      </div>

    </div>
  )
}