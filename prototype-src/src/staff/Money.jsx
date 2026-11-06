import { useState } from 'react'
import { useStore } from '../store.jsx'
import { ghs } from '../data.js'
import { dayTotal } from './Today.jsx'

export default function Money({ role }) {
  const { db, update, setToast } = useStore()
  const canEnter = role === 'frontdesk' || role === 'darlene'
  const t = db.sales[db.sales.length - 1]
  const [f, setF] = useState({ cash: t.cash, momo: t.momo, card: t.card, transfer: t.transfer, counted: db.till.counted })
  const save = () => {
    update(db => {
      const d = db.sales[db.sales.length - 1]
      ;['cash', 'momo', 'card', 'transfer'].forEach(k => d[k] = +f[k] || 0)
      db.till.expected = d.cash; db.till.counted = +f.counted || 0
      const gap = db.till.expected - db.till.counted
      db.till.note = gap > 0 ? `${ghs(gap)} short, front desk to check receipts` : gap < 0 ? `${ghs(-gap)} over` : 'Till matches'
    })
    const gap = (+f.cash || 0) - (+f.counted || 0)
    setToast(gap ? `Saved. The till is ${ghs(Math.abs(gap))} ${gap > 0 ? 'short' : 'over'}, Darlene has been told.` : 'Saved. Till matches.')
  }
  const totals = db.sales.reduce((s, d) => ({ cash: s.cash + d.cash, momo: s.momo + d.momo, card: s.card + d.card, transfer: s.transfer + d.transfer }), { cash: 0, momo: 0, card: 0, transfer: 0 })
  return (
    <>
      <h1>Money</h1>
      <p className="sub">The daily sales summary the front desk already does, in one place. Mctee stays your till.</p>
      {role === 'ops' && <div className="lock">Ops can see the numbers to check accuracy. Only the front desk and Darlene enter them.</div>}
      {role === 'darlene' && <div className="note info">Editing or deleting transactions stays in your own Mctee login, as it is today.</div>}
      {canEnter && <div className="panel">
        <h2>Close of day · Fri 6 Nov <small>front desk</small></h2>
        <div className="row2">
          {[['cash', 'Cash'], ['momo', 'MoMo'], ['card', 'Card (ABSA / Blue Penguin)'], ['transfer', 'Bank transfer']].map(([k, l]) => (
            <div key={k} className="field"><label htmlFor={'m' + k}>{l}</label><input id={'m' + k} type="number" inputMode="numeric" value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} /></div>
          ))}
        </div>
        <div className="field"><label htmlFor="mc">Cash counted in the drawer</label><input id="mc" type="number" inputMode="numeric" value={f.counted} onChange={e => setF({ ...f, counted: e.target.value })} />
          <span className="hint">Should match cash sales: {ghs(+f.cash || 0)}</span></div>
        {(+f.cash || 0) !== (+f.counted || 0) && <div className="note warn">{ghs(Math.abs((+f.cash || 0) - (+f.counted || 0)))} {(+f.cash || 0) > (+f.counted || 0) ? 'short' : 'over'}. Add a note for Darlene when you save.</div>}
        <button className="btn y" onClick={save}>Save today’s summary</button>
      </div>}
      <div className="panel">
        <h2>Last 6 open days</h2>
        <div className="scroll"><table className="tbl">
          <thead><tr><th>Day</th><th className="n">Cash</th><th className="n">MoMo</th><th className="n">Card</th><th className="n">Transfer</th><th className="n">Total</th></tr></thead>
          <tbody>
            {db.sales.map(d => <tr key={d.day}><td>{d.day}</td><td className="n">{ghs(d.cash)}</td><td className="n">{ghs(d.momo)}</td><td className="n">{ghs(d.card)}</td><td className="n">{ghs(d.transfer)}</td><td className="n"><b>{ghs(dayTotal(d))}</b></td></tr>)}
            <tr><td><b>Total</b></td><td className="n"><b>{ghs(totals.cash)}</b></td><td className="n"><b>{ghs(totals.momo)}</b></td><td className="n"><b>{ghs(totals.card)}</b></td><td className="n"><b>{ghs(totals.transfer)}</b></td><td className="n"><b>{ghs(totals.cash + totals.momo + totals.card + totals.transfer)}</b></td></tr>
          </tbody>
        </table></div>
      </div>
    </>
  )
}
