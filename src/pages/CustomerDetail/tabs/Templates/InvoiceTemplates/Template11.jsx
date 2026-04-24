import styles from "../styles/Template11.module.css"
import { getDueDate,calcTax } from "../../../utils/invoiceUtils"

export function InvoiceTemplate11({ invoice, customer, brand }) {
  const dueDate     = getDueDate(invoice, brand.dueDays)
  const accentColor = brand.colour || '#5da0d0'
  const barBg       = '#dbeeff'
  const { currency, showTax, taxRate } = brand
  const subtotal = invoice.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (
    <div className={styles.t11Wrap}>
      <div className={styles.t11TopBar}>
        <div className={styles.t11LogoArea}>
          <div className={styles.t11LogoHex}>
            {brand.logo
              ? <img src={brand.logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 2 }} />
              : <span className="mi" style={{ fontSize: 11, color: '#fff' }}>checkroom</span>
            }
          </div>
          <div>
            <div className={styles.t11CompanyName}>{(brand.name || brand.ownerName || '').toUpperCase()}</div>
            {brand.tagline && <div className={styles.t11CompanySub}>{brand.tagline}</div>}
          </div>
        </div>
        {brand.address && <div className={styles.t11CompanyInfo}>{brand.address}</div>}
        <div className={styles.t11CompanyInfo} style={{ textAlign: 'right' }}>
          {brand.website && <div>{brand.website}</div>}
          {brand.email   && <div>{brand.email}</div>}
          {brand.phone   && <div>{brand.phone}</div>}
        </div>
      </div>
      <div className={styles.t11InvoiceTitle}>Invoice</div>
      <div className={styles.t11BlueBar} style={{ background: barBg, color: accentColor }}>
        <span>INVOICE: #{invoice.number}</span>
        <span>DATE ISSUED: {invoice.date}</span>
        <span>DUE DATE: {dueDate}</span>
      </div>
      <div className={styles.t11IssuedRow}>
        <div>
          <div className={styles.t11IssuedLabel}>ISSUED TO</div>
          <div>{customer.name}</div>
          {customer.phone   && <div>{customer.phone}</div>}
          {customer.address && <div>{customer.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.t11AmountLabel} style={{ color: accentColor }}>AMOUNT</div>
          <div className={styles.t11AmountVal} style={{ color: accentColor }}>{fmt(currency, total)}</div>
        </div>
      </div>
      {invoice.orderDesc && <div className={styles.t11ProjectName}>{invoice.orderDesc}</div>}
      <div className={styles.t11TableHead}>
        <span style={{ flex: 3 }}>Description</span>
        <span>Qty</span><span>Price</span><span>Subtotal</span>
      </div>
      {invoice.items?.map((item, i) => (
        <div key={i} className={styles.t11TableRow}>
          <span style={{ flex: 3 }}>• {item.name}</span>
          <span>1</span>
          <span>{fmt(currency, item.price)}</span>
          <span>{fmt(currency, item.price)}</span>
        </div>
      ))}
      <div className={styles.t11TotArea}>
        <div className={styles.t11TotRow}><span>Subtotal</span><span>{fmt(currency, subtotal)}</span></div>
        {showTax && taxRate > 0 && (
          <div className={styles.t11TotRow}><span>Tax ({taxRate}%)</span><span>{fmt(currency, tax)}</span></div>
        )}
        <div className={styles.t11TotBold}><span>TOTAL</span><span>{fmt(currency, total)}</span></div>
      </div>
      {(brand.accountBank || brand.phone) && (
        <>
          <div className={styles.t11PayTitle}>Payment Information</div>
          <div className={styles.t11PayBoxRow}>
            {brand.accountBank && (
              <div className={styles.t11PayBox} style={{ background: barBg }}>
                <div className={styles.t11PayBoxTitle}>Bank Transfer</div>
                <div>
                  {brand.accountBank}<br />
                  {brand.accountName && <span>{brand.accountName}<br /></span>}
                  {brand.accountNumber && <span>Acct: {brand.accountNumber}</span>}
                </div>
              </div>
            )}
            {brand.phone && (
              <div className={styles.t11PayBox} style={{ background: barBg }}>
                <div className={styles.t11PayBoxTitle}>Contact</div>
                <div>
                  {brand.phone}<br />
                  {brand.email && <span>{brand.email}</span>}
                </div>
              </div>
            )}
            {brand.address && (
              <div className={styles.t11PayBox} style={{ background: barBg }}>
                <div className={styles.t11PayBoxTitle}>Visit Us</div>
                <div>{brand.address}</div>
              </div>
            )}
          </div>
        </>
      )}
      <div className={styles.t11ThankYou} style={{ color: accentColor }}>{brand.footer || 'THANK YOU!'}</div>
    </div>
  )
}
