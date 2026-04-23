import styles from "../styles/Template2.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RPreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate2() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.pBase}>
      <div className={styles.pHeaderFree}>
        <div className={styles.pTitleBlock}>
          <div className={styles.pLargeTitle}>RECEIPT</div>
          <div className={styles.pSubNo}>{r.number}</div>
        </div>
        <div className={styles.pLogoPlaceholderBig}>{b.name}</div>
      </div>
      <div className={styles.pFreeGrid}>
        <div className={styles.pFreeBox}>
          <div className={styles.pSmallCap}>FROM:</div>
          <strong>{b.name}</strong><br />{b.address}<br />{b.phone}
        </div>
        <div className={styles.pFreeBox}>
          <div className={styles.pSmallCap}>RECEIVED FROM:</div>
          <strong>{c.name}</strong><br />{c.phone}
        </div>
        <div className={styles.pFreeBox}>
          <div className={styles.pSmallCap}>DATE:</div><strong>{r.date}</strong>
        </div>
      </div>
      <div className={styles.pBody}>
        <RPreviewSummary receipt={r} />
      </div>
      <div className={styles.pFooter}>
        <div className={styles.pFootSection}>
          <strong>Payment Received via:</strong><br />
          GT Bank — {b.name}, Account: 0123456789
        </div>
      </div>
      <div className={styles.pFooterGray}>{b.footer}</div>
    </div>
  )
}

