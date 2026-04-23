import styles from "../styles/template1.module.css";
import { RECEIPT_SAMPLE, RECEIPT_SAMPLE_CUSTOMER, RECEIPT_BRAND_SAMPLE } from "../../datas/sampleDatas";
import { RPreviewSummary } from "../../components/RpreviewSummary/RPreviewSummary";

export function RTemplate1() {
  const r = RECEIPT_SAMPLE;
  const c = RECEIPT_SAMPLE_CUSTOMER;
  const b = RECEIPT_BRAND_SAMPLE;

  return (
    <div className={styles.pBase}>
      <div className={styles.pBrandCenter}>
        <div className={styles.pBrandName}>{b.name}</div>
        <div className={styles.pBrandSub}>{b.address}</div>
      </div>

      <div className={styles.pInvoiceCentred}>
        <div className={styles.pInvoiceLine} />
        <div className={styles.pInvoiceWordCentre}>RECEIPT</div>
        <div className={styles.pInvoiceLine} />
      </div>

      <div className={styles.pBody}>
        <div className={styles.pMetaRow}>
          <div>
            <div className={styles.pSmallCap}>RECEIVED FROM:</div>
            <strong>{c.name}</strong><br />{c.phone}
          </div>
          <div style={{ textAlign: 'right', fontSize: '7px' }}>
            Receipt #: <strong>{r.number}</strong><br />
            Date: <strong>{r.date}</strong>
          </div>
        </div>

        <RPreviewSummary receipt={r} />
      </div>

      <div className={styles.pFooter}>
        <div className={styles.pFootSection}>
          <strong>Payment Received via:</strong><br />
          GT Bank — {b.name}<br />
          Account: 0123456789
        </div>
        <div className={styles.pFootSection}>
          <strong>Notes:</strong><br />
          {b.footer}
        </div>
      </div>
    </div>
  );
}