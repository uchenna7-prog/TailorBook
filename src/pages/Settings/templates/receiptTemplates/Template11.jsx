import styles from "../styles/Template11.module.css"
import { TAILOR_ROWS } from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RPreviewSummary/RPreviewSummary";
import { RECEIPT_BRAND_SAMPLE,RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER } from "../../datas/sampleDatas";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate11() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.t11Base}>
      <div className={styles.t11TopBar}>
        <div className={styles.t11LogoArea}>
          <div className={styles.t11LogoHex}>
            <span className="mi" style={{ fontSize:11,color:'#fff' }}>checkroom</span>
          </div>
          <div>
            <div className={styles.t11CompanyName}>{b.name.toUpperCase()}</div>
            <div className={styles.t11CompanySub}>Tailoring Studio</div>
          </div>
        </div>
        <div className={styles.t11CompanyInfo}>
          <div>{b.address}</div>
        </div>
        <div className={styles.t11CompanyInfo} style={{ textAlign:'right' }}>
          <div>{b.website}</div>
          <div>{b.email}</div>
          <div>{b.phone}</div>
        </div>
      </div>
      <div className={styles.t11InvoiceTitle}>Receipt</div>
      <div className={styles.t11BlueBar}>
        <span>RECEIPT: #{r.number}</span>
        <span>DATE: {r.date}</span>
        <span>AMOUNT: {rFmt('56200')}</span>
      </div>
      <div className={styles.t11IssuedRow}>
        <div>
          <div className={styles.t11IssuedLabel}>RECEIVED FROM</div>
          <div>{c.name}</div>
          <div>{c.phone}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div className={styles.t11AmountLabel}>AMOUNT PAID</div>
          <div className={styles.t11AmountVal}>{rFmt('56200')}</div>
        </div>
      </div>
      <div className={styles.t11ProjectName}>Payment for Tailoring Services</div>
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
        <div className={styles.t11TotBold}><span>TOTAL RECEIVED</span><span>{rFmt('56200')}</span></div>
      </div>
      <div className={styles.t11PayTitle}>Payment Received via</div>
      <div className={styles.t11PayBoxRow}>
        <div className={styles.t11PayBox}>
          <div className={styles.t11PayBoxTitle}>Bank Transfer</div>
          <div>GT Bank Nigeria<br />{b.name}<br />Acct: 0123456789</div>
        </div>
        <div className={styles.t11PayBox}>
          <div className={styles.t11PayBoxTitle}>Mobile Money</div>
          <div>OPay: 0801 234 5678<br />Palmpay: 0803 987 6543<br />{b.ownerName}</div>
        </div>
        <div className={styles.t11PayBox}>
          <div className={styles.t11PayBoxTitle}>Cash / Other</div>
          <div>Collected at studio<br />14 Bode Thomas St<br />Surulere, Lagos</div>
        </div>
      </div>
      <div className={styles.t11ThankYou}>THANK YOU!</div>
    </div>
  )
}
