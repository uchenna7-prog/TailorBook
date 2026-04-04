// src/pages/CustomerDetail/tabs/ReceiptView.jsx
// Reuses the same 4 templates as InvoiceView but:
//  - "INVOICE" -> "RECEIPT"
//  - "BILL TO" -> "RECEIVED FROM"
//  - Shows payment breakdown (installments) instead of "Total Due"
//  - Shows balance if part-payment, "PAID IN FULL" if complete

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useBrand } from '../../../contexts/BrandContext'
import Header from '../../../components/Header/Header'
import styles from './InvoiceView.module.css'   // reuse the same CSS — all classes apply

// ── Helpers ───────────────────────────────────────────────────

function fmt(currency, amount) {
  const n = parseFloat(amount) || 0
  return `${currency}${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function calcTax(subtotal, taxRate, showTax) {
  if (!showTax || !taxRate) return 0
  return subtotal * (taxRate / 100)
}

// ── Receipt-specific items table ──────────────────────────────
// Shows the order garments AND the payment history.

function ReceiptItemsTable({ receipt, brand }) {
  const { currency, showTax, taxRate } = brand

  const orderTotal = receipt.items?.length > 0
    ? receipt.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    : (parseFloat(receipt.orderPrice) || 0)

  const tax          = calcTax(orderTotal, taxRate, showTax)
  const totalPaid    = (receipt.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
  const balance      = Math.max(0, orderTotal - totalPaid)
  const isFullPayment = balance <= 0

  return (
    <div className={styles.tableWrapper}>
      {/* Order breakdown section */}
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

      {/* Payment history section */}
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

      {/* Summary */}
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
          <span style={{ color: '#16a34a', fontWeight: 700 }}>{fmt(currency, totalPaid)}</span>
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
            {fmt(currency, totalPaid)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Shared logo/name component ────────────────────────────────

function LogoOrName({ brand, darkBg = false }) {
  if (brand.logo) return <img src={brand.logo} alt={brand.name} className={styles.logoImg} />
  return (
    <div className={styles.logoText} style={{ color: darkBg ? '#fff' : '#1a1a1a' }}>
      {brand.name || 'Your Brand'}
    </div>
  )
}

// ── TEMPLATES (same 4 layouts, receipt-flavoured) ─────────────

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

async function generatePDF(paperEl, filename) {
  const canvas = await html2canvas(paperEl, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
  const pdfW = pdf.internal.pageSize.getWidth()
  const pdfH = (canvas.height * pdfW) / canvas.width
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
  pdf.save(filename)
}

// ── Main export ───────────────────────────────────────────────

export default function ReceiptView({ receipt: initialReceipt, customer, onClose, onDelete, showToast }) {
  const { brand } = useBrand()
  const paperRef  = useRef(null)
  const [receipt,    setReceipt]    = useState(initialReceipt)
  const [pdfLoading, setPdfLoading] = useState(false)

  // Honour the template that was active at generation time
  const templateKey  = receipt.template || brand.template || 'editable'
  const Template     = TEMPLATE_MAP[templateKey] || EditableTemplate
  const effectiveBrand = { ...brand, ...(receipt.brandSnapshot || {}) }

  const handleShare = async () => {
    if (!paperRef.current) return
    setPdfLoading(true)
    showToast?.('Generating PDF…')
    try {
      const filename = `${receipt.number}-${customer.name.replace(/\s+/g, '_')}.pdf`
      await generatePDF(paperRef.current, filename)
      showToast?.('PDF downloaded ✓')
    } catch {
      showToast?.('PDF failed.')
    } finally {
      setPdfLoading(false)
    }
  }

  const totalPaid  = (receipt.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
  const orderTotal = receipt.orderPrice ? parseFloat(receipt.orderPrice) : totalPaid
  const isFullPay  = totalPaid >= orderTotal && orderTotal > 0

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
        <button className={styles.statusBtnUnpaid} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, fontSize: '0.9rem', fontWeight: 800, border: '1px solid var(--border)', cursor: 'pointer' }}
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
