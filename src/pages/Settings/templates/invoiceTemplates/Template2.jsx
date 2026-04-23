import styles from "../styles/Template2.module.css"
import { TAILOR_ROWS } from "../../datas/sampleDatas"

export function Template2() {
  return (
    <div className={styles.pBase}>
      <div className={styles.pHeaderFree}>
        <div className={styles.pTitleBlock}>
          <div className={styles.pLargeTitle}>INVOICE</div>
          <div className={styles.pSubNo}>0000002</div>
        </div>
        <div className={styles.pLogoPlaceholderBig}>ADD YOUR LOGO</div>
      </div>
      <div className={styles.pFreeGrid}>
        <div className={styles.pFreeBox}>
          <div className={styles.pSmallCap}>BILL FROM:</div>
          <strong>Adeola Stitches</strong><br />14 Bode Thomas St, Lagos<br />+234 801 234 5678
        </div>
        <div className={styles.pFreeBox}>
          <div className={styles.pSmallCap}>BILL TO:</div>
          <strong>Mr. Emeka Nwosu</strong><br />5 Ogui Road, Enugu
        </div>
        <div className={styles.pFreeBox}>
          <div className={styles.pSmallCap}>ISSUE DATE:</div><strong>10 Apr 2025</strong><br />
          <div className={styles.pSmallCap} style={{ marginTop: 3 }}>DUE DATE:</div><strong>17 Apr 2025</strong>
        </div>
      </div>
      <div className={styles.pBody}>
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
          <div className={`${styles.pSumRow} ${styles.pBold}`}><span>Total Due</span><span>₦56,200</span></div>
        </div>
      </div>
      <div className={styles.pFooter}>
        <div className={styles.pFootSection}>
          <strong>Payment Information:</strong><br />
          GT Bank — Adeola Stitches, Account: 0123456789
        </div>
      </div>
      <div className={styles.pFooterGray}>Thank you for your business!</div>
    </div>
  )
}
