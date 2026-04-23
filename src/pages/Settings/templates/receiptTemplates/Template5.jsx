import styles from "../styles/template5.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RpreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate5() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.t5Base}>
      <div className={styles.t5Top}>
        <div className={styles.t5Title}>Receipt</div>
        <div className={styles.t5TopRight}>
          <div>{r.date}</div>
          <div><strong>Receipt No. {r.number}</strong></div>
        </div>
      </div>
      <div className={styles.t5Divider} />
      <div className={styles.t5BilledTo}>
        <div className={styles.t5BilledLabel}>Received from:</div>
        <div><strong>{c.name}</strong></div>
        <div>{c.phone}</div>
      </div>
      <div className={styles.t5Divider} />
      <RPreviewSummary receipt={r} />
      <div className={styles.t5Divider} />
      <div className={styles.t5Footer}>
        <div>
          <div className={styles.t5FootLabel}>Payment Received via</div>
          <div>{b.name}</div>
          <div>Bank: GT Bank Nigeria</div>
          <div>Account No: 0123 4567 89</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>{b.ownerName}</strong></div>
          <div>{b.address}</div>
          <div>{b.phone}</div>
          <div>{b.email}</div>
        </div>
      </div>
    </div>
  )
}
