import styles from "../styles/Template6.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE,TAILOR_ROWS} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RpreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate6() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.t6Base}>
      <div className={styles.t6Header}>
        <div className={styles.t6LogoArea}>
          <div className={styles.t6LogoCircle}>
            <span className="mi" style={{ fontSize: 13, color: '#1a1a1a' }}>checkroom</span>
          </div>
          <div>
            <div className={styles.t6CompanyName}>{b.name.toUpperCase()}</div>
            <div className={styles.t6CompanySub}>TAILORING STUDIO</div>
          </div>
        </div>
        <div className={styles.t6HeaderRight}><div>{b.address}</div></div>
        <div className={styles.t6HeaderRight}><div>{b.phone}</div><div>{b.email}</div></div>
      </div>
      <div className={styles.t6InvoiceRow}>
        <div className={styles.t6InvoiceLeft}>
          <span className={styles.t6InvoiceWord}>RECEIPT </span>
          <span className={styles.t6InvoiceNum}>#{r.number}</span>
        </div>
        <div className={styles.t6InvoiceRight}>
          <div><span className={styles.t6Label}>DATE:</span> {r.date}</div>
          <div><span className={styles.t6Label}>TOTAL:</span> {rFmt('56200')}</div>
        </div>
      </div>
      <div className={styles.t6InfoRow}>
        <div>
          <div className={styles.t6InfoLabel}>PAYMENT:</div>
          <strong>GT BANK</strong><br />
          {b.name}<br />Acct: 0123456789<br />
          <strong style={{ display: 'block', marginTop: 3 }}>TRANSFER</strong>
          {b.email}
        </div>
        <div>
          <div className={styles.t6InfoLabel}>RECEIVED BY:</div>
          {b.name}<br />{b.address}
        </div>
        <div>
          <div className={styles.t6InfoLabel}>RECEIVED FROM:</div>
          {c.name}<br />{c.phone}
        </div>
      </div>
      <div className={styles.t6TableHead}>
        <span style={{ flex: 3 }}>DESCRIPTION</span><span>PRICE</span><span>QTY</span><span>TOTAL</span>
      </div>
      {TAILOR_ROWS.map(([d, p, q, t]) => (
        <div key={d} className={styles.t6TableRowSolid}>
          <span style={{ flex: 3 }}>{d}</span><span>{p}</span><span>{q}</span><span>{t}</span>
        </div>
      ))}
      <div className={styles.t6TotalsArea}>
        <div className={styles.t6TotRow}><span>SUBTOTAL</span><span>₦56,200</span></div>
        <div className={styles.t6TotRow}><span>TAX</span><span>₦0</span></div>
        <div className={styles.t6TotTotal}><span>TOTAL RECEIVED</span><span>{rFmt('56200')}</span></div>
      </div>
      <div className={styles.t6ThankYou}>{b.footer}</div>
    </div>
  )
}

