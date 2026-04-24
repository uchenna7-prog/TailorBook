import styles from "../styles/Template11.module.css"
import { TAILOR_ROWS } from "../../datas/sampleDatas"

export function InvoiceTemplate11() {
  return (
    <div className={styles.t11Base}>
      <div className={styles.t11TopBar}>
        <div className={styles.t11LogoArea}>
          <div className={styles.t11LogoHex}>
            <span className="mi" style={{ fontSize:11,color:'#fff' }}>checkroom</span>
          </div>
          <div>
            <div className={styles.t11CompanyName}>ADEOLA COUTURE</div>
            <div className={styles.t11CompanySub}>Premium Tailoring Studio</div>
          </div>
        </div>
        <div className={styles.t11CompanyInfo}>
          <div>Adeola Stitches</div>
          <div>14 Bode Thomas Street</div>
          <div>Surulere, Lagos</div>
        </div>
        <div className={styles.t11CompanyInfo} style={{ textAlign:'right' }}>
          <div>www.adeolacouture.ng</div>
          <div>info@adeolacouture.ng</div>
          <div>+234 801 234 5678</div>
        </div>
      </div>
      <div className={styles.t11InvoiceTitle}>Invoice</div>
      <div className={styles.t11BlueBar}>
        <span>INVOICE: #0000011</span>
        <span>DATE ISSUED: 08.04.2025</span>
        <span>DUE DATE: 15.04.2025</span>
      </div>
      <div className={styles.t11IssuedRow}>
        <div>
          <div className={styles.t11IssuedLabel}>ISSUED TO</div>
          <div>Mrs. Adaeze Obi</div>
          <div>27 Trans-Ekulu Avenue</div>
          <div>Enugu, Enugu State</div>
          <div>+234 812 345 6789</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div className={styles.t11AmountLabel}>AMOUNT</div>
          <div className={styles.t11AmountVal}>₦56,200</div>
        </div>
      </div>
      <div className={styles.t11ProjectName}>Tailoring Order — Spring Collection 2025</div>
      <div className={styles.t11TableHead}>
        <span style={{ flex:3 }}>Description</span>
        <span>Qty</span><span>Price</span><span>Subtotal</span>
      </div>
      {TAILOR_ROWS.map(([d,p,q,t])=>(
        <div key={d} className={styles.t11TableRow}>
          <span style={{ flex:3 }}>• {d}</span>
          <span>{q}</span><span>{p}</span><span>{t}</span>
        </div>
      ))}
      <div className={styles.t11TotArea}>
        <div className={styles.t11TotRow}><span>Subtotal</span><span>₦56,200</span></div>
        <div className={styles.t11TotRow}><span>Tax 0.00%</span><span>₦0</span></div>
        <div className={styles.t11TotBold}><span>TOTAL</span><span>₦56,200</span></div>
      </div>
      <div className={styles.t11PayTitle}>Payment Information</div>
      <div className={styles.t11PayBoxRow}>
        <div className={styles.t11PayBox}>
          <div className={styles.t11PayBoxTitle}>Bank Transfer</div>
          <div>GT Bank Nigeria<br />Adeola Stitches<br />Acct: 0123456789</div>
        </div>
        <div className={styles.t11PayBox}>
          <div className={styles.t11PayBoxTitle}>Mobile Money</div>
          <div>OPay: 0801 234 5678<br />Palmpay: 0803 987 6543<br />Adeola Fashola</div>
        </div>
        <div className={styles.t11PayBox}>
          <div className={styles.t11PayBoxTitle}>Cash / Other</div>
          <div>Visit our studio at<br />14 Bode Thomas St<br />Surulere, Lagos</div>
        </div>
      </div>
      <div className={styles.t11ThankYou}>THANK YOU!</div>
    </div>
  )
}
