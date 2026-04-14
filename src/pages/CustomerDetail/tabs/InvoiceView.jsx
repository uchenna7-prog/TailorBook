import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useBrand } from '../../../contexts/BrandContext'
import Header from '../../../components/Header/Header'
import styles from './InvoiceView.module.css'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function fmt(currency, amount) {
  const n = parseFloat(amount) || 0
  return `${currency}${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function calcTax(subtotal, taxRate, showTax) {
  if (!showTax || !taxRate) return 0
  return subtotal * (taxRate / 100)
}

function getDueDate(invoice, dueDays) {
  if (invoice.due) return invoice.due
  try {
    const d = new Date(invoice.date)
    d.setDate(d.getDate() + (dueDays || 7))
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '—' }
}

// Strips all non-digit characters then removes a leading zero
// so "+234 803 329 9895" → "2348033299895" (WhatsApp format)
function sanitizePhone(raw) {
  if (!raw) return ''
  return raw.replace(/\D/g, '').replace(/^0/, '')
}

// ─────────────────────────────────────────────────────────────
// Build WhatsApp message for an invoice
// ─────────────────────────────────────────────────────────────

function buildInvoiceWhatsAppMessage(invoice, customer, brand) {
  const currency   = brand?.currency || '₦'
  const subtotal   = invoice.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const tax        = calcTax(subtotal, brand?.taxRate, brand?.showTax)
  const total      = subtotal + tax

  const firstName = customer.name?.split(' ')[0] || customer.name

  const statusMap = { paid: 'Fully Paid ✅', part_paid: 'Part Payment', unpaid: 'Unpaid', overdue: 'Overdue ⚠️' }
  const statusLine = statusMap[invoice.status] || invoice.status

  let lines = []
  lines.push(`Hi ${firstName},`)
  lines.push('')
  lines.push(`Here is your invoice from *${brand?.name || 'us'}*. 🧾`)
  lines.push('')
  lines.push(`*Invoice Details*`)
  lines.push(`Invoice No: *${invoice.number}*`)
  lines.push(`Date: ${invoice.date}`)
  if (invoice.due) lines.push(`Due Date: ${invoice.due}`)
  lines.push(`Status: ${statusLine}`)
  lines.push('')

  if (invoice.items?.length > 0) {
    lines.push(`*Breakdown*`)
    invoice.items.forEach(item => {
      lines.push(`• ${item.name} — ${fmt(currency, item.price)}`)
    })
    lines.push('')
  }

  if (brand?.showTax && brand?.taxRate > 0) {
    lines.push(`Subtotal: ${fmt(currency, subtotal)}`)
    lines.push(`Tax (${brand.taxRate}%): ${fmt(currency, tax)}`)
  }
  lines.push(`*Total: ${fmt(currency, total)}*`)
  lines.push('')
  lines.push(`📎 The PDF copy of this invoice has been downloaded to your device. Please find and attach it to this message before sending.`)
  lines.push('')
  if (brand?.phone) lines.push(`For any questions, reach us at ${brand.phone}.`)
  lines.push(`Thank you! 🙏`)

  return lines.join('\n')
}

// ─────────────────────────────────────────────────────────────
// PDF generator
// ─────────────────────────────────────────────────────────────

async function downloadPDF(paperEl, filename) {
  const canvas = await html2canvas(paperEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    height: paperEl.scrollHeight,
    windowHeight: paperEl.scrollHeight,
  })
  const imgData = canvas.toDataURL('image/png')
  const pdfW = 450
  const pdfH = (canvas.height * pdfW) / canvas.width
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [pdfW, pdfH] })
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
  pdf.save(filename)
}

// ─────────────────────────────────────────────────────────────
// Share Sheet
// ─────────────────────────────────────────────────────────────

function ShareSheet({ open, onClose, onDownload, docNumber, customer, brand, docType, buildMessage }) {
  const [copied,       setCopied]       = useState(false)
  const [sharing,      setSharing]      = useState(false)
  const [pdfReady,     setPdfReady]     = useState(false)
  const [showPdfHint,  setShowPdfHint]  = useState(false)

  if (!open) return null

  const phoneRaw    = customer?.phone || ''
  const phoneClean  = sanitizePhone(phoneRaw)
  const hasPhone    = phoneClean.length >= 7
  const message     = buildMessage()
  const shareText   = `${docType} ${docNumber} for ${customer?.name}`

  // Download PDF first, then open target app
  const handleMessagingApp = async (openUrl) => {
    setSharing(true)
    setShowPdfHint(false)
    try {
      await onDownload()
      setPdfReady(true)
      setShowPdfHint(true)
    } catch {
      // PDF failed — still open the app
    } finally {
      setSharing(false)
    }
    window.open(openUrl, '_blank', 'noopener')
  }

  const handleWhatsApp = () => {
    const url = hasPhone
      ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`
    handleMessagingApp(url)
  }

  const handleTelegram = () => {
    handleMessagingApp(`https://t.me/share/url?url=${encodeURIComponent(shareText)}&text=${encodeURIComponent(message)}`)
  }

  const handleSMS = () => {
    handleMessagingApp(`sms:${phoneRaw}?body=${encodeURIComponent(message)}`)
  }

  const handleEmail = () => {
    const subject = `${docType} ${docNumber} — ${customer?.name}`
    const body    = `${message}\n\n(PDF attached separately)`
    handleMessagingApp(`mailto:${customer?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  const handleNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: shareText, text: message }) } catch { /* cancelled */ }
    }
  }

  const APPS = [
    {
      id: 'whatsapp', label: 'WhatsApp', onClick: handleWhatsApp,
      icon: (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="16" fill="#25D366"/>
          <path d="M23.5 8.5A10.44 10.44 0 0016.01 5.5C10.76 5.5 6.5 9.76 6.5 15.01c0 1.68.44 3.32 1.28 4.77L6.4 25.6l5.97-1.57a10.43 10.43 0 004.63 1.08h.01c5.25 0 9.51-4.26 9.51-9.51A9.44 9.44 0 0023.5 8.5zm-7.49 14.64h-.01a8.66 8.66 0 01-4.42-1.21l-.32-.19-3.3.87.88-3.22-.2-.33a8.67 8.67 0 01-1.33-4.65c0-4.79 3.9-8.69 8.7-8.69a8.64 8.64 0 016.15 2.55 8.64 8.64 0 012.54 6.15c0 4.8-3.9 8.72-8.69 8.72zm4.77-6.51c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.66.85-.81 1.02-.15.17-.3.19-.56.06-.26-.13-1.1-.4-2.09-1.29-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.91-.21-.5-.42-.43-.58-.44l-.49-.01c-.17 0-.45.06-.68.32-.23.26-.89.87-.89 2.12s.91 2.46 1.04 2.63c.13.17 1.79 2.73 4.34 3.83.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.5-.61 1.71-1.21.21-.6.21-1.11.15-1.21-.06-.1-.23-.16-.49-.29z" fill="#fff"/>
        </svg>
      ),
    },
    {
      id: 'telegram', label: 'Telegram', onClick: handleTelegram,
      icon: (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="16" fill="#229ED9"/>
          <path d="M22.8 9.6L6.4 15.9c-1.1.4-1.1 1.1-.2 1.4l4 1.2 1.5 4.7c.2.5.4.7.8.7.3 0 .5-.1.7-.3l2.4-2.3 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.2-.4-1.7-1.3-1.3zm-9.5 9l-.3 3.2-1.3-4.1 9.8-6.2-8.2 7.1z" fill="#fff"/>
        </svg>
      ),
    },
    {
      id: 'sms', label: 'SMS', onClick: handleSMS,
      icon: (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="16" fill="#34C759"/>
          <path d="M22 9H10a2 2 0 00-2 2v8a2 2 0 002 2h2l2 3 2-3h6a2 2 0 002-2v-8a2 2 0 00-2-2z" fill="#fff"/>
          <circle cx="12" cy="15" r="1.3" fill="#34C759"/>
          <circle cx="16" cy="15" r="1.3" fill="#34C759"/>
          <circle cx="20" cy="15" r="1.3" fill="#34C759"/>
        </svg>
      ),
    },
    {
      id: 'email', label: 'Email', onClick: handleEmail,
      icon: (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="16" fill="#EA4335"/>
          <path d="M24 11H8a1 1 0 00-1 1v9a1 1 0 001 1h16a1 1 0 001-1v-9a1 1 0 00-1-1zm-1.5 2L16 17.5 9.5 13h13zm.5 8H9v-7.3l7 4.8 7-4.8V21z" fill="#fff"/>
        </svg>
      ),
    },
    {
      id: 'copy', label: copied ? 'Copied!' : 'Copy Text', onClick: handleCopy,
      icon: (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="16" fill="#6366f1"/>
          <path d="M20 8h-8a2 2 0 00-2 2v11h2V10h8V8zm3 4h-7a2 2 0 00-2 2v10a2 2 0 002 2h7a2 2 0 002-2V14a2 2 0 00-2-2zm0 12h-7V14h7v10z" fill="#fff"/>
        </svg>
      ),
    },
    {
      id: 'native', label: 'More', onClick: handleNative,
      icon: (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="16" fill="#8e8e93"/>
          <circle cx="10" cy="16" r="2.2" fill="#fff"/>
          <circle cx="16" cy="16" r="2.2" fill="#fff"/>
          <circle cx="22" cy="16" r="2.2" fill="#fff"/>
        </svg>
      ),
    },
  ]

  return (
    <div className={styles.sheetBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetTitle}>Share {docType}</div>
        <div className={styles.sheetSub}>{docNumber} · {customer?.name}</div>

        {/* PDF hint banner — shown after download triggered */}
        {showPdfHint && (
          <div className={styles.pdfHint}>
            <span className="mi" style={{ fontSize: '1rem', flexShrink: 0 }}>info</span>
            <span>PDF downloaded to your device. Open your Files app, find the PDF and attach it to this conversation.</span>
          </div>
        )}

        <div className={styles.shareGrid}>
          {APPS.map(app => (
            <button
              key={app.id}
              className={styles.shareItem}
              onClick={app.onClick}
              disabled={sharing}
            >
              <div className={styles.shareIconWrap}>
                {sharing && ['whatsapp','telegram','sms','email'].includes(app.id)
                  ? <span className="mi" style={{ fontSize: 26, color: 'var(--text3)' }}>hourglass_top</span>
                  : app.icon
                }
              </div>
              <span className={styles.shareLabel}>{app.label}</span>
            </button>
          ))}
        </div>

        <button
          className={styles.sheetDownloadBtn}
          onClick={async () => { await onDownload(); onClose() }}
          disabled={sharing}
        >
          <span className="mi" style={{ fontSize: '1.1rem' }}>download</span>
          Download PDF
        </button>

        <button className={styles.sheetCancelBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Shared inner pieces
// ─────────────────────────────────────────────────────────────

function LogoOrName({ brand, darkBg = false }) {
  if (brand.logo) return <img src={brand.logo} alt={brand.name} className={styles.logoImg} />
  return (
    <div className={styles.logoText} style={{ color: darkBg ? '#fff' : '#1a1a1a' }}>
      {brand.name || 'Your Brand'}
    </div>
  )
}

function ItemsTable({ invoice, brand }) {
  const { currency, showTax, taxRate } = brand
  const subtotal = invoice.items?.length > 0
    ? invoice.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    : 0
  const tax   = calcTax(subtotal, taxRate, showTax)
  const total = subtotal + tax

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tHead}>
        <span className={styles.tColDesc}>Description</span>
        <span className={styles.tColNum}>Price</span>
      </div>
      <div className={styles.tRowMain}>
        <div className={styles.tColDesc}>{invoice.orderDesc || 'Garment Order'}</div>
        <div className={styles.tColNum}>{fmt(currency, subtotal)}</div>
      </div>
      {invoice.items?.length > 0 && (
        <div className={styles.itemizedSection}>
          <div className={styles.itemizedLabel}>Garments Included:</div>
          {invoice.items.map((item, idx) => (
            <div key={idx} className={styles.tRowSub}>
              <span className={styles.tColDesc}>• {item.name}</span>
              <span className={styles.tColNum}>{fmt(currency, item.price)}</span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.summary}>
        <div className={styles.sumRow}><span>Subtotal</span><span>{fmt(currency, subtotal)}</span></div>
        {showTax && taxRate > 0 && (
          <div className={styles.sumRow}><span>Tax ({taxRate}%)</span><span>{fmt(currency, tax)}</span></div>
        )}
        <div className={`${styles.sumRow} ${styles.sumTotal}`}>
          <span>Total Due</span><span>{fmt(currency, total)}</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────────────────────────

function EditableTemplate({ invoice, customer, brand }) {
  const dueDate = getDueDate(invoice, brand.dueDays)
  return (
    <div className={styles.tplBase}>
      <div className={styles.editHeader}>
        <LogoOrName brand={brand} />
        {brand.tagline && <div className={styles.editTagline}>{brand.tagline}</div>}
        {brand.address && <div className={styles.editAddr}>{brand.address}</div>}
        <div className={styles.editTitle}>INVOICE</div>
      </div>
      <div className={styles.metaRow}>
        <div>
          <div className={styles.metaLabel}>BILL TO</div>
          <div className={styles.metaVal}>{customer.name}</div>
          {customer.phone && <div className={styles.metaSub}>{customer.phone}</div>}
          {customer.address && <div className={styles.metaSub}>{customer.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.metaLabel}>INVOICE #</div>
          <div className={styles.metaVal}>{invoice.number}</div>
          <div className={styles.metaSub}>Issue: {invoice.date}</div>
          <div className={styles.metaSub}>Due: {dueDate}</div>
        </div>
      </div>
      <ItemsTable invoice={invoice} brand={brand} />
      <div className={styles.tplFooterPush} />
      {(brand.phone || brand.email || brand.footer) && (
        <div className={styles.editFooter}>
          <div className={styles.footSection}>
            <strong>Payment / Contact</strong><br />
            {brand.phone && <span>{brand.phone}<br /></span>}
            {brand.email && <span>{brand.email}<br /></span>}
            {brand.footer && <span>{brand.footer}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

function PrintableTemplate({ invoice, customer, brand }) {
  const dueDate  = getDueDate(invoice, brand.dueDays)
  const barColor = brand.colour || '#eab308'
  return (
    <div className={styles.tplBase}>
      <div className={styles.printBar} style={{ background: barColor }} />
      <div className={styles.printHeaderSplit}>
        <div className={styles.printTitle}>INVOICE</div>
        <div style={{ textAlign: 'right', fontSize: 9 }}>
          <div>ISSUE DATE: <strong>{invoice.date}</strong></div>
          <div>DUE DATE: <strong>{dueDate}</strong></div>
        </div>
      </div>
      <div className={styles.metaRow}>
        <div>
          <div className={styles.metaLabel}>BILL FROM</div>
          <div className={styles.metaVal}>{brand.name}</div>
          {brand.phone && <div className={styles.metaSub}>{brand.phone}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.metaLabel}>BILL TO</div>
          <div className={styles.metaVal}>{customer.name}</div>
          {customer.phone && <div className={styles.metaSub}>{customer.phone}</div>}
        </div>
      </div>
      <ItemsTable invoice={invoice} brand={brand} />
      <div className={styles.tplFooterPush} />
      <div className={styles.printFooterCentered}>
        {brand.footer && <div className={styles.footSection}>{brand.footer}</div>}
      </div>
    </div>
  )
}

function CustomTemplate({ invoice, customer, brand }) {
  const bannerBg = brand.colour || '#7c3aed'
  return (
    <div className={styles.tplBase} style={{ padding: 0 }}>
      <div className={styles.customBanner} style={{ background: bannerBg }}>
        <div className={styles.customBannerLogo}><LogoOrName brand={brand} darkBg /></div>
        <div className={styles.customBannerRight}>
          <div className={styles.customBannerTitle}>INVOICE</div>
          <div className={styles.customBannerNum}>{invoice.number}</div>
        </div>
      </div>
      <div className={styles.customBody}>
        <div className={styles.metaRow} style={{ marginBottom: 16 }}>
          <div>
            <div className={styles.metaLabel}>BILL FROM</div>
            <div className={styles.metaVal}>{brand.name}</div>
            {brand.phone && <div className={styles.metaSub}>{brand.phone}</div>}
          </div>
          <div>
            <div className={styles.metaLabel}>BILL TO</div>
            <div className={styles.metaVal}>{customer.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.metaLabel}>DATE</div>
            <div className={styles.metaSub}>{invoice.date}</div>
          </div>
        </div>
        <ItemsTable invoice={invoice} brand={brand} />
      </div>
      <div className={styles.customFooter}>
        <div className={styles.customFooterText} style={{ color: bannerBg }}>{brand.footer || 'Thank you for your patronage'}</div>
      </div>
    </div>
  )
}

function FreeTemplate({ invoice, customer, brand }) {
  const dueDate = getDueDate(invoice, brand.dueDays)
  return (
    <div className={styles.tplBase}>
      <div className={styles.freeHeader}>
        <div><div className={styles.printTitle}>INVOICE</div><div className={styles.freeNum}>{invoice.number}</div></div>
        <div className={styles.freeLogoBox}><LogoOrName brand={brand} /></div>
      </div>
      <div className={styles.freeGrid}>
        <div className={styles.freeBox}><strong>BILL FROM</strong><br />{brand.name}<br />{brand.phone}</div>
        <div className={styles.freeBox}><strong>BILL TO</strong><br />{customer.name}<br />{customer.phone}</div>
        <div className={styles.freeBox}><strong>DETAILS</strong><br />Date: {invoice.date}<br />Due: {dueDate}</div>
      </div>
      <ItemsTable invoice={invoice} brand={brand} />
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

const STATUS_LABELS = {
  unpaid:    'Unpaid',
  part_paid: 'Part Payment',
  paid:      'Full Payment',
  overdue:   'Overdue',
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function InvoiceView({ invoice: initialInvoice, customer, onClose, onStatusChange, onDelete, showToast }) {
  const { brand } = useBrand()
  const paperRef  = useRef(null)
  const [invoice,    setInvoice]    = useState(initialInvoice)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [showShare,  setShowShare]  = useState(false)

  const templateKey    = invoice.template || brand.template || 'editable'
  const Template       = TEMPLATE_MAP[templateKey] || EditableTemplate
  const effectiveBrand = { ...brand, ...(invoice.brandSnapshot || {}) }
  const filename       = `Invoice-${invoice.number}-${customer.name.replace(/\s+/g, '_')}.pdf`

  const handleDownload = async () => {
    if (!paperRef.current) return
    setPdfLoading(true)
    showToast?.('Generating PDF…')
    try {
      await downloadPDF(paperRef.current, filename)
      showToast?.('PDF downloaded ✓')
    } catch {
      showToast?.('PDF failed.')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <Header
        type="back"
        title={invoice.number}
        onBackClick={onClose}
        customActions={[
          {
            icon: pdfLoading ? 'hourglass_top' : 'download',
            onClick: handleDownload,
            disabled: pdfLoading,
          },
          {
            icon: 'share',
            onClick: () => setShowShare(true),
          },
          {
            icon: 'delete',
            onClick: () => onDelete(invoice.id),
            style: { color: '#ef4444' },
          },
        ]}
      />

      <div className={styles.scrollArea}>
        <div className={styles.statusRow}>
          <div className={`${styles.statusBadge} ${styles[`status_${invoice.status}`]}`}>
            {STATUS_LABELS[invoice.status] || invoice.status}
          </div>
        </div>
        <div className={styles.paperWrap} ref={paperRef}>
          <Template invoice={invoice} customer={customer} brand={effectiveBrand} />
        </div>
        {invoice.notes && (
          <div className={styles.notesBox}>
            <div className={styles.notesLabel}>Notes</div>
            <div className={styles.notesText}>{invoice.notes}</div>
          </div>
        )}
        <div style={{ height: 32 }} />
      </div>

      <ShareSheet
        open={showShare}
        onClose={() => setShowShare(false)}
        onDownload={handleDownload}
        docNumber={invoice.number}
        customer={customer}
        brand={effectiveBrand}
        docType="Invoice"
        buildMessage={() => buildInvoiceWhatsAppMessage(invoice, customer, effectiveBrand)}
      />
    </div>
  )
}
