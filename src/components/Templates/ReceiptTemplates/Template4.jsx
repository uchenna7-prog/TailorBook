import styles from "../styles/Template4.module.css"
import { calcTax,fmt } from "../utils/receiptUtils"
import { ReceiptPaymentSummary } from "../components/ReceiptPaymentSummary/ReceiptPaymentSummary"

export function ReceiptTemplate4({ receipt, customer, brand }) {

  const barColor = brand.colour || '#0057D7'
  const { currency, showTax, taxRate } = brand
  const subtotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + ((item.qty ?? 1) * (parseFloat(item.price) || 0)), 0)
    : 0
  const tax = calcTax(subtotal, taxRate, showTax)
  const total = subtotal + tax

  return (

    <div className={styles.template}>
      
      <div className={styles.bar}/>

        <div className={styles.body}>

          <div className={styles.headerSplit}>
              
            <div className={styles.title}>receipt</div>

            <div style={{ textAlign: 'right', fontSize: 9 }}>
              <div>ISSUE DATE: <strong>{receipt.date}</strong></div>
              <div>receipt #: <strong>{receipt.number}</strong></div>
            </div>

          </div>
          <div className={styles.metaRow}>

            <div  className={styles.metaItem} >

              <div className={styles.metaLabel}>RECEIVED BY:</div>
              <div className={styles.metaVal}>{brand.name}</div>
              {brand.phone   && <div className={styles.metaSub}>{brand.phone}</div>}
              {brand.address && <div className={styles.metaSub}>{brand.address}</div>}
             

            </div>

            <div className={styles.metaItem}  style={{ textAlign: 'right' }}>

              <div className={styles.metaLabel}>RECEIVED FROM:</div>
              <div className={styles.metaVal}>{customer.name}</div>
              {customer.phone   && <div className={styles.metaSub}>{customer.phone}</div>}
              {customer.address && <div className={styles.metaSub}>{customer.address}</div>}

            </div>

          </div>

        <div className={styles.table}>

          <div className={styles.tableHeader} style={{ borderColor: barColor }}>

            <span style={{ flex: 3 }}>Item Description</span>
            <span>Unit Price</span>
            <span>QTY</span>
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


        </div>

        {brand.accountBank && (
          
          <div className={styles.footer}>
            <div className={styles.footerSection}>
              <strong style={{fontWeight:900,color:"var(--brand-primary-dark)"}}>Payment Details:</strong><br />

              <div>

                {brand.name && (
                    <div>Received By : {brand.name}</div>
                  )}
                
              </div>
              
            </div>
            {brand.footer && (
              <div className={styles.footerSection}>
                <strong style={{fontWeight:900,color:"var(--brand-primary-dark)"}}>Notes:</strong><br />{brand.footer}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  )
}
