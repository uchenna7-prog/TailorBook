import styles from "../styles/Template7.module.css"
import { calcTax,fmt } from "../utils/receiptUtils"
import { ReceiptPaymentSummary } from "../components/ReceiptPaymentSummary/ReceiptPaymentSummary"

export function ReceiptTemplate7({ receipt, customer, brand }) {
  const accentColor = brand.colour || '#0057D7'
  const { currency, showTax, taxRate } = brand
  const subtotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + ((item.qty ?? 1) * (parseFloat(item.price) || 0)), 0)
    : 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (
    <div className={styles.template}>

      <div className={styles.header}>

        <div className={styles.logoCircle} style={{ borderColor: accentColor }}>
          {brand.logo
            ? <img src={brand.logo} alt="" style={{ width: "45px", height: "45px", objectFit: 'contain', borderRadius: '50%' }} />
            : <span className="mi" style={{ fontSize: 13, color: accentColor }}>checkroom</span>
          }
        </div>

        <div className={styles.titleGroup}>
          <span className={styles.receiptWord}>receipt</span>
          <span className={styles.receiptNumber}>#{receipt.number}</span>
        </div>

        <div className={styles.dateBlock}>

          <div className={styles.dateLabel}>ISSUE DATE:</div>
          <div className={styles.dateValue} style={{ color: accentColor }}>{receipt.date}</div>

        </div>

      </div>

      <div className={styles.divider} />

      <div className={styles.fromTo}>

        <div className={styles.fromToBlock}>

          <div className={styles.fromLabel}>FROM:</div>
          <div className={styles.fromDivider} />
          {[
            ['NAME:', brand.ownerName || brand.name],
            ['COMPANY:', (brand.name || '').toUpperCase()],
            ['PHONE:', (brand.phone || '').toUpperCase()],
            ['EMAIL:', (brand.email || '')],
            ['ADDRESS:', (brand.address || '').toUpperCase()]
          ].filter(([,v]) => v).map(([l, v]) => (
            <div key={l} className={styles.infoRow}>
              <span className={styles.infoKey}>{l}</span>
              <span className={styles.infoValue}>{v}</span>
            </div>
          ))}
        </div>

        <div className={styles.fromToBlock}>
          <div className={styles.toLabel}>TO:</div>
          <div className={styles.fromDivider} />
          {[
            ['NAME:', (customer.name || '').toUpperCase()],
            ['PHONE:', (customer.phone || '').toUpperCase()],
            ['ADDRESS:', (customer.address || '').toUpperCase()],
          ].filter(([,v]) => v).map(([l, v]) => (
            <div key={l} className={styles.infoRow}>
              <span className={styles.infoKey}>{l}</span>
              <span className={styles.infoValue}>{v}</span>
            </div>
          ))}
        </div>

      </div>

      <div className={styles.divider} />

      <div className={styles.forLabel}>FOR:</div>

      <div className={styles.tableHeader}>

        <span className={styles.numColumn}>No.</span>
        <span style={{ flex: 3 }}>Item Description</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Unit Price</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Total</span>
        
      </div>

      <div className={styles.tableBody}>
        {receipt.items?.map((item, i) => {
        const qty = item.qty ?? 1;
        const unitPrice = parseFloat(item.price) || 0;
        const lineAmount = qty * unitPrice;

        return (
          <div key={i} className={styles.tableRow}>
            <span className={styles.numColumn}>{i + 1}</span>
            <span style={{ flex: 3 }}>{item.name}</span>
            <span style={{ flex: 1, textAlign: 'center' }}>{qty}</span>
            <span style={{ flex: 1, textAlign: 'center' }}>
              {fmt(currency, unitPrice)}
            </span>
            <span className={styles.price} style={{ color: accentColor }}>
              {fmt(currency, lineAmount)}
            </span>
          </div>
        );
      })}

        <ReceiptPaymentSummary receipt={receipt} brand={brand} />



      </div>
      
      <div className={styles.footer}>
        {brand.accountBank && (
        
        <div className={styles.footerLeft}>
          
           <div>
            <h3 className={styles.footerLabel}>Payment Details:</h3>

            {brand.name && (
              <div>Received By : {brand.name}</div>
            )}
            
          </div>

        </div>
      )}

      {brand.footer && (
        <div className={styles.footerRight}>
          <h3 style={{color:"var(--brand-primary-dark)"}}>Notes:</h3><br />{brand.footer}
        </div>
      )}

      </div>
     
    </div>
  )
}
