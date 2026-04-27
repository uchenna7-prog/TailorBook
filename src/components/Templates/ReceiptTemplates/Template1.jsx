import styles from "../styles/Template1.module.css"
import { ReceiptPaymentSummary } from "../components/ReceiptPaymentSummary/ReceiptPaymentSummary"
import { ItemsTable } from "../components/ReceiptItemsTable/ReceiptItemsTable"


export function ReceiptTemplate1({ receipt, customer, brand }) {

  const lineColor = brand.colour || '#0057D7'

  return (
    <div className={styles.template}>

      <div className={styles.header}>

        <div className={styles.brandName}>{brand.name || 'Your Brand'}</div>
        {brand.tagline && <div className={styles.tagline}>{brand.tagline}</div>}

        <div className={styles.titleRow}>

          <div className={styles.titleLine} style={{ background: lineColor }} />
          <div className={styles.title}>RECEIPT</div>
          <div className={styles.titleLine} style={{ background: lineColor }} />

        </div>

      </div>

      <div className={styles.metaRow}>
        <div>

          <div className={styles.metaLabel}>RECEIVED FROM</div>
          <div className={styles.metaValue}>{customer.name}</div>
          {customer.phone && <div className={styles.metaSub}>{customer.phone}</div>}

        </div>

        <div style={{ textAlign: 'right' }}>

          <div className={styles.metaKey}>RECEIPT #</div>
          <div className={styles.metaValue}>{receipt.number}</div>
          <div className={styles.metaSub}>{receipt.date}</div>

        </div>
      </div>
      <ItemsTable receipt={receipt} brand={brand} />
      
      <ReceiptPaymentSummary receipt={receipt} brand={brand} />

      {(brand.phone || brand.email || brand.footer) && (

        <div className={styles.footRight}>

          <strong style={{fontWeight:900,color:"var(--brand-primary-dark)"}}>Notes:</strong><br />
          {brand.phone   && <span>{brand.phone}<br /></span>}
          {brand.email   && <span>{brand.email}<br /></span>}
          {brand.footer  && <span>{brand.footer}</span>}

        </div>

      )}
    </div>
  )
}
