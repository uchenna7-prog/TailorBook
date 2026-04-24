import styles from "../styles/Template7.module.css"
import { NUMBERED_ROWS } from "../../datas/sampleDatas"

export function InvoiceTemplate7() {
  return (
    <div className={styles.t7Base}>
      <div className={styles.t7Header}>
        <div className={styles.t7LogoCircle}>
          <span className="mi" style={{ fontSize: 13, color: 'var(--brand-primary)' }}>checkroom</span>
        </div>
        <div className={styles.t7TitleGroup}>
          <span className={styles.t7InvoiceWord}>INVOICE</span>
          <span className={styles.t7InvoiceNum}>#0000007</span>
        </div>
        <div className={styles.t7DateBlock}>
          <div className={styles.t7DateLabel}>DATE:</div>
          <div className={styles.t7DateVal}>APRIL 08, 2025</div>
        </div>
      </div>
      <div className={styles.t7Divider} />
      <div className={styles.t7FromTo}>
        <div className={styles.t7FromToBlock}>
          <div className={styles.t7FromLabel}>FROM:</div>
          <div className={styles.t7FromDivider} />
          {[['NAME:','ADEOLA FASHOLA'],['COMPANY:','ADEOLA STITCHES'],['ADDRESS:','14 BODE THOMAS ST'],['CITY:','SURULERE, LAGOS'],['PHONE:','+234 801 234 5678']].map(([l,v])=>(
            <div key={l} className={styles.t7InfoRow}><span className={styles.t7InfoKey}>{l}</span><span className={styles.t7InfoVal}>{v}</span></div>
          ))}
        </div>
        <div className={styles.t7FromToBlock}>
          <div className={styles.t7ToLabel}>TO:</div>
          <div className={styles.t7FromDivider} />
          {[['NAME:','CHUKWUEMEKA OBI'],['COMPANY:','OKONKWO HOLDINGS'],['ADDRESS:','7 INDEPENDENCE LAYOUT'],['CITY:','ENUGU STATE'],['PHONE:','+234 905 678 1234']].map(([l,v])=>(
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
        <span>TOTAL:</span>
        <span className={styles.t7TotalAmt}>₦48,200</span>
      </div>
    </div>
  )
}
