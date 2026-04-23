import styles from "../styles/Template8.module.css"
import { TAILOR_ROWS } from "../../datas/sampleDatas"

export function Template8() {
  return (
    <div className={styles.t8Base}>
      <div className={styles.t8Header}>
        <div className={styles.t8LogoArea}>
          <span className="mi" style={{ fontSize: 20, color: '#333' }}>checkroom</span>
          <div>
            <div className={styles.t8BrandName}>Adeola Couture</div>
            <div className={styles.t8BrandSub}>PREMIUM TAILORING STUDIO</div>
          </div>
        </div>
        <div className={styles.t8InvoiceBox}>
          <div className={styles.t8InvoiceTitle}>INVOICE</div>
          <div className={styles.t8InvoiceMeta}>
            <span>Invoice#</span><span>0000008</span>
            <span>Date</span><span>08/04/2025</span>
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
          <div className={styles.t8GreenBoxTitle}>Invoice to:</div>
          <div className={styles.t8GreenBoxName}>Mrs. Ngozi Eze</div>
          <div className={styles.t8GreenBoxAddr}>12 Awolowo Rd,<br />Ikoyi, Lagos.</div>
          <div className={styles.t8GreenDivider} />
          <div className={styles.t8GreenBoxTitle}>Terms &amp; Conditions</div>
          <div className={styles.t8GreenBoxAddr}>All garments collected within 30 days of completion.</div>
        </div>
        <div className={styles.t8PaymentInfo}>
          <div className={styles.t8PayLabel}>Payment Info:</div>
          <div>Account #: 0123 4567 89</div>
          <div>A/C Name: Adeola Couture</div>
          <div>Bank: GT Bank Nigeria</div>
          <div className={styles.t8ThankYou}>Thank you for your business</div>
        </div>
        <div className={styles.t8Totals}>
          <div className={styles.t8TotRow}><span>Sub Total:</span><span>₦56,200</span></div>
          <div className={styles.t8TotRow}><span>Tax:</span><span>0.00%</span></div>
          <div className={styles.t8TotDivider} />
          <div className={styles.t8TotTotal}><span>Total:</span><span>₦56,200</span></div>
          <div className={styles.t8SignLine}>Authorised Sign</div>
        </div>
      </div>
    </div>
  )
}
