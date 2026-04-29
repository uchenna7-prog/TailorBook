import styles from "../styles/Template5.module.css"
import { calcTax,fmt } from "../utils/receiptUtils"
import { ReceiptPaymentSummary } from "../components/ReceiptPaymentSummary/ReceiptPaymentSummary"

export function ReceiptTemplate5({ receipt, customer, brand }) {


  const { currency, showTax, taxRate } = brand
  const subtotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + ((item.qty ?? 1) * (parseFloat(item.price) || 0)), 0)
    : 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (

    <div className={styles.template}>

      <div className={styles.top}>

        <div className={styles.title}>receipt</div>

        <div className={styles.topRight}>
          <div>{receipt.date}</div>
          <div><strong>receipt No: {receipt.number}</strong></div>
        </div>

      </div>

      <div className={styles.divider} />

      <div className={styles.billedTo}>

        <div className={styles.billedLabel}>Received From:</div>
        <div><strong>{customer.name}</strong></div>
        {customer.phone   && <div>{customer.phone}</div>}
        {customer.address && <div>{customer.address}</div>}

      </div>

      <div className={styles.divider} />

      <div className={styles.tableHead}>

        <span style={{ flex: 3 }}>Item Description</span>
        <span>Unit Price</span>
        <span>Qty</span>
        <span>Total</span>

      </div>

      {receipt.items?.map((item, i) => {
        const qty = item.qty ?? 1;
        const unitPrice = parseFloat(item.price) || 0;
        const lineAmount = qty * unitPrice;

        return (
          <div key={i} className={styles.tableRow}>
            <span style={{ flex: 3 }}>{item.name}</span>
            <span>{fmt(currency, unitPrice)}</span>
            <span>{qty}</span>
            <span>{fmt(currency, lineAmount)}</span>
          </div>
        );
      })}

      <ReceiptPaymentSummary receipt={receipt} brand={brand} />

    
      <div className={styles.footer}>
       
        {brand.accountBank ? (
          
          <div className={styles.footerItem}>
            
            <div className={styles.footerLabel}>Payment Details</div>
            <div>{brand.name || brand.ownerName}</div>
            
              {brand.name && (
                <div>Received By : {brand.name}</div>
              )}

          </div>
        ) : <div />}
        <div className={styles.footerItem} style={{ textAlign: 'right' }}>
          <div><strong>{brand.name || brand.ownerName}</strong></div>
          {brand.phone   && <div>{brand.phone}</div>}
          {brand.email   && <div>{brand.email}</div>}
          {brand.address && <div>{brand.address}</div>}
        </div>
      </div>
    </div>
  )
}
