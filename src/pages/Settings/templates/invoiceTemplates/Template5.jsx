import styles from "../styles/Template5.module.css"
import { TAILOR_ROWS } from "../../datas/sampleDatas"

export function InvoiceTemplate5() {
  return (
    <div className={styles.t5Base}>
      <div className={styles.t5Top}>
        <div className={styles.t5Title}>Invoice</div>
        <div className={styles.t5TopRight}>
          <div>08 April 2025</div>
          <div><strong>Invoice No. 0000005</strong></div>
        </div>
      </div>
      <div className={styles.t5Divider} />
      <div className={styles.t5BilledTo}>
        <div className={styles.t5BilledLabel}>Billed to:</div>
        <div><strong>Mrs. Ngozi Eze</strong></div>
        <div>+234 807 654 3210</div>
        <div>12 Awolowo Road, Ikoyi, Lagos</div>
      </div>
      <div className={styles.t5Divider} />
      <div className={styles.t5TableHead}>
        <span style={{ flex: 3 }}>Description</span><span>Price</span><span>Qty</span><span>Total</span>
      </div>
      {TAILOR_ROWS.map(([d, p, q, t]) => (
        <div key={d} className={styles.t5TableRow}>
          <span style={{ flex: 3 }}>{d}</span><span>{p}</span><span>{q}</span><span>{t}</span>
        </div>
      ))}
      <div className={styles.t5Divider} />
      <div className={styles.t5Totals}>
        <div className={styles.t5TotRow}><span>Subtotal</span><span>₦56,200</span></div>
        <div className={styles.t5TotRow}><span>Tax (0%)</span><span>₦0</span></div>
        <div className={`${styles.t5TotRow} ${styles.t5TotBold}`}><span>Total</span><span>₦56,200</span></div>
      </div>
      <div className={styles.t5Divider} />
      <div className={styles.t5Footer}>
        <div>
          <div className={styles.t5FootLabel}>Payment Information</div>
          <div>Adeola Stitches</div>
          <div>Bank: GT Bank Nigeria</div>
          <div>Account No: 0123 4567 89</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>Adeola Fashola</strong></div>
          <div>14 Bode Thomas St, Surulere, Lagos</div>
          <div>+234 801 234 5678</div>
          <div>info@adeolacouture.ng</div>
        </div>
      </div>
    </div>
  )
}
