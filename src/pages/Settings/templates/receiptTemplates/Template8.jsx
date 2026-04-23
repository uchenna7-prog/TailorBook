import styles from "../styles/Template8.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE,TAILOR_ROWS} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RpreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate8() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.t8Base}>
      <div className={styles.t8Header}>
        <div className={styles.t8LogoArea}>
          <span className="mi" style={{ fontSize: 20, color: '#333' }}>checkroom</span>
          <div>
            <div className={styles.t8BrandName}>{b.name}</div>
            <div className={styles.t8BrandSub}>TAILORING STUDIO</div>
          </div>
        </div>
        <div className={styles.t8InvoiceBox}>
          <div className={styles.t8InvoiceTitle}>RECEIPT</div>
          <div className={styles.t8InvoiceMeta}>
            <span>Receipt#</span><span>{r.number}</span>
            <span>Date</span><span>{r.date}</span>
          </div>
        </div>
      </div>
      <div className={styles.t8TableHead}>
        <span>SL.</span>
        <span style={{ flex:3 }}>Description</span>
        <span>Price</span><span>Qty</span><span>Total</span>
      </div>
      {TAILOR_ROWS.map(([d,p,q,t],i)=>(
        <div key={d} className={styles.t8TableRow}>
          <span>{i+1}</span>
          <span style={{ flex:3 }}>{d}</span>
          <span>{p}</span><span>{q}</span><span>{t}</span>
        </div>
      ))}
      <div className={styles.t8Divider} />
      <div className={styles.t8Bottom}>
        <div className={styles.t8GreenBox}>
          <div className={styles.t8GreenBoxTitle}>Received from:</div>
          <div className={styles.t8GreenBoxName}>{c.name}</div>
          <div className={styles.t8GreenBoxAddr}>{c.phone}<br />{c.address}</div>
          <div className={styles.t8GreenDivider} />
          <div className={styles.t8GreenBoxTitle}>Terms &amp; Conditions</div>
          <div className={styles.t8GreenBoxAddr}>All garments collected within 30 days of completion.</div>
        </div>
        <div className={styles.t8PaymentInfo}>
          <div className={styles.t8PayLabel}>Payment Received via:</div>
          <div>Account #: 0123 4567 89</div>
          <div>A/C Name: {b.name}</div>
          <div>Bank: GT Bank Nigeria</div>
          <div className={styles.t8ThankYou}>{b.footer}</div>
        </div>
        <div className={styles.t8Totals}>
          <div className={styles.t8TotRow}><span>Sub Total:</span><span>₦56,200</span></div>
          <div className={styles.t8TotRow}><span>Tax:</span><span>0.00%</span></div>
          <div className={styles.t8TotDivider} />
          <div className={styles.t8TotTotal}><span>Received:</span><span>{rFmt('56200')}</span></div>
          <div className={styles.t8SignLine}>Authorised Sign</div>
        </div>
      </div>
    </div>
  )
}
