import { useState, useEffect } from 'react'
import { useStore, go } from '../store.jsx'
import { logo } from '../assets.js'
import { ROLES } from '../data.js'
import Today from './Today.jsx'
import Requests from './Requests.jsx'
import { Bookings, WorkshopsAdmin } from './Bookings.jsx'
import Money from './Money.jsx'
import Stock from './Stock.jsx'
import Tools from './Tools.jsx'

const TABS = [
  ['', 'Today', () => true],
  ['requests', 'Event requests', c => c.bookings],
  ['bookings', 'Bookings', c => c.bookings],
  ['workshops', 'Workshops', c => c.bookings],
  ['money', 'Money', c => c.money],
  ['stock', 'Stock', c => c.stock],
  ['tools', 'Staff tools', c => c.tools],
]

export default function Staff({ route }) {
  const { db } = useStore()
  const [role, setRole] = useState(() => { try { return sessionStorage.getItem('glaze-role') || 'darlene' } catch (e) { return 'darlene' } })
  useEffect(() => { try { sessionStorage.setItem('glaze-role', role) } catch (e) {} }, [role])
  const can = ROLES[role].can
  const parts = route.split('/')
  const tab = parts[1] || ''
  const newCount = db.requests.filter(r => r.status === 'new').length
  const allowed = TABS.find(t => t[0] === tab)?.[2](can) ?? true

  return (
    <div className="staff">
      <header className="shead"><div className="in">
        <img src={logo} alt="Glaze" />
        <span style={{ fontWeight: 800, opacity: .8, fontSize: 13 }}>Staff</span>
        <label className="who">Signed in as
          <select value={role} onChange={e => setRole(e.target.value)} aria-label="Switch role">
            {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.name}</option>)}
          </select>
        </label>
      </div></header>
      <nav className="stabs" aria-label="Staff sections"><div className="in">
        {TABS.filter(t => t[2](can)).map(([k, l]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => go('staff' + (k ? '/' + k : ''))}>
            {l}{k === 'requests' && newCount > 0 && <span className="count">{newCount}</span>}
          </button>
        ))}
      </div></nav>
      <main className="smain">
        {!allowed ? <div className="lock">{ROLES[role].name} doesn’t have access to this section. Darlene decides who sees what.</div>
          : tab === 'requests' ? <Requests role={role} id={parts[2]} />
          : tab === 'bookings' ? <Bookings />
          : tab === 'workshops' ? <WorkshopsAdmin role={role} />
          : tab === 'money' ? <Money role={role} />
          : tab === 'stock' ? <Stock role={role} />
          : tab === 'tools' ? <Tools role={role} />
          : <Today role={role} />}
      </main>
    </div>
  )
}
