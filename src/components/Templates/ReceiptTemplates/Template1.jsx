import styles from "../styles/Template1.module.css"


export function ReceiptTemplate1({ receipt, customer, brand }) {

  const lineColor = brand.colour || '#0057D7'

  return (
    <div className={styles.template}>

      <div className={styles.header}>

        <div className={styles.brandName}>{brand.name || 'Your Brand'}</div>
        {brand.tagline && <div className={styles.tagline}>{brand.tagline}</div>}
        {brand.address && <div className={styles.address}>{brand.address}</div>}

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
      <ReceiptPaymentSummary receipt={receipt} brand={brand} />
      <div className={styles.tplFooterPush} />
      {(brand.phone || brand.email || brand.footer) && (
        <div className={styles.Footer}>
          {(brand.phone || brand.email || brand.footer) && (
            <div className={styles.footSection}>
              <strong>Notes:</strong><br />
              {brand.phone   && <span>{brand.phone}<br /></span>}
              {brand.email   && <span>{brand.email}<br /></span>}
              {brand.footer  && <span>{brand.footer}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
