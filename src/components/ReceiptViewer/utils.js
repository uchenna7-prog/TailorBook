// ── Helpers ───────────────────────────────────────────────────


export function resolveCumulativePaid(receipt) {
  if (receipt.cumulativePaid != null) return parseFloat(receipt.cumulativePaid)
  return (receipt.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
}

export function sanitizePhone(raw) {
  if (!raw) return ''
  return raw.replace(/\D/g, '').replace(/^0/, '')
}

// ─────────────────────────────────────────────────────────────
// Derive CSS brand variables from a hex colour so the paper
// element is fully isolated from the global --brand-* tokens
// set by useBrandTokens. Without this, changing your brand
// colour in Profile would bleed into already-generated docs
// because the CSS module's var(--brand-*) always reads the
// live global values, even when effectiveBrand.colour is
// correctly set from the snapshot.
//
// We inject these as inline CSS variables on the paperInner
// wrapper — they cascade into every template child element
// that uses var(--brand-primary) etc., overriding the globals.
// ─────────────────────────────────────────────────────────────
export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function luminance({ r, g, b }) {
  const ch = [r, g, b].map(v => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}

export function mixHex(hex, white, ratio) {
  // ratio: 0 = full hex, 1 = full white
  const { r, g, b } = hexToRgb(hex)
  const wr = parseInt(white.slice(1, 3), 16)
  const wg = parseInt(white.slice(3, 5), 16)
  const wb = parseInt(white.slice(5, 7), 16)
  const mix = (a, wv) => Math.round(a + (wv - a) * ratio)
  const toHex = v => v.toString(16).padStart(2, '0')
  return `#${toHex(mix(r, wr))}${toHex(mix(g, wg))}${toHex(mix(b, wb))}`
}

export function darkenHex(hex, ratio) {
  const { r, g, b } = hexToRgb(hex)
  const d = v => Math.round(v * (1 - ratio))
  const toHex = v => v.toString(16).padStart(2, '0')
  return `#${toHex(d(r))}${toHex(d(g))}${toHex(d(b))}`
}

export function getBrandCSSVars(colour) {
  const hex = colour || '#D4AF37'
  const rgb = hexToRgb(hex)
  const lum = luminance(rgb)
  // On-primary text: white for dark colours, near-black for light ones
  const onPrimary = lum > 0.35 ? '#1a1a1a' : '#ffffff'
  const primary     = hex
  const primaryDark = darkenHex(hex, 0.25)
  const muted       = mixHex(hex, '#ffffff', 0.75)   // 25% colour, 75% white
  const surface     = mixHex(hex, '#ffffff', 0.92)   // very light tint
  const gradient    = hex   // for templates that use var(--brand-gradient) as a solid

  return {
    '--brand-primary':      primary,
    '--brand-primary-dark': primaryDark,
    '--brand-gradient':     gradient,
    '--brand-on-primary':   onPrimary,
    '--brand-muted':        muted,
    '--brand-surface':      surface,
  }
}

// ── Build WhatsApp message for a receipt ─────────────────────

export function buildReceiptWhatsAppMessage(receipt, customer, brand) {
  const currency       = brand?.currency || '₦'
  const firstName      = customer.name?.split(' ')[0] || customer.name
  const thisPayment    = (receipt.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
  const cumulativePaid = resolveCumulativePaid(receipt)
  const orderTotal     = receipt.orderPrice ? parseFloat(receipt.orderPrice)
    : receipt.items?.reduce((s, i) => s + (parseFloat(i.price) || 0), 0) ?? 0
  const balanceLeft    = Math.max(0, orderTotal - cumulativePaid)
  const isFullPay      = balanceLeft <= 0

  let lines = []
  lines.push(`Hi ${firstName},`)
  lines.push('')
  lines.push(`Here is your payment receipt from *${brand?.name || 'us'}*. 🧾`)
  lines.push('')
  lines.push(`*Receipt Details*`)
  lines.push(`Receipt No: *${receipt.number}*`)
  lines.push(`Date: ${receipt.date}`)
  lines.push('')

  if (receipt.items?.length > 0) {
    lines.push(`*Order Breakdown*`)
    receipt.items.forEach(item => {
      lines.push(`• ${item.name} — ${fmt(currency, item.price)}`)
    })
    lines.push(`Order Total: ${fmt(currency, orderTotal)}`)
    lines.push('')
  }

  if ((receipt.payments || []).length > 0) {
    lines.push(`*Payment${receipt.payments.length > 1 ? 's' : ''} Received*`)
    receipt.payments.forEach((p, idx) => {
      const label = receipt.payments.length > 1 ? `Payment ${idx + 1}` : 'Amount Paid'
      const method = p.method ? ` (${p.method.charAt(0).toUpperCase() + p.method.slice(1)})` : ''
      lines.push(`${label}${method}: *${fmt(currency, p.amount)}*`)
    })
    lines.push('')
  }

  if (isFullPay) {
    lines.push(`✅ *Your order is fully paid. Thank you!*`)
  } else {
    lines.push(`Balance Remaining: *${fmt(currency, balanceLeft)}*`)
    lines.push(`Please note there is an outstanding balance on your order.`)
  }

  lines.push('')
  lines.push(`📎 The PDF copy of this receipt has been downloaded to your device. Please find and attach it to this message before sending.`)
  lines.push('')
  if (brand?.phone) lines.push(`For any questions, reach us at ${brand.phone}.`)
  lines.push(`Thank you! 🙏`)

  return lines.join('\n')
}

// ── PDF generator ─────────────────────────────────────────────

export async function downloadPDF(paperEl, filename) {
  const blob = await generatePDFBlob(paperEl)
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

export async function generatePDFBlob(paperEl) {
  const PDF_W = 380
  const prevWidth  = paperEl.style.width
  const prevMaxW   = paperEl.style.maxWidth

  paperEl.style.width    = `${PDF_W}px`
  paperEl.style.maxWidth = 'none'

  await new Promise(r => setTimeout(r, 60))
  const elH = paperEl.scrollHeight

  const canvas = await html2canvas(paperEl, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: PDF_W,
    height: elH,
    windowWidth: PDF_W,
    windowHeight: elH,
  })

  paperEl.style.width    = prevWidth
  paperEl.style.maxWidth = prevMaxW

  const imgData = canvas.toDataURL('image/png')
  const pdf     = new jsPDF({ orientation: 'portrait', unit: 'px', format: [PDF_W, elH] })
  pdf.addImage(imgData, 'PNG', 0, 0, PDF_W, elH)
  return pdf.output('blob')
}




// ─────────────────────────────────────────────────────────────
// Shared helper: build the full ordered list of payment rows
// (previous installments greyed + current ones bold/green)
// Used by ALL templates for consistent payment history display.
// ─────────────────────────────────────────────────────────────
export function buildPaymentRows(receipt) {
  const previousInstallments = receipt.previousInstallments || []
  const currentPayments      = receipt.payments || []
  const hasPrevious          = previousInstallments.length > 0 ||
    (parseFloat(receipt.previousPaid) > 0 && previousInstallments.length === 0)

  let rows = []

  // Previous installments (greyed out)
  if (previousInstallments.length > 0) {
    previousInstallments.forEach((p, idx) => {
      rows.push({ ...p, _isCurrent: false, _sn: idx + 1 })
    })
  } else if (parseFloat(receipt.previousPaid) > 0) {
    // Legacy: no per-installment breakdown, just a lump sum
    rows.push({
      id: '__prev__',
      amount: receipt.previousPaid,
      date: 'Prior payments',
      method: null,
      _isCurrent: false,
      _sn: 1,
    })
  }

  const offset = rows.length

  // Current installments (bold green)
  currentPayments.forEach((p, idx) => {
    rows.push({ ...p, _isCurrent: true, _sn: offset + idx + 1 })
  })

  return rows
}
