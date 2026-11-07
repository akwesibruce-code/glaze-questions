import { useState } from 'react'
import { useStore } from '../store.jsx'
import { ghs, fmtDate, TODAY } from '../data.js'

export default function Stock({ role }) {
  const { db, update, setToast } = useStore()
  const [amt, setAmt] = useState('')
  const groups = [...new Set(db.stock.map(s => s.group))]
  const setCount = (item, n) => update(db => { db.stock.find(s => s.item === item).count = Math.max(0, n) })
  const monthPower = db.power.filter(p => p.date.slice(0, 7) === TODAY.slice(0, 7)).reduce((s, p) => s + p.amount, 0)
  return (
    <>
      <h1>Stock</h1>
      <p className="sub">The daily count. Anything below its minimum shows up on the dashboard and on the restock list.</p>
      <div className="three">
        {groups.map(g => {
          const items = db.stock.filter(s => s.group === g)
          const low = items.filter(s => s.count < s.min)
          return (
            <div key={g} className="panel">
              <h2>{g} <small>{db.sources[g]}</small></h2>
              {items.map(s => (
                <div key={s.item} className="srow">
                  <span className="nm">{s.item}<small>minimum {s.min}{s.unit === '%' ? '%' : ''}{s.unit && s.unit !== '%' ? ' ' + s.unit : ''}</small></span>
                  {s.count < s.min && <span className="pill low">Low</span>}
                  <div className="counter">
                    <button aria-label={`Fewer ${s.item}`} onClick={() => setCount(s.item, s.count - (s.unit === '%' ? 5 : 1))}>−</button>
                    <input aria-label={s.item} type="number" value={s.count} onChange={e => setCount(s.item, +e.target.value)} />
                    <button aria-label={`More ${s.item}`} onClick={() => setCount(s.item, s.count + (s.unit === '%' ? 5 : 1))}>+</button>
                  </div>
                </div>
              ))}
              {low.length > 0 && <button className="btn o sm" style={{ alignSelf: 'flex-start' }} onClick={() => setToast(g === 'Snacks' ? 'Order sent to Auntie’s shop on WhatsApp' : g === 'Aprons' ? 'Added to the laundry list' : 'Added to the restock list for ops')}>
                {g === 'Snacks' ? 'Order from Auntie’s shop' : g === 'Aprons' ? 'Flag for laundry' : 'Add to restock list'} ({low.length})</button>}
            </div>
          )
        })}
        <div className="panel">
          <h2>Electricity top-ups <small>{ghs(monthPower)} so far this month</small></h2>
          {db.power.slice().reverse().map((p, i) => <div key={i} className="qline" style={{ fontSize: 14 }}><span>{fmtDate(p.date)}</span><span>{ghs(p.amount)}</span></div>)}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input aria-label="Top-up amount" type="number" placeholder="Amount (GH₵)" value={amt} onChange={e => setAmt(e.target.value)} />
            <button className="btn b sm" disabled={!amt} onClick={() => { update(db => db.power.push({ date: TODAY, amount: +amt })); setAmt(''); setToast('Top-up recorded') }}>Add</button>
          </div>
        </div>
      </div>
      <button className="btn y" style={{ alignSelf: 'flex-start' }} onClick={() => setToast(`Today’s count saved by ${role === 'darlene' ? 'Darlene' : 'staff'}. Ops can see it.`)}>Save today’s count</button>
    </>
  )
}
