import styles from "../styles/Template4.module.css"
import {RECEIPT_SAMPLE,RECEIPT_SAMPLE_CUSTOMER,RECEIPT_BRAND_SAMPLE} from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RpreviewSummary/RPreviewSummary";
import { rFmt,rResolvePaid } from "../../utils/receiptUtils";

export function RTemplate4() {
  const r = RECEIPT_SAMPLE; const c = RECEIPT_SAMPLE_CUSTOMER; const b = RECEIPT_BRAND_SAMPLE
  return (
    <div className={styles.p4Base}>
      <div className={styles.p4GoldBar} />
      <div className={styles.p4Header}>
        <div className={styles.p4InvoiceWord}>RECEIPT</div>
        <div className={styles.p4HeaderRight}>
          <div className={styles.p4MetaRow}>
            <span className={styles.p4MetaKey}>DATE</span>
            <span className={styles.p4MetaVal}>{r.date}</span>
          </div>
          <div className={styles.p4MetaRow}>
            <span className={styles.p4MetaKey}>RECEIPT #</span>
            <span className={styles.p4MetaVal}>{r.number}</span>
          </div>
        </div>
      </div>
      <div className={styles.p4BillRow}>
        <div className={styles.p4BillBlock}>
          <div className={styles.p4BillLabel}>FROM</div>
          <div className={styles.p4BillName}>{b.name}</div>
          <div className={styles.p4BillInfo}>{b.address}</div>
          <div className={styles.p4BillInfo}>{b.phone}</div>
        </div>
        <div className={styles.p4BillBlock} style={{ textAlign: 'right' }}>
          <div className={styles.p4BillLabel}>RECEIVED FROM</div>
          <div className={styles.p4BillName}>{c.name}</div>
          <div className={styles.p4BillInfo}>{c.phone}</div>
        </div>
      </div>
      <div className={styles.p4Divider} />
      <div style={{ padding: '0 16px' }}>
        <RPreviewSummary receipt={r} />
      </div>
      <div className={styles.p4Footer}>
        <div className={styles.p4FootBlock}>
          <div className={styles.p4FootLabel}>Payment Received via:</div>
          <div className={styles.p4FootInfo}>GT Bank — {b.name}</div>
          <div className={styles.p4FootInfo}>Account No: 0123456789</div>
        </div>
        <div className={styles.p4FootBlock}>
          <div className={styles.p4FootLabel}>Notes:</div>
          <div className={styles.p4FootInfo}>{b.footer}</div>
        </div>
      </div>
    </div>
  )
}
