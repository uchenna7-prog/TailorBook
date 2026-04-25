import styles from "../styles/Template10.module.css"
import { getDueDate,calcTax,fmt } from "../../../utils/invoiceUtils"

export function InvoiceTemplate10({ invoice, customer, brand }) {
  const dueDate     = getDueDate(invoice, brand.dueDays)
  const accentColor = brand.colour || '#0057D7'
  const { currency, showTax, taxRate } = brand
  const subtotal = invoice.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (
    <div className={styles.Wrap}>
      <div className={styles.HeaderZone}>
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 400 72"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 400,0 400,28 0,72" fill={accentColor} />
        </svg>
        <div style={{ position: 'absolute', top: 10, left: 18, zIndex: 1 }}>
          <span className={styles.BannerTitle}>INVOICE</span>
        </div>
        <div className={styles.BrandInBanner}>
          {brand.logo
            ? <img src={brand.logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />
            : <span className="mi" style={{ fontSize: 14, color: '#333' }}>checkroom</span>
          }
          <div>
            <div className={styles.BrandName}>{brand.name || brand.ownerName}</div>
            <div className={styles.BrandSub}>TAILOR SHOP</div>
          </div>
        </div>
      </div>
      <div className={styles.MetaRow}>
        <div>
          <div className={styles.MetaLabel}>Invoice to:</div>
          <div className={styles.MetaName}>{customer.name}</div>
          {customer.phone   && <div className={styles.MetaAddr}>{customer.phone}</div>}
          {customer.address && <div className={styles.MetaAddr}>{customer.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><span className={styles.MetaKey}>Invoice#</span> <strong>{invoice.number}</strong></div>
          <div><span className={styles.MetaKey}>Date</span> <strong>{invoice.date}</strong></div>
          <div><span className={styles.MetaKey}>Due</span> <strong>{dueDate}</strong></div>
        </div>
      </div>
      <div className={styles.TableHead}>
        <span>SL.</span>
        <span style={{ flex: 3 }}>Description</span>
        <span>Price</span><span>Qty</span><span>Total</span>
      </div>
      {invoice.items?.map((item, i) => (
        <div key={i} className={styles.TableRow}>
          <span>{i + 1}</span>
          <span style={{ flex: 3 }}>{item.name}</span>
          <span>{fmt(currency, item.price)}</span>
          <span>1</span>
          <span>{fmt(currency, item.price)}</span>
        </div>
      ))}
      <div className={styles.Divider} />
      <div className={styles.Bottom}>
        <div style={{ flex: 1 }}>
          <div className={styles.ThankYou}>{brand.footer || 'Thank you for your business'}</div>
          {brand.accountBank && (
            <>
              <div className={styles.PayLabel}>Payment Info:</div>
              <div className={styles.PayInfo}>
                {brand.accountNumber && <span>Account #: {brand.accountNumber}<br /></span>}
                {brand.accountName   && <span>A/C Name: {brand.accountName}<br /></span>}
                {brand.accountBank   && <span>Bank: {brand.accountBank}</span>}
              </div>
            </>
          )}
          {(brand.phone || brand.email) && (
            <>
              <div className={styles.TCLabel}>Contact</div>
              <div className={styles.TCText}>
                {brand.phone && <span>{brand.phone}<br /></span>}
                {brand.email && <span>{brand.email}</span>}
              </div>
            </>
          )}
        </div>
        <div className={styles.RightCol}>
          <div className={styles.TotalsWrap}>
            <div className={styles.TotRow}><span>Sub Total:</span><span>{fmt(currency, subtotal)}</span></div>
            {showTax && taxRate > 0 && <div className={styles.TotRow}><span>Tax ({taxRate}%):</span><span>{fmt(currency, tax)}</span></div>}
            <div className={styles.TotDivider} />
            <div className={styles.TotTotal}><span>Total:</span><span>{fmt(currency, total)}</span></div>
          </div>
          <div className={styles.SignBlock}>
            <div className={styles.SignLine} />
            <div className={styles.SignLabel}>Authorised Sign</div>
          </div>
        </div>
      </div>
      <svg
        style={{ position: 'absolute', bottom: 0, right: 0, width: 68, height: 58 }}
        viewBox="0 0 68 58"
      >
        <polygon points="68,0 68,58 0,58" fill={accentColor} />
      </svg>
    </div>
  )
}
