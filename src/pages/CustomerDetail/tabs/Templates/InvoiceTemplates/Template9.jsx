import styles from "../styles/Template9.module.css"
import { getDueDate,calcTax } from "../../../utils/invoiceUtils"


export function InvoiceTemplate9({ invoice, customer, brand }) {
  const dueDate     = getDueDate(invoice, brand.dueDays)
  const accentColor = brand.colour || '#00b4c8'
  const { currency, showTax, taxRate } = brand
  const subtotal = invoice.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (
    <div className={styles.t9Wrap}>
      <div className={styles.t9Header}>
        <div>
          <div className={styles.t9LogoRow}>
            {brand.logo
              ? <img src={brand.logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />
              : <span className="mi" style={{ fontSize: 14, color: '#333' }}>checkroom</span>
            }
            <span className={styles.t9CompanyName}>{(brand.name || brand.ownerName || '').toUpperCase()}</span>
          </div>
          {brand.tagline && <div className={styles.t9CompanySub}>{brand.tagline.toUpperCase()}</div>}
          {brand.address && <div className={styles.t9CompanyAddr}>{brand.address}</div>}
        </div>
        <div className={styles.t9InvoiceTitle} style={{ color: accentColor }}>INVOICE</div>
      </div>
      <div className={styles.t9NumBar}>
        <span>INVOICE # {invoice.number}</span><span>|</span>
        <span>DATE: {invoice.date}</span><span>|</span>
        <span>DUE: {dueDate}</span>
      </div>
      <div className={styles.t9BillShip}>
        <div>
          <span className={styles.t9BillLabel}>Bill to:</span>
          <div><strong>{customer.name}</strong></div>
          {customer.phone   && <div>{customer.phone}</div>}
          {customer.address && <div>{customer.address}</div>}
        </div>
        <div>
          <span className={styles.t9BillLabel}>From:</span>
          <div><strong>{brand.name || brand.ownerName}</strong></div>
          {brand.phone && <div>{brand.phone}</div>}
          {brand.email && <div>{brand.email}</div>}
        </div>
      </div>
      <div className={styles.t9TableHead}>
        <span>QTY</span>
        <span style={{ flex: 3 }}>DESCRIPTION</span>
        <span>PRICE</span><span>TOTAL</span>
      </div>
      {invoice.items?.map((item, i) => (
        <div key={i} className={styles.t9TableRow}>
          <span>1</span>
          <span style={{ flex: 3 }}>{item.name}</span>
          <span>{fmt(currency, item.price)}</span>
          <span>{fmt(currency, item.price)}</span>
        </div>
      ))}
      <div className={styles.t9SubArea}>
        <div className={styles.t9SubRow}><span>Subtotal</span><span>{fmt(currency, subtotal)}</span></div>
        {showTax && taxRate > 0 && <div className={styles.t9SubRow}><span>Tax ({taxRate}%)</span><span>{fmt(currency, tax)}</span></div>}
      </div>
      <div className={styles.t9TotalBar}>
        <span>TOTAL</span><span>{fmt(currency, total)}</span>
      </div>
      <div className={styles.t9Footer}>
        <div>
          {brand.accountBank && (
            <>
              <div className={styles.t9ThankYou}>PAYMENT INFORMATION</div>
              <div className={styles.t9PayNote}>
                {brand.accountBank}{brand.accountName ? ` — ${brand.accountName}` : ''}
                {brand.accountNumber ? ` | Acct: ${brand.accountNumber}` : ''}
              </div>
            </>
          )}
          {!brand.accountBank && <div className={styles.t9ThankYou}>THANK YOU FOR YOUR BUSINESS</div>}
          <div className={styles.t9PayNote}>{brand.footer}</div>
        </div>
        <div className={styles.t9SignArea}>
          <div className={styles.t9SignLine} />
          <div className={styles.t9SignLabel}>Signature</div>
        </div>
      </div>
      <div className={styles.t9CornerDeco} />
    </div>
  )
}
