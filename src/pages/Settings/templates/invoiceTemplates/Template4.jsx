import styles from "../styles/Template4.module.css"
import { items } from "../../datas/sampleDatas"

export function InvoiceTemplate4() {

  return (
    <div className={styles.p4Base}>
      <div className={styles.p4GoldBar} />
      <div className={styles.p4Header}>
        <div className={styles.p4InvoiceWord}>INVOICE</div>
        <div className={styles.p4HeaderRight}>
          <div className={styles.p4MetaRow}>
            <span className={styles.p4MetaKey}>ISSUE DATE</span>
            <span className={styles.p4MetaVal}>Date Field</span>
          </div>
          <div className={styles.p4MetaRow}>
            <span className={styles.p4MetaKey}>DUE DATE</span>
            <span className={styles.p4MetaVal}>Date Field</span>
          </div>
          <div className={styles.p4MetaRow}>
            <span className={styles.p4MetaKey}>INVOICE #</span>
            <span className={styles.p4MetaVal}>0000004</span>
          </div>
        </div>
      </div>
      <div className={styles.p4BillRow}>
        <div className={styles.p4BillBlock}>
          <div className={styles.p4BillLabel}>BILL FROM</div>
          <div className={styles.p4BillName}>Adeola Stitches</div>
          <div className={styles.p4BillInfo}>14 Bode Thomas Street</div>
          <div className={styles.p4BillInfo}>Surulere, Lagos</div>
          <div className={styles.p4BillInfo}>+234 801 234 5678</div>
        </div>
        <div className={styles.p4BillBlock} style={{ textAlign: 'right' }}>
          <div className={styles.p4BillLabel}>BILL TO</div>
          <div className={styles.p4BillName}>Dr. Tunde Adeleke</div>
          <div className={styles.p4BillInfo}>Block 7, GRA Phase 2</div>
          <div className={styles.p4BillInfo}>Port Harcourt, Rivers</div>
        </div>
      </div>
      <div className={styles.p4Divider} />
      <div className={styles.p4TableHead}>
        <span style={{ flex: 3 }}>Description</span>
        <span>Price</span><span>QTY</span><span>Total</span>
      </div>
      {items.map((it, i) => (
        <div key={i} className={styles.p4TableRow}>
          <span style={{ flex: 3 }}>{it.desc}</span>
          <span>{it.price}</span><span>{it.qty}</span><span>{it.total}</span>
        </div>
      ))}
      <div className={styles.p4TotalsArea}>
        <div className={styles.p4TotRow}><span>Subtotal</span><span>₦56,200</span></div>
        <div className={styles.p4TotRow}><span>Tax</span><span>₦0.00</span></div>
        <div className={styles.p4TotDivider} />
        <div className={styles.p4TotBold}><span>Total Due</span><span>₦56,200</span></div>
      </div>
      <div className={styles.p4Footer}>
        <div className={styles.p4FootBlock}>
          <div className={styles.p4FootLabel}>Payment Terms:</div>
          <div className={styles.p4FootInfo}>GT Bank — Adeola Stitches</div>
          <div className={styles.p4FootInfo}>Account No: 0123456789</div>
          <div className={styles.p4FootInfo}>Routing #: 058152522</div>
        </div>
        <div className={styles.p4FootBlock}>
          <div className={styles.p4FootLabel}>Notes:</div>
          <div className={styles.p4FootInfo}>Add any additional notes here.</div>
        </div>
      </div>
    </div>
  )
}
