import styles from "../styles/Template10.module.css"
import { getDueDate,calcTax } from "../../../utils/invoiceUtils"

export function InvoiceTemplate10({ invoice, customer, brand }) {
  const dueDate     = getDueDate(invoice, brand.dueDays)
  const accentColor = brand.colour || '#ff5c8a'
  const { currency, showTax, taxRate } = brand
  const subtotal = invoice.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (
    <div className={styles.t10Wrap}>
      <div className={styles.t10HeaderZone}>
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 400 72"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 400,0 400,28 0,72" fill={accentColor} />
        </svg>
        <div style={{ position: 'absolute', top: 10, left: 18, zIndex: 1 }}>
          <span className={styles.t10BannerTitle}>INVOICE</span>
        </div>
        <div className={styles.t10BrandInBanner}>
          {brand.logo
            ? <img src={brand.logo} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />
            : <span className="mi" style={{ fontSize: 14, color: '#333' }}>checkroom</span>
          }
          <div>
            <div className={styles.t10BrandName}>{brand.name || brand.ownerName}</div>
            <div className={styles.t10BrandSub}>TAILOR SHOP</div>
          </div>
        </div>
      </div>
      <div className={styles.t10MetaRow}>
        <div>
          <div className={styles.t10MetaLabel}>Invoice to:</div>
          <div className={styles.t10MetaName}>{customer.name}</div>
          {customer.phone   && <div className={styles.t10MetaAddr}>{customer.phone}</div>}
          {customer.address && <div className={styles.t10MetaAddr}>{customer.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><span className={styles.t10MetaKey}>Invoice#</span> <strong>{invoice.number}</strong></div>
          <div><span className={styles.t10MetaKey}>Date</span> <strong>{invoice.date}</strong></div>
          <div><span className={styles.t10MetaKey}>Due</span> <strong>{dueDate}</strong></div>
        </div>
      </div>
      <div className={styles.t10TableHead}>
        <span>SL.</span>
        <span style={{ flex: 3 }}>Description</span>
        <span>Price</span><span>Qty</span><span>Total</span>
      </div>
      {invoice.items?.map((item, i) => (
        <div key={i} className={styles.t10TableRow}>
          <span>{i + 1}</span>
          <span style={{ flex: 3 }}>{item.name}</span>
          <span>{fmt(currency, item.price)}</span>
          <span>1</span>
          <span>{fmt(currency, item.price)}</span>
        </div>
      ))}
      <div className={styles.t10Divider} />
      <div className={styles.t10Bottom}>
        <div style={{ flex: 1 }}>
          <div className={styles.t10ThankYou}>{brand.footer || 'Thank you for your business'}</div>
          {brand.accountBank && (
            <>
              <div className={styles.t10PayLabel}>Payment Info:</div>
              <div className={styles.t10PayInfo}>
                {brand.accountNumber && <span>Account #: {brand.accountNumber}<br /></span>}
                {brand.accountName   && <span>A/C Name: {brand.accountName}<br /></span>}
                {brand.accountBank   && <span>Bank: {brand.accountBank}</span>}
              </div>
            </>
          )}
          {(brand.phone || brand.email) && (
            <>
              <div className={styles.t10TCLabel}>Contact</div>
              <div className={styles.t10TCText}>
                {brand.phone && <span>{brand.phone}<br /></span>}
                {brand.email && <span>{brand.email}</span>}
              </div>
            </>
          )}
        </div>
        <div className={styles.t10RightCol}>
          <div className={styles.t10TotalsWrap}>
            <div className={styles.t10TotRow}><span>Sub Total:</span><span>{fmt(currency, subtotal)}</span></div>
            {showTax && taxRate > 0 && <div className={styles.t10TotRow}><span>Tax ({taxRate}%):</span><span>{fmt(currency, tax)}</span></div>}
            <div className={styles.t10TotDivider} />
            <div className={styles.t10TotTotal}><span>Total:</span><span>{fmt(currency, total)}</span></div>
          </div>
          <div className={styles.t10SignBlock}>
            <div className={styles.t10SignLine} />
            <div className={styles.t10SignLabel}>Authorised Sign</div>
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
