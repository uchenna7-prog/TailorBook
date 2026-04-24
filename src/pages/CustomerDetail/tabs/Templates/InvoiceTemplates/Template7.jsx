import styles from "../styles/Template7.module.css"
import { getDueDate,calcTax } from "../../../utils/invoiceUtils"


export function InvoiceTemplate7({ invoice, customer, brand }) {
  const dueDate = getDueDate(invoice, brand.dueDays)
  const accentColor = brand.colour || '#cc0000'
  const { currency, showTax, taxRate } = brand
  const subtotal = invoice.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const tax      = calcTax(subtotal, taxRate, showTax)
  const total    = subtotal + tax

  return (
    <div className={styles.t7Wrap}>
      <div className={styles.t7Header}>
        <div className={styles.t7LogoCircle} style={{ borderColor: accentColor }}>
          {brand.logo
            ? <img src={brand.logo} alt="" style={{ width: 16, height: 16, objectFit: 'contain', borderRadius: '50%' }} />
            : <span className="mi" style={{ fontSize: 13, color: accentColor }}>checkroom</span>
          }
        </div>
        <div className={styles.t7TitleGroup}>
          <span className={styles.t7InvoiceWord}>INVOICE</span>
          <span className={styles.t7InvoiceNum}>#{invoice.number}</span>
        </div>
        <div className={styles.t7DateBlock}>
          <div className={styles.t7DateLabel}>DATE:</div>
          <div className={styles.t7DateVal} style={{ color: accentColor }}>{invoice.date}</div>
          <div className={styles.t7DateLabel} style={{ marginTop: 2 }}>DUE:</div>
          <div className={styles.t7DateVal} style={{ color: accentColor }}>{dueDate}</div>
        </div>
      </div>
      <div className={styles.t7Divider} />
      <div className={styles.t7FromTo}>
        <div className={styles.t7FromToBlock}>
          <div className={styles.t7FromLabel}>FROM:</div>
          <div className={styles.t7FromDivider} />
          {[
            ['NAME:', brand.ownerName || brand.name],
            ['COMPANY:', (brand.name || '').toUpperCase()],
            ['ADDRESS:', (brand.address || '').toUpperCase()],
            ['PHONE:', (brand.phone || '').toUpperCase()],
            ['EMAIL:', (brand.email || '').toUpperCase()],
          ].filter(([,v]) => v).map(([l, v]) => (
            <div key={l} className={styles.t7InfoRow}>
              <span className={styles.t7InfoKey}>{l}</span>
              <span className={styles.t7InfoVal}>{v}</span>
            </div>
          ))}
        </div>
        <div className={styles.t7FromToBlock}>
          <div className={styles.t7ToLabel}>TO:</div>
          <div className={styles.t7FromDivider} />
          {[
            ['NAME:', (customer.name || '').toUpperCase()],
            ['PHONE:', (customer.phone || '').toUpperCase()],
            ['ADDRESS:', (customer.address || '').toUpperCase()],
          ].filter(([,v]) => v).map(([l, v]) => (
            <div key={l} className={styles.t7InfoRow}>
              <span className={styles.t7InfoKey}>{l}</span>
              <span className={styles.t7InfoVal}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.t7Divider} />
      <div className={styles.t7ForLabel}>FOR:</div>
      <div className={styles.t7TableHead}>
        <span className={styles.t7NumCol}>No.</span>
        <span style={{ flex: 3 }}>Description</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Qty</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Price</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
      </div>
      {invoice.items?.map((item, i) => (
        <div key={i} className={styles.t7TableRow}>
          <span className={styles.t7NumCol}>{i + 1}</span>
          <span style={{ flex: 3 }}>{item.name}</span>
          <span style={{ flex: 1, textAlign: 'right' }}>1</span>
          <span style={{ flex: 1, textAlign: 'right' }}>{fmt(currency, item.price)}</span>
          <span className={styles.t7RedPrice} style={{ color: accentColor }}>{fmt(currency, item.price)}</span>
        </div>
      ))}
      <div className={styles.t7TotalBar} style={{ background: accentColor }}>
        <span>TOTAL:</span>
        <span className={styles.t7TotalAmt}>{fmt(currency, total)}</span>
      </div>
      {brand.accountBank && (
        <div className={styles.t7PayRow}>
          <span className={styles.t7InfoKey}>BANK:</span>
          <span className={styles.t7InfoVal}>{brand.accountBank}</span>
          {brand.accountName && <><span className={styles.t7InfoKey} style={{ marginLeft: 8 }}>ACCT NAME:</span><span className={styles.t7InfoVal}>{brand.accountName}</span></>}
          {brand.accountNumber && <><span className={styles.t7InfoKey} style={{ marginLeft: 8 }}>ACCT #:</span><span className={styles.t7InfoVal}>{brand.accountNumber}</span></>}
        </div>
      )}
    </div>
  )
}
