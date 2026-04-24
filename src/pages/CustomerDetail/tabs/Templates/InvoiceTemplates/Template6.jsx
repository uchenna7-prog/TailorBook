import styles from "../styles/Template6.module.css"
import { getDueDate,calcTax,fmt } from "../../../utils/invoiceUtils"

export function InvoiceTemplate6({ invoice, customer, brand }) {
  const dueDate = getDueDate(invoice, brand.dueDays)
  const { currency, showTax, taxRate } = brand
  const subtotal = invoice.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (

    <div className={styles.template}>

      <div className={styles.t6Header}>
        <div className={styles.t6LogoArea}>
          <div className={styles.t6LogoCircle}>
            {brand.logo
              ? <img src={brand.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
              : <span className="mi" style={{ fontSize: 13, color: 'var(--brand-on-primary)' }}>checkroom</span>
            }
          </div>
          <div>
            <div className={styles.t6CompanyName}>{(brand.name || brand.ownerName || 'YOUR BRAND').toUpperCase()}</div>
            {brand.tagline && <div className={styles.t6CompanySub}>{brand.tagline.toUpperCase()}</div>}
          </div>
        </div>
        <div className={styles.t6HeaderRight}>
          {brand.address && <div>{brand.address}</div>}
        </div>
        <div className={styles.t6HeaderRight}>
          {brand.phone && <div>{brand.phone}</div>}
          {brand.email && <div>{brand.email}</div>}
          {brand.website && <div>{brand.website}</div>}
        </div>
      </div>
      <div className={styles.t6InvoiceRow}>
        <div className={styles.t6InvoiceLeft}>
          <span className={styles.t6InvoiceWord}>INVOICE </span>
          <span className={styles.t6InvoiceNum}>#{invoice.number}</span>
        </div>
        <div className={styles.t6InvoiceRight}>
          <div><span className={styles.t6Label}>DATE:</span> {invoice.date}</div>
          <div><span className={styles.t6Label}>DUE:</span> {dueDate}</div>
        </div>
      </div>
      <div className={styles.t6InfoRow}>
        {brand.accountBank && (
          <div>
            <div className={styles.t6InfoLabel}>PAYMENT:</div>
            <strong>{brand.accountBank}</strong><br />
            {brand.accountName && <span>{brand.accountName}<br /></span>}
            {brand.accountNumber && <span>Acct: {brand.accountNumber}</span>}
          </div>
        )}
        <div>
          <div className={styles.t6InfoLabel}>BILL FROM:</div>
          {brand.name || brand.ownerName}<br />
          {brand.address}
        </div>
        <div>
          <div className={styles.t6InfoLabel}>BILL TO:</div>
          {customer.name}<br />
          {customer.phone}<br />
          {customer.address}
        </div>
      </div>
      <div className={styles.t6TableHead}>
        <span style={{ flex: 3 }}>DESCRIPTION</span><span>PRICE</span><span>QTY</span><span>TOTAL</span>
      </div>
      {invoice.items?.map((item, i) => (
        <div key={i} className={styles.t6TableRow}>
          <span style={{ flex: 3 }}>{item.name}</span>
          <span>{fmt(currency, item.price)}</span>
          <span>1</span>
          <span>{fmt(currency, item.price)}</span>
        </div>
      ))}
      <div className={styles.t6TotalsArea}>
        <div className={styles.t6TotRow}><span>SUBTOTAL</span><span>{fmt(currency, subtotal)}</span></div>
        {showTax && taxRate > 0 && <div className={styles.t6TotRow}><span>TAX ({taxRate}%)</span><span>{fmt(currency, tax)}</span></div>}
        <div className={styles.t6TotTotal}><span>TOTAL</span><span>{fmt(currency, total)}</span></div>
      </div>
      <div className={styles.t6ThankYou}>{brand.footer || 'THANK YOU FOR YOUR BUSINESS'}</div>
    </div>
  )
}
