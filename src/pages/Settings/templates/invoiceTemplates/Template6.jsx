import styles from "../styles/template6.module.css"
import { TAILOR_ROWS } from "../../datas/sampleDatas"

export function Template6() {
  return (
    <div className={styles.t6Base}>
      <div className={styles.t6Header}>
        <div className={styles.t6LogoArea}>
          <div className={styles.t6LogoCircle}>
            <span className="mi" style={{ fontSize: 13, color: '#1a1a1a' }}>checkroom</span>
          </div>
          <div>
            <div className={styles.t6CompanyName}>ADEOLA COUTURE</div>
            <div className={styles.t6CompanySub}>PREMIUM TAILORING STUDIO</div>
          </div>
        </div>
        <div className={styles.t6HeaderRight}>
          <div>Adeola Stitches</div>
          <div>14 Bode Thomas Street</div>
          <div>Surulere, Lagos</div>
        </div>
        <div className={styles.t6HeaderRight}>
          <div>+234 801 234 5678</div>
          <div>+234 803 987 6543</div>
          <div>info@adeolacouture.ng</div>
        </div>
      </div>
      <div className={styles.t6InvoiceRow}>
        <div className={styles.t6InvoiceLeft}>
          <span className={styles.t6InvoiceWord}>INVOICE </span>
          <span className={styles.t6InvoiceNum}>#0000006</span>
        </div>
        <div className={styles.t6InvoiceRight}>
          <div><span className={styles.t6Label}>DATE:</span> 08/04/2025</div>
          <div><span className={styles.t6Label}>TOTAL:</span> ₦56,200</div>
        </div>
      </div>
      <div className={styles.t6InfoRow}>
        <div>
          <div className={styles.t6InfoLabel}>PAYMENT:</div>
          <strong>GT BANK</strong><br />
          Adeola Stitches<br />Acct: 0123456789<br />
          <strong style={{ display: 'block', marginTop: 3 }}>TRANSFER</strong>
          adeola@couture.ng
        </div>
        <div>
          <div className={styles.t6InfoLabel}>SHIP TO:</div>
          Mr. Babatunde Salami<br />Plot 3, Allen Avenue<br />Ikeja, Lagos
        </div>
        <div>
          <div className={styles.t6InfoLabel}>BILL TO:</div>
          Mr. Babatunde Salami<br />Plot 3, Allen Avenue<br />Ikeja, Lagos
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
        <div className={styles.t6TotTotal}><span>TOTAL</span><span>₦56,200</span></div>
      </div>
      <div className={styles.t6ThankYou}>THANK YOU FOR YOUR BUSINESS</div>
    </div>
  )
}
