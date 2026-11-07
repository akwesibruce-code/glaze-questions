// What each stock line needs, given the two levels:
// the office store room (feeds the studio floor) and bulk storage (refills the office).
export function needs(s) {
  const officeLow = s.office < s.minOffice
  const hasStorage = s.storage !== null && s.storage !== undefined
  if (hasStorage && s.storage < s.minStorage) return { kind: 'reorder', label: officeLow && s.storage > 0 ? 'Refill office · reorder' : 'Reorder' }
  if (officeLow && hasStorage && s.storage > 0) return { kind: 'refill', label: 'Refill from storage' }
  if (officeLow) return { kind: 'buy', label: 'Running low' }
  return null
}

export function refillAmount(s) {
  return Math.max(0, Math.min(s.storage || 0, s.minOffice * 2 - s.office))
}

export function waLink(phone, text) {
  const digits = (phone || '').replace(/[^\d]/g, '')
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : ''
}

export function csv(rows) {
  return rows.map(r => r.map(v => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }).join(',')).join('\n')
}

export function download(name, text) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }))
  a.download = name
  document.body.appendChild(a); a.click(); a.remove()
}
