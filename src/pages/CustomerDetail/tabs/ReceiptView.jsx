import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useBrand } from '../../../contexts/BrandContext'
import Header from '../../../components/Header/Header'
import styles from './InvoiceView.module.css'

// ── Helpers ───────────────────────────────────────────────────

function fmt(currency, amount) {
  const n = parseFloat(amount) || 0
  return `${currency}${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function calcTax(subtotal, taxRate, showTax) {
  if (!showTax || !taxRate) return 0
  return subtotal * (taxRate / 100)
}

// ── Resolve the cumulative amount paid for a receipt ──────────
// New receipts store cumulativePaid directly (the running total of
// all installments up to and including this receipt).
// Old receipts (before the fix) fall back to summing receipt.payments.
function resolveCumulativePaid(receipt) {
  if (receipt.cumulativePaid != null) {
    return parseFloat(receipt.cumulativePaid)
  }
  return (receipt.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
}

// ── Receipt-specific items table ──────────────────────────────

function ReceiptItemsTable({ receipt, brand }) {
  const { currency, showTax, taxRate } = brand

  const orderTotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    : (parseFloat(receipt.orderPrice) || 0)

  const tax = calcTax(orderTotal, taxRate, showTax)

  // cumulativePaid = total paid across ALL installments up to this receipt.
  // This is what drives the balance and summary — NOT just this receipt's payments array.
  const cumulativePaid = resolveCumulativePaid(receipt)
  const balance        = Math.max(0, orderTotal - cumulativePaid)
  const isFullPayment  = balance <= 0

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tHead}>
        <span className={styles.tColDesc}>Description</span>
        <span className={styles.tColNum}>Amount</span>
      </div>

      <div className={styles.tRowMain}>
        <div className={styles.tColDesc}>{receipt.orderDesc || 'Garment Order'}</div>
        <div className={styles.tColNum}>{fmt(currency, orderTotal)}</div>
      </div>

      {receipt.items?.length > 0 && (
        <div className={styles.itemizedSection}>
          <div className={styles.itemizedLabel}>Garments:</div>
          {receipt.items.map((item, idx) => (
            <div key={idx} className={styles.tRowSub}>
              <span className={styles.tColDesc}>• {item.name}</span>
              <span className={styles.tColNum}>{fmt(currency, item.price)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Payments Received — shows only the installment(s) on this receipt */}
      <div className={styles.itemizedSection} style={{ marginTop: 8 }}>
        <div className={styles.itemizedLabel}>Payments Received:</div>
        {(receipt.payments || []).map((p, idx) => (
          <div key={idx} className={styles.tRowSub}>
            <span className={styles.tColDesc}>
              {p.date}
              {p.method ? ` · ${p.method.charAt(0).toUpperCase() + p.method.slice(1)}` : ''}
              {receipt.payments.length > 1 ? ` (payment ${idx + 1})` : ''}
            </span>
            <span className={styles.tColNum} style={{ color: '#16a34a', fontWeight: 700 }}>
              {fmt(currency, p.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Summary — uses cumulativePaid so balance is always correct */}
      <div className={styles.summary}>
        <div className={styles.sumRow}>
          <span>Order Value</span>
          <span>{fmt(currency, orderTotal)}</span>
        </div>
        {showTax && taxRate > 0 && (
          <div className={styles.sumRow}>
            <span>Tax ({taxRate}%)</span>
            <span>{fmt(currency, tax)}</span>
          </div>
        )}
        <div className={styles.sumRow}>
          <span>Amount Paid</span>
          <span style={{ color: '#16a34a', fontWeight: 700 }}>{fmt(currency, cumulativePaid)}</span>
        </div>
        {!isFullPayment && (
          <div className={styles.sumRow}>
            <span>Balance Remaining</span>
            <span style={{ color: '#ef4444', fontWeight: 700 }}>{fmt(currency, balance)}</span>
          </div>
        )}
        <div className={`${styles.sumRow} ${styles.sumTotal}`}>
          <span>{isFullPayment ? 'PAID IN FULL' : 'AMOUNT RECEIVED'}</span>
          <span style={{ color: isFullPayment ? '#16a34a' : '#1a1a1a' }}>
            {fmt(currency, cumulativePaid)}
          </span>
        </div>
      </div>
    </div>
  )
}

function LogoOrName({ brand, darkBg = false }) {
  if (brand.logo) return <img src={brand.logo} alt={brand.name} className={styles.logoImg} />
  return (
    <div className={styles.logoText} style={{ color: darkBg ? '#fff' : '#1a1a1a' }}>
      {brand.name || 'Your Brand'}
    </div>
  )
}

// ── TEMPLATES ────────────────────────────────────────────────

function EditableTemplate({ receipt, customer, brand }) {
  return (
    <div className={styles.tplBase}>
      <div className={styles.editHeader}>
        <LogoOrName brand={brand} />
        {brand.tagline && <div className={styles.editTagline}>{brand.tagline}</div>}
        {brand.address && <div className={styles.editAddr}>{brand.address}</div>}
        <div className={styles.editTitle}>RECEIPT</div>
      </div>
      <div className={styles.metaRow}>
        <div>
          <div className={styles.metaLabel}>RECEIVED FROM</div>
          <div className={styles.metaVal}>{customer.name}</div>
          {customer.phone && <div className={styles.metaSub}>{customer.phone}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.metaLabel}>RECEIPT #</div>
          <div className={styles.metaVal}>{receipt.number}</div>
          <div className={styles.metaSub}>Date: {receipt.date}</div>
        </div>
      </div>
      <ReceiptItemsTable receipt={receipt} brand={brand} />
      <div className={styles.tplFooterPush} />
      {(brand.phone || brand.email || brand.footer) && (
        <div className={styles.editFooter}>
          <div className={styles.footSection}>
            <strong>Contact</strong><br />
            {brand.phone && <span>{brand.phone}<br /></span>}
            {brand.email && <span>{brand.email}<br /></span>}
            {brand.footer && <span>{brand.footer}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

function PrintableTemplate({ receipt, customer, brand }) {
  const barColor = brand.colour || '#eab308'
  return (
    <div className={styles.tplBase}>
      <div className={styles.printBar} style={{ background: barColor }} />
      <div className={styles.printHeaderSplit}>
        <div className={styles.printTitle}>RECEIPT</div>
        <div style={{ textAlign: 'right', fontSize: 9 }}>
          <div>DATE: <strong>{receipt.date}</strong></div>
          <div>RECEIPT #: <strong>{receipt.number}</strong></div>
        </div>
      </div>
      <div className={styles.metaRow} style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 16 }}>
        <div>
          <div className={styles.metaLabel}>FROM</div>
          <div className={styles.metaVal}>{brand.name || brand.ownerName}</div>
          {brand.address && <div className={styles.metaSub}>{brand.address}</div>}
          {brand.phone  && <div className={styles.metaSub}>{brand.phone}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.metaLabel}>RECEIVED FROM</div>
          <div className={styles.metaVal}>{customer.name}</div>
          {customer.phone && <div className={styles.metaSub}>{customer.phone}</div>}
        </div>
      </div>
      <ReceiptItemsTable receipt={receipt} brand={brand} />
      <div className={styles.tplFooterPush} />
      <div className={styles.printFooterCentered}>
        {brand.footer && <div className={styles.footSection}>{brand.footer}</div>}
      </div>
    </div>
  )
}

function CustomTemplate({ receipt, customer, brand }) {
  const bannerBg = brand.colour || '#7c3aed'
  return (
    <div className={styles.tplBase} style={{ padding: 0 }}>
      <div className={styles.customBanner} style={{ background: bannerBg }}>
        <div className={styles.customBannerLogo}><LogoOrName brand={brand} darkBg /></div>
        <div className={styles.customBannerRight}>
          <div className={styles.customBannerTitle}>RECEIPT</div>
          <div className={styles.customBannerNum}>{receipt.number}</div>
        </div>
      </div>
      <div className={styles.customBody}>
        <div className={styles.metaRow} style={{ marginBottom: 16 }}>
          <div>
            <div className={styles.metaLabel}>FROM</div>
            <div className={styles.metaVal}>{brand.name}</div>
            {brand.phone && <div className={styles.metaSub}>{brand.phone}</div>}
          </div>
          <div>
            <div className={styles.metaLabel}>RECEIVED FROM</div>
            <div className={styles.metaVal}>{customer.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.metaLabel}>DATE</div>
            <div className={styles.metaSub}>{receipt.date}</div>
          </div>
        </div>
        <ReceiptItemsTable receipt={receipt} brand={brand} />
      </div>
      <div className={styles.customFooter}>
        <div className={styles.customFooterText} style={{ color: bannerBg }}>
          {brand.footer || 'Thank you for your payment'}
        </div>
      </div>
    </div>
  )
}

function FreeTemplate({ receipt, customer, brand }) {
  return (
    <div className={styles.tplBase}>
      <div className={styles.freeHeader}>
        <div>
          <div className={styles.printTitle}>RECEIPT</div>
          <div className={styles.freeNum}>{receipt.number}</div>
        </div>
        <div className={styles.freeLogoBox}><LogoOrName brand={brand} /></div>
      </div>
      <div className={styles.freeGrid}>
        <div className={styles.freeBox}><strong>FROM</strong><br />{brand.name}<br />{brand.phone}</div>
        <div className={styles.freeBox}><strong>RECEIVED FROM</strong><br />{customer.name}<br />{customer.phone}</div>
        <div className={styles.freeBox}><strong>DATE</strong><br />{receipt.date}</div>
      </div>
      <ReceiptItemsTable receipt={receipt} brand={brand} />
      <div className={styles.tplFooterPush} />
      <div className={styles.freeFooterCentered}>{brand.footer || 'Thank you!'}</div>
    </div>
  )
}

const TEMPLATE_MAP = {
  editable:  EditableTemplate,
  printable: PrintableTemplate,
  custom:    CustomTemplate,
  free:      FreeTemplate,
}

// Fixed generatePDF function
async function generatePDF(paperEl, filename) {
  const canvas = await html2canvas(paperEl, { 
    scale: 2, 
    useCORS: true, 
    backgroundColor: '#ffffff', 
    logging: false,
    height: paperEl.scrollHeight, 
    windowHeight: paperEl.scrollHeight
  })

  const imgData = canvas.toDataURL('image/png')
  const pdfW = 450
  const pdfH = (canvas.height * pdfW) / canvas.width

  const pdf = new jsPDF({ 
    orientation: 'portrait', 
    unit: 'px', 
    format: [pdfW, pdfH] 
  })

  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
  pdf.save(filename)
}

export default function ReceiptView({ receipt: initialReceipt, customer, onClose, onDelete, showToast }) {
  const { brand } = useBrand()
  const paperRef  = useRef(null)
  const [receipt,    setReceipt]    = useState(initialReceipt)
  const [pdfLoading, setPdfLoading] = useState(false)

  const templateKey    = receipt.template || brand.template || 'editable'
  const Template       = TEMPLATE_MAP[templateKey] || EditableTemplate
  const effectiveBrand = { ...brand, ...(receipt.brandSnapshot || {}) }

  const handleShare = async () => {
    if (!paperRef.current) return
    setPdfLoading(true)
    showToast?.('Generating PDF…')
    try {
      const filename = `${receipt.number}-${customer.name.replace(/\s+/g, '_')}.pdf`
      await generatePDF(paperRef.current, filename)
      showToast?.('PDF downloaded ✓')
    } catch (err) {
      console.error(err)
      showToast?.('PDF failed.')
    } finally {
      setPdfLoading(false)
    }
  }

  // Use cumulativePaid for the status badge — same logic as the table
  const cumulativePaid = resolveCumulativePaid(receipt)
  const orderTotal     = receipt.orderPrice ? parseFloat(receipt.orderPrice) : cumulativePaid
  const isFullPay      = cumulativePaid >= orderTotal && orderTotal > 0

  return (
    <div className={styles.overlay}>
      <Header
        type="back"
        title={receipt.number}
        onBackClick={onClose}
        customActions={[
          {
            icon: pdfLoading ? 'hourglass_top' : 'download',
            onClick: handleShare,
            disabled: pdfLoading,
          }
        ]}
      />

      <div className={styles.scrollArea}>
        <div className={styles.statusRow}>
          <div className={`${styles.statusBadge} ${isFullPay ? styles.status_paid : styles.status_unpaid}`}>
            {isFullPay ? 'Paid in Full' : 'Part Payment'}
          </div>
        </div>

        <div className={styles.paperWrap} ref={paperRef}>
          <Template receipt={receipt} customer={customer} brand={effectiveBrand} />
        </div>

        {receipt.notes && (
          <div className={styles.notesBox}>
            <div className={styles.notesLabel}>Notes</div>
            <div className={styles.notesText}>{receipt.notes}</div>
          </div>
        )}
        <div style={{ height: 100 }} />
      </div>

      <div className={styles.bottomBar}>
        <button
          className={styles.statusBtnUnpaid}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, fontSize: '0.9rem', fontWeight: 800, border: '1px solid var(--border)', cursor: 'pointer' }}
          onClick={onClose}
        >
          <span className="mi" style={{ fontSize: '1rem' }}>arrow_back</span>
          Back
        </button>
        <button className={styles.deleteBtn} onClick={() => onDelete(receipt.id)}>
          <span className="mi">delete</span>
        </button>
      </div>
    </div>
  )
}
