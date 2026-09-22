export const currency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
})

export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
