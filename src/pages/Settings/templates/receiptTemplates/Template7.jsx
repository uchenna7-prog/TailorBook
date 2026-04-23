import styles from "../styles/Template7.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE,NUMBERED_ROWS} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RPreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate7() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.t7Base}>
      <div className={styles.t7Header}>
        <div className={styles.t7LogoCircle}>
          <span className="mi" style={{ fontSize: 13, color: 'var(--brand-primary)' }}>checkroom</span>
        </div>
        <div className={styles.t7TitleGroup}>
          <span className={styles.t7InvoiceWord}>RECEIPT</span>
          <span className={styles.t7InvoiceNum}>#{r.number}</span>
        </div>
        <div className={styles.t7DateBlock}>
          <div className={styles.t7DateLabel}>DATE:</div>
          <div className={styles.t7DateVal}>{r.date.toUpperCase()}</div>
        </div>
      </div>
      <div className={styles.t7Divider} />
      <div className={styles.t7FromTo}>
        <div className={styles.t7FromToBlock}>
          <div className={styles.t7FromLabel}>FROM:</div>
          <div className={styles.t7FromDivider} />
          {[['NAME:',b.ownerName],['COMPANY:',b.name.toUpperCase()],['ADDRESS:',b.address.split(',')[0]],['CITY:','SURULERE, LAGOS'],['PHONE:',b.phone]].map(([l,v])=>(
            <div key={l} className={styles.t7InfoRow}><span className={styles.t7InfoKey}>{l}</span><span className={styles.t7InfoVal}>{v}</span></div>
          ))}
        </div>
        <div className={styles.t7FromToBlock}>
          <div className={styles.t7ToLabel}>TO:</div>
          <div className={styles.t7FromDivider} />
          {[['NAME:',c.name.toUpperCase()],['PHONE:',c.phone],['ADDRESS:',c.address?.split(',')[0] || '22 AKIN ADESOLA ST'],['CITY:','VICTORIA ISLAND']].map(([l,v])=>(
            <div key={l} className={styles.t7InfoRow}><span className={styles.t7InfoKey}>{l}</span><span className={styles.t7InfoVal}>{v}</span></div>
          ))}
        </div>
      </div>
      <div className={styles.t7Divider} />
      <div className={styles.t7ForLabel}>FOR:</div>
      <div className={styles.t7TableHead}>
        <span className={styles.t7NumCol}>No.</span>
        <span style={{ flex: 3 }}>Description</span>
        <span style={{ flex:1,textAlign:'right' }}>Qty</span>
        <span style={{ flex:1,textAlign:'right' }}>Price</span>
        <span style={{ flex:1,textAlign:'right' }}>Total</span>
      </div>
      {NUMBERED_ROWS.map(([n,d,q,p,t])=>(
        <div key={n} className={styles.t7TableRow}>
          <span className={styles.t7NumCol}>{n}</span>
          <span style={{ flex:3 }}>{d}</span>
          <span style={{ flex:1,textAlign:'right' }}>{q}</span>
          <span style={{ flex:1,textAlign:'right' }}>{p}</span>
          <span className={styles.t7RedPrice}>{t}</span>
        </div>
      ))}
      <div className={styles.t7TotalBar}>
        <span>RECEIVED:</span>
        <span className={styles.t7TotalAmt}>{rFmt('56200')}</span>
      </div>
    </div>
  )
}
