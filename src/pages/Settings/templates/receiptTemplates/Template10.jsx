import styles from "../styles/Template10.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE,TAILOR_ROWS} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RpreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate10() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.t10Base}>
      <div className={styles.t10HeaderZone}>
        <div className={styles.t10FullBanner}>
          <span className={styles.t10BannerTitle}>RECEIPT</span>
        </div>
        <div className={styles.t10BrandInBanner}>
          <span className="mi" style={{ fontSize:14,color:'#333' }}>checkroom</span>
          <div>
            <div className={styles.t10BrandName}>{b.name}</div>
            <div className={styles.t10BrandSub}>TAILORING STUDIO</div>
          </div>
        </div>
      </div>
      <div className={styles.t10MetaRow}>
        <div>
          <div className={styles.t10MetaLabel}>Received from:</div>
          <div className={styles.t10MetaName}>{c.name}</div>
          <div className={styles.t10MetaAddr}>{c.phone}<br />{c.address}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div><span className={styles.t10MetaKey}>Receipt#</span> <strong>{r.number}</strong></div>
          <div><span className={styles.t10MetaKey}>Date</span> <strong>{r.date}</strong></div>
        </div>
      </div>
      <div className={styles.t10TableHead}>
        <span>SL.</span>
        <span style={{ flex:3 }}>Description</span>
        <span>Price</span><span>Qty</span><span>Total</span>
      </div>
      {TAILOR_ROWS.map(([d,p,q,t],i)=>(
        <div key={d} className={styles.t10TableRow}>
          <span>{i+1}</span>
          <span style={{ flex:3 }}>{d}</span>
          <span>{p}</span><span>{q}</span><span>{t}</span>
        </div>
      ))}
      <div className={styles.t10Divider} />
      <div className={styles.t10Bottom}>
        <div style={{ flex:1 }}>
          <div className={styles.t10ThankYou}>{b.footer}</div>
          <div className={styles.t10PayLabel}>Payment Received via:</div>
          <div className={styles.t10PayInfo}>
            Account #: 0123 4567 89<br />
            A/C Name: {b.name}<br />
            Bank: GT Bank Nigeria
          </div>
          <div className={styles.t10TCLabel}>Terms &amp; Conditions</div>
          <div className={styles.t10TCText}>Garments not collected within 30 days become property of the studio.</div>
        </div>
        <div className={styles.t10RightCol}>
          <div className={styles.t10TotalsWrap}>
            <div className={styles.t10TotRow}><span>Sub Total:</span><span>₦56,200</span></div>
            <div className={styles.t10TotRow}><span>Tax:</span><span>0.00%</span></div>
            <div className={styles.t10TotDivider} />
            <div className={styles.t10TotTotal}><span>Received:</span><span>{rFmt('56200')}</span></div>
          </div>
          <div className={styles.t10SignBlock}>
            <div className={styles.t10SignLine} />
            <div className={styles.t10SignLabel}>Authorised Sign</div>
          </div>
        </div>
      </div>
      <div className={styles.t10CornerPink} />
    </div>
  )
}
