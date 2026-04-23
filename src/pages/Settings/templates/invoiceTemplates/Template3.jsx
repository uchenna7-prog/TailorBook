import styles from "../styles/template3.module.css"
import { TAILOR_ROWS } from "../../datas/sampleDatas"

export function Template3() {
  return (
    <div className={styles.pBase} style={{ padding: 0 }}>
      <div className={styles.pPurpleBanner}>
        <div className={styles.pLogoBoxWhite}>Place logo here</div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.pLargeTitleWhite}>INVOICE</div>
          <div className={styles.pWhiteNo}>0000003</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', fontSize: '7px' }}>
        <div style={{ flex: 1 }}>
          <div className={styles.pSmallCap}>BILL FROM:</div>
          <strong>Adeola Stitches</strong><br />14 Bode Thomas St<br />Surulere, Lagos<br />+234 801 234 5678
        </div>
        <div style={{ flex: 1 }}>
          <div className={styles.pSmallCap}>BILL TO:</div>
          <strong>Miss Fatima Bello</strong><br />9 Marina Road<br />Lagos Island, Lagos
        </div>
        <div style={{ flex: 1 }}>
          <div className={styles.pSmallCap}>ISSUE DATE:</div>
          <strong>08 Apr 2025</strong>
        </div>
        <div style={{ flex: 1 }}>
          <div className={styles.pSmallCap}>DUE DATE:</div>
          <strong>15 Apr 2025</strong>
        </div>
      </div>
      <div style={{ padding: '0 14px', flex: 1 }}>
        <div className={styles.pTHead2}>
          <span style={{ flex: 3 }}>Description</span><span>Price</span><span>Qty</span><span>Total</span>
        </div>
        {TAILOR_ROWS.map(([d, p, q, t]) => (
          <div key={d} className={styles.pTRow2}>
            <span style={{ flex: 3 }}>{d}</span><span>{p}</span><span>{q}</span><span>{t}</span>
          </div>
        ))}
        <div className={styles.pSummary}>
          <div className={styles.pSumRow}><span>Subtotal</span><span>₦56,200</span></div>
          <div className={styles.pSumRow}><span>Tax</span><span>₦0</span></div>
          <div className={`${styles.pSumRow} ${styles.pBold}`}><span>Total Due</span><span>₦56,200</span></div>
        </div>
      </div>
      <div className={styles.pPurpleBottom}>
        <div className={styles.pPurpleFootRow}>
          <div className={styles.pFootSectionWhite}>
            <strong>Payment Terms:</strong><br />GT Bank — Account: 0123456789
          </div>
          <div className={styles.pFootSectionWhite}>
            <strong>Notes:</strong><br />Payment due within 7 days
          </div>
        </div>
      </div>
    </div>
  )
}

