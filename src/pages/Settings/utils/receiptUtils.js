
export function rFmt(amount) {
  const n = parseFloat(amount) || 0
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function rResolvePaid(receipt) {
  if (receipt.cumulativePaid != null) return parseFloat(receipt.cumulativePaid)
  return (receipt.payments || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)
}