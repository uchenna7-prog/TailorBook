
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export function fmt(currency, amount) {
  const n = parseFloat(amount) || 0
  return `${currency}${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function calcTax(subtotal, taxRate, showTax) {
  if (!showTax || !taxRate) return 0
  return subtotal * (taxRate / 100)
}

export function getDueDate(invoice, dueDays) {
  if (invoice.due) return invoice.due
  try {
    const d = new Date(invoice.date)
    d.setDate(d.getDate() + (dueDays || 7))
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '—' }
}


export function sanitizePhone(raw) {
  if (!raw) return ''
  return raw.replace(/\D/g, '').replace(/^0/, '')
}


