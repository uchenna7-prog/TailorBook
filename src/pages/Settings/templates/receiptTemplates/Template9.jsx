import styles from "../styles/template9.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RpreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate9() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.t9Base}>
      <div className={styles.t9Header}>
        <div>
          <div className={styles.t9LogoRow}>
            <span className="mi" style={{ fontSize:14,color:'#333' }}>checkroom</span>
            <span className={styles.t9CompanyName}>{b.name.toUpperCase()}</span>
          </div>
          <div className={styles.t9CompanySub}>TAILORING STUDIO</div>
          <div className={styles.t9CompanyAddr}>{b.address}</div>
        </div>
        <div className={styles.t9InvoiceTitle}>RECEIPT</div>
      </div>
      <div className={styles.t9NumBar}>
        <span>RECEIPT # {r.number}</span><span>|</span><span>DATE: {r.date}</span>
      </div>
      <div className={styles.t9BillShip}>
        <div>
          <span className={styles.t9BillLabel}>Received from:</span>
          <div><strong>{c.name}</strong></div>
          <div>{c.phone}</div>
        </div>
        <div>
          <span className={styles.t9BillLabel}>Received by:</span>
          <div><strong>{b.name}</strong></div>
          <div>{b.phone}</div>
        </div>
      </div>
      <div className={styles.t9TableHead}>
        <span>QTY</span>
        <span style={{ flex:3 }}>DESCRIPTION</span>
        <span>PRICE</span><span>TOTAL</span>
      </div>
      {[['1','Custom Agbada Sewing','₦8,500','₦8,500'],['2','Senator Suit Stitching','₦6,200','₦12,400'],['3','Ankara Dress Alteration','₦2,500','₦7,500'],['1','Bridal Gown Fitting','₦15,000','₦15,000']].map(([q,d,p,t])=>(
        <div key={d} className={styles.t9TableRow}>
          <span>{q}</span><span style={{ flex:3 }}>{d}</span><span>{p}</span><span>{t}</span>
        </div>
      ))}
      <div className={styles.t9SubArea}>
        <div className={styles.t9SubRow}><span>Subtotal</span><span>₦43,400</span></div>
        <div className={styles.t9SubRow}><span>Tax</span><span>0.00%</span></div>
      </div>
      <div className={styles.t9TotalBar}><span>AMOUNT RECEIVED</span><span>{rFmt('56200')}</span></div>
      <div className={styles.t9Footer}>
        <div>
          <div className={styles.t9ThankYou}>{b.footer.toUpperCase()}</div>
          <div className={styles.t9PayNote}>Payment received on {r.date}.</div>
        </div>
        <div className={styles.t9SignArea}>
          <div className={styles.t9SignLine} />
          <div className={styles.t9SignLabel}>Signature</div>
        </div>
      </div>
      <div className={styles.t9CornerDeco} />
    </div>
  )
}
