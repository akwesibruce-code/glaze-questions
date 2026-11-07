// Phone number with a country code first. Many guests have a foreign WhatsApp
// number, or a different call line from their WhatsApp.
export const CODES = [
  ['+233', 'Ghana'], ['+1', 'US / Canada'], ['+44', 'UK'], ['+234', 'Nigeria'], ['+225', 'Côte d’Ivoire'],
  ['+228', 'Togo'], ['+229', 'Benin'], ['+226', 'Burkina Faso'], ['+27', 'South Africa'], ['+254', 'Kenya'],
  ['+49', 'Germany'], ['+33', 'France'], ['+31', 'Netherlands'], ['+971', 'UAE'], ['+86', 'China'],
]

export const fmtPhone = p => (p && p.num ? `${p.cc} ${p.num}` : '')

export default function PhoneInput({ id, label, hint, value, onChange, optional }) {
  const v = value || { cc: '+233', num: '' }
  return (
    <div className="field">
      <label htmlFor={id}>{label}{optional && <span style={{ fontWeight: 400, color: 'var(--muted)' }}> (optional)</span>}</label>
      {hint && <span className="hint">{hint}</span>}
      <div className="phone-in">
        <select aria-label={`${label}: country code`} value={v.cc} onChange={e => onChange({ ...v, cc: e.target.value })}>
          {CODES.map(([c, n]) => <option key={c + n} value={c}>{c} {n}</option>)}
        </select>
        <input id={id} type="tel" inputMode="tel" autoComplete="tel-national" placeholder={v.cc === '+233' ? '55 324 6316' : 'Number'} value={v.num} onChange={e => onChange({ ...v, num: e.target.value })} />
      </div>
    </div>
  )
}
