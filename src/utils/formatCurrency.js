export function formatCurrency(currency, amount,minimumFractionDigits=2, maximumFractionDigits=2) {

  const number = parseFloat(amount) || 0
  return `${currency}${number.toLocaleString('en-NG', { minimumFractionDigits: minimumFractionDigits, maximumFractionDigits:  maximumFractionDigits })}`
  
}