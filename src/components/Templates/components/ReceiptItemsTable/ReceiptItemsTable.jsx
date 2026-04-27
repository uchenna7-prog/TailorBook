import { calcTax } from "../../utils/receiptUtils"
import styles from "./ReceiptItemsTable.module.css"
import { fmt } from "../../utils/receiptUtils"
import { useBrandTokens } from "../../../../hooks/useBrandTokens"
import { useRef } from "react"

export function ItemsTable({ receipt, brand }) {

  const tableRef = useRef()

  useBrandTokens(brand.colourId, tableRef)

  const { currency, showTax, taxRate } = brand

  const subtotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + ((item.qty ?? 1) * (parseFloat(item.price) || 0)), 0)
    : 0

  const tax   = calcTax(subtotal, taxRate, showTax)
  const total = subtotal + tax

  return (
    <div className={styles.table} ref={tableRef}>

      <div className={styles.orderDescriptionRow}>
        <div className={styles.tColDesc}>{receipt.orderDesc || 'Garment Order'}</div>
        <div className={styles.tColNum}>{fmt(currency, subtotal)}</div>
      </div>

      <div className={styles.headerRow}>
        <span className={styles.description} style={{ flex: 3, textAlign: 'left' }}>Item Description</span>
        <span className={styles.unitPrice} style={{ flex: 1, textAlign: 'center' }}>Unit Price</span>
        <span className={styles.qty} style={{ flex: 1, textAlign: 'center' }}>Qty</span>
        <span className={styles.price} style={{ flex: 1, textAlign: 'center' }}>Amount</span>
      </div>

      {receipt.items?.length > 0 && (
        <div className={styles.orderItemsSection}>
          {receipt.items.map((item, idx) => {
            const qty        = item.qty ?? 1
            const unitPrice  = parseFloat(item.price) || 0
            const lineAmount = qty * unitPrice
            return (
              <div key={idx} className={styles.tRowSub}>
                <span className={styles.tColDesc} style={{ flex: 3, textAlign: 'left' }}>• {item.name}</span>
                <span className={styles.tColUnitPrice} style={{ flex: 1, textAlign: 'center' }}>{fmt(currency, unitPrice)}</span>
                <span className={styles.tColQty} style={{ flex: 1, textAlign: 'center' }}>{qty}</span>
                <span className={styles.tColNum} style={{ flex: 1, textAlign: 'center' }}>{fmt(currency, lineAmount)}</span>
              </div>
            )
          })}
        </div>
      )}


    </div>
  )
}