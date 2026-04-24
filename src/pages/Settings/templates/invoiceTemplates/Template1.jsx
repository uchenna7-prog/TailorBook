import styles from "../styles/Template1.module.css";
import { TAILOR_ROWS } from "../../datas/sampleDatas";

export function InvoiceTemplate1() {
  return (
    <div className={styles.pBase}>
      <div className={styles.pBrandCenter}>
        <div className={styles.pBrandName}>Adeola Stitches</div>
        <div className={styles.pBrandSub}>14 Bode Thomas St, Surulere, Lagos</div>
      </div>

      <div className={styles.pInvoiceCentred}>
        <div className={styles.pInvoiceLine} />
        <div className={styles.pInvoiceWordCentre}>INVOICE</div>
        <div className={styles.pInvoiceLine} />
      </div>

      <div className={styles.pBody}>
        <div className={styles.pMetaRow}>
          <div>
            <div className={styles.pSmallCap}>BILL TO:</div>
            <strong>Mrs. Chidinma Okafor</strong><br />
            22 Akin Adesola Street<br />Victoria Island, Lagos
          </div>
          <div style={{ textAlign: 'right', fontSize: '7px' }}>
            Invoice #: <strong>0000001</strong><br />
            Issue Date: <strong>12 Apr 2025</strong><br />
            Due Date: <strong>19 Apr 2025</strong>
          </div>
        </div>

        <div className={styles.pTHead2}>
          <span>Description</span>
          <span>Price</span>
          <span>Qty</span>
          <span>Total</span>
        </div>
        {TAILOR_ROWS.map(([d, p, q, t]) => (
          <div key={d} className={styles.pTRow2}>
            <span>{d}</span>
            <span>{p}</span>
            <span>{q}</span>
            <span>{t}</span>
          </div>
        ))}

        <div className={styles.pSummary}>
          <div className={styles.pSumRow}><span>Subtotal</span><span>₦56,200</span></div>
          <div className={styles.pSumRow}><span>Tax</span><span>₦0</span></div>
          <div className={`${styles.pSumRow} ${styles.pBold}`}><span>Total Due</span><span>₦56,200</span></div>
        </div>
      </div>

      <div className={styles.pFooter}>
        <div className={styles.pFootSection}>
          <strong>Payment Terms:</strong><br />
          GT Bank — Adeola Stitches<br />
          Account: 0123456789
        </div>
        <div className={styles.pFootSection}>
          <strong>Notes:</strong><br />
          Kindly make payment within 7 days.
        </div>
      </div>
    </div>
  );
}