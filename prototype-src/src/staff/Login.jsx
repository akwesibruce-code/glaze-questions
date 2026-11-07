import { useState } from 'react'
import { logo, img } from '../assets.js'
import { ROLES } from '../data.js'

// Staff only. Customers never see this page: it lives at its own address
// (e.g. staff.glazegh.com) and every person has their own login.
export default function Login({ onIn }) {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const standalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone)
  return (
    <div className="login">
      <div className="lpanel">
        <img className="llogo" src={logo} alt="Glaze Art Studio" />
        <h1 className="lc">staff sign in</h1>
        <p>For the Glaze team only. Customers use glazegh.com.</p>
        <form className="lform" onSubmit={e => { e.preventDefault(); setErr('In the prototype, use one of the buttons below to sign in.') }}>
          <div className="field"><label htmlFor="lp">Phone number</label><input id="lp" type="tel" autoComplete="username" value={phone} onChange={e => setPhone(e.target.value)} placeholder="055 000 0000" /></div>
          <div className="field"><label htmlFor="lpin">PIN</label><input id="lpin" type="password" inputMode="numeric" autoComplete="current-password" value={pin} onChange={e => setPin(e.target.value)} placeholder="4 digits" /></div>
          <button className="btn y full" type="submit">Sign in</button>
          {err && <div className="note info" role="status">{err}</div>}
        </form>
        <div className="lproto">
          <b>Prototype: sign in as</b>
          <div className="lroles">
            {Object.entries(ROLES).map(([k, r]) => (
              <button key={k} className="lrole" onClick={() => onIn(k)}>
                <span className="av" aria-hidden="true">{r.name[0]}</span>
                <span><b>{r.name}</b><small>{k === 'darlene' ? 'Owner · sees everything' : k === 'frontdesk' ? 'Bookings, sales, stock' : k === 'lead' ? 'Bookings, lessons, stock' : 'Bookings, money, workshops, staff log'}</small></span>
              </button>
            ))}
          </div>
        </div>
        {!standalone && <div className="install">
          <b>Use it like an app</b>
          <span>On iPhone: tap Share, then “Add to Home Screen”. On Android: tap the ⋮ menu, then “Install app”. A Glaze Staff icon appears on the phone.</span>
        </div>}
      </div>
      <div className="lart" aria-hidden="true"><img src={img('apron')} alt="" /></div>
    </div>
  )
}
