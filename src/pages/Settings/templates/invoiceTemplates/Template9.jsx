import styles from "../styles/Template9.module.css"

export function Template9() {
  return (
    <div className={styles.t9Base}>
      <div className={styles.t9Header}>
        <div>
          <div className={styles.t9LogoRow}>
            <span className="mi" style={{ fontSize:14,color:'#333' }}>checkroom</span>
            <span className={styles.t9CompanyName}>ADEOLA STITCHES</span>
          </div>
          <div className={styles.t9CompanySub}>PREMIUM TAILORING SHOP</div>
          <div className={styles.t9CompanyAddr}>14 Bode Thomas St,<br />Surulere, Lagos</div>
        </div>
        <div className={styles.t9InvoiceTitle}>INVOICE</div>
      </div>
      <div className={styles.t9NumBar}>
        <span>INVOICE # 0000009</span><span>|</span><span>DATE: 08 / 04 / 2025</span>
      </div>
      <div className={styles.t9BillShip}>
        <div>
          <span className={styles.t9BillLabel}>Bill to:</span>
          <div><strong>Mr. Yusuf Abubakar</strong></div>
          <div>15 Kaduna Road, GRA</div><div>Kaduna State</div>
        </div>
        <div>
          <span className={styles.t9BillLabel}>Ship to:</span>
          <div><strong>Mr. Yusuf Abubakar</strong></div>
          <div>15 Kaduna Road, GRA</div><div>Kaduna State</div>
        </div>
      </div>
      <div className={styles.t9TableHead}>
        <span>QTY</span>
        <span style={{ flex:3 }}>DESCRIPTION</span>
        <span>PRICE</span><span>TOTAL</span>
      </div>
      {[['1','Custom Agbada Sewing','₦8,500','₦8,500'],['2','Senator Suit Stitching','₦6,200','₦12,400'],['3','Ankara Dress Alteration','₦2,500','₦7,500'],['1','Bridal Gown Fitting','₦15,000','₦15,000']].map(([q,d,p,t])=>(
        <div key={d} className={styles.t9TableRow}>
          <span>{q}</span><span style={{ flex:3 }}>{d}</span><span>{p}</span><span>{t}</span>
        </div>
      ))}
      <div className={styles.t9SubArea}>
        <div className={styles.t9SubRow}><span>Subtotal</span><span>₦43,400</span></div>
        <div className={styles.t9SubRow}><span>Tax</span><span>0.00%</span></div>
      </div>
      <div className={styles.t9TotalBar}><span>TOTAL</span><span>₦43,400</span></div>
      <div className={styles.t9Footer}>
        <div>
          <div className={styles.t9ThankYou}>THANK YOU FOR YOUR BUSINESS</div>
          <div className={styles.t9PayNote}>Payment due max 7 days after invoice.</div>
        </div>
        <div className={styles.t9SignArea}>
          <div className={styles.t9SignLine} />
          <div className={styles.t9SignLabel}>Signature</div>
        </div>
      </div>
      <div className={styles.t9CornerDeco} />
    </div>
  )
}
