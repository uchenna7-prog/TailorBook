import styles from "../styles/Template3.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RPreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate3() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.pBase} style={{ padding: 0 }}>
      <div className={styles.pPurpleBanner}>
        <div className={styles.pLogoBoxWhite}>{b.name}</div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.pLargeTitleWhite}>RECEIPT</div>
          <div className={styles.pWhiteNo}>{r.number}</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px 6px', fontSize: '7px' }}>
          <div style={{ flex: 1 }}>
            <div className={styles.pSmallCap}>FROM:</div>
            <strong>{b.name}</strong><br />{b.address}<br />{b.phone}
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.pSmallCap}>RECEIVED FROM:</div>
            <strong>{c.name}</strong><br />{c.phone}
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.pSmallCap}>DATE:</div>
            <strong>{r.date}</strong>
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.pSmallCap}>RECEIPT #:</div>
            <strong>{r.number}</strong>
          </div>
        </div>
        <div style={{ padding: '0 14px', flex: 1 }}>
          <RPreviewSummary receipt={r} />
        </div>
      </div>
      <div className={styles.pPurpleBottom}>
        <div className={styles.pPurpleFootRow}>
          <div className={styles.pFootSectionWhite}>
            <strong>Payment Received via:</strong><br />GT Bank — Account: 0123456789
          </div>
          <div className={styles.pFootSectionWhite}>
            <strong>Notes:</strong><br />{b.footer}
          </div>
        </div>
      </div>
    </div>
  )
}

