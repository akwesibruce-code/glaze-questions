import { useState } from 'react'
import { useStore } from '../store.jsx'
import { ROLES, ghs, fmtDate, TODAY } from '../data.js'
import { needs, refillAmount, waLink, csv, download } from './stockLogic.js'

const ACTION = {
  whatsapp: s => `Order from ${s.name} on WhatsApp`,
  pickup: s => `Book a laundry pickup`,
  inperson: s => `Add to the ${s.name} list`,
  storage: () => 'Reorder bulk stock',
}

export default function Stock({ role }) {
  const { db } = useStore()
  const can = ROLES[role].can
  const tabs = [['daily', 'Daily count'], ['monthly', 'Monthly full count'], ...(can.storage ? [['suppliers', 'Suppliers']] : []), ['power', 'Electricity']]
  const [tab, setTab] = useState('daily')
  return (
    <>
      <h1>Stock</h1>
      <p className="sub">{can.storage
        ? 'Two levels: the office store room that feeds the studio floor, and bulk storage that refills the office.'
        : 'Update the office store room after each session. Ops tops it up from storage.'}</p>
      <div className="chips">{tabs.map(([k, l]) => <button key={k} className={'chip' + (tab === k ? ' on' : '')} aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === 'daily' && <Daily role={role} />}
      {tab === 'monthly' && <Monthly role={role} />}
      {tab === 'suppliers' && <Suppliers role={role} />}
      {tab === 'power' && <Power />}
    </>
  )
}

function Counter({ label, value, onChange, step = 1 }) {
  return (
    <div className="counter">
      <button aria-label={`Fewer: ${label}`} onClick={() => onChange(value - step)}>−</button>
      <input aria-label={label} type="number" inputMode="numeric" value={value} onChange={e => onChange(+e.target.value || 0)} />
      <button aria-label={`More: ${label}`} onClick={() => onChange(value + step)}>+</button>
    </div>
  )
}

function Daily({ role }) {
  const { db, update, setToast } = useStore()
  const can = ROLES[role].can
  const groups = Object.keys(db.suppliers)
  const set = (item, key, n) => update(db => { db.stock.find(s => s.item === item)[key] = Math.max(0, n) })
  const refill = s => {
    const n = refillAmount(s)
    update(db => { const x = db.stock.find(i => i.item === s.item); x.office += n; x.storage -= n })
    setToast(`Moved ${n} ${s.item.toLowerCase()} from storage to the office`)
  }
  const order = (g, items) => {
    const sup = db.suppliers[g]
    if (sup.how === 'inperson') return setToast(`${items.length} item${items.length > 1 ? 's' : ''} added to the Melcom list`)
    if (sup.how === 'storage') return setToast('Added to Darlene’s bulk reorder list')
    const text = `Hello ${sup.name}, this is Glaze Art Studio. ${sup.how === 'pickup' ? 'Please can we book a laundry pickup for our aprons.' : 'We’d like to order: ' + items.map(i => i.item).join(', ') + '.'} Thank you!`
    const link = waLink(sup.phone, text)
    if (!link) return setToast(`Add ${sup.name}’s WhatsApp number under Suppliers first`)
    window.open(link, '_blank', 'noopener')
  }
  const exportCsv = () => download(`glaze-daily-stock-${TODAY}.csv`, csv([
    ['Date', 'Group', 'Item', 'Unit', 'Office store room', 'Office minimum', 'Bulk storage', 'Storage minimum', 'Needs'],
    ...db.stock.map(s => [TODAY, s.group, s.item, s.unit, s.office, s.minOffice, s.storage ?? '', s.minStorage ?? '', needs(s)?.label || 'OK']),
  ]))

  return (
    <>
      <div className="three">
        {groups.map(g => {
          const items = db.stock.filter(s => s.group === g)
          const sup = db.suppliers[g]
          const flagged = items.filter(s => needs(s) && (needs(s).kind !== 'refill'))
          const twoLevel = can.storage && items.some(s => s.storage !== null)
          return (
            <div key={g} className="panel">
              <h2>{g} <small>{sup.name}{sup.note ? ` · ${sup.note}` : ''}</small></h2>
              {items.map(s => {
                const n = needs(s)
                return (
                  <div key={s.item} className={'srow' + (twoLevel ? ' two-lvl' : '')}>
                    <span className="nm">{s.item}<small>office min {s.minOffice}{s.unit ? ' ' + s.unit : ''}{twoLevel && s.storage !== null ? ` · storage min ${s.minStorage}` : ''}</small>
                      {n && <span className={'pill ' + (n.kind === 'refill' ? 'quoted' : 'low')} style={{ marginTop: 4, alignSelf: 'flex-start' }}>{n.label}</span>}
                    </span>
                    {twoLevel
                      ? <div className="lvls">
                          <div className="lvl"><small>Office</small><Counter label={`${s.item} in the office`} value={s.office} onChange={v => set(s.item, 'office', v)} /></div>
                          {s.storage !== null && <div className="lvl"><small>Storage</small><Counter label={`${s.item} in storage`} value={s.storage} onChange={v => set(s.item, 'storage', v)} /></div>}
                        </div>
                      : <Counter label={`${s.item} in the office`} value={s.office} onChange={v => set(s.item, 'office', v)} />}
                    {can.storage && n?.kind === 'refill' && <button className="btn o sm refill" onClick={() => refill(s)}>Move {refillAmount(s)} from storage</button>}
                  </div>
                )
              })}
              {flagged.length > 0 && <button className="btn o sm" style={{ alignSelf: 'flex-start' }} onClick={() => order(g, flagged)}>{ACTION[sup.how](sup)} ({flagged.length})</button>}
            </div>
          )
        })}
      </div>
      <div className="acts">
        <button className="btn y" onClick={() => setToast(`Today’s count saved by ${ROLES[role].name}. Ops can see it.`)}>Save today’s count</button>
        {can.storage && <button className="btn o" onClick={exportCsv}>Export for Google Sheets</button>}
      </div>
    </>
  )
}

function Monthly({ role }) {
  const { db, update, setToast } = useStore()
  const can = ROLES[role].can
  const fc = db.fullCount
  const done = fc.items.filter(i => i.counted !== null).length
  const set = (item, v) => update(db => { db.fullCount.items.find(i => i.item === item).counted = Math.max(0, v) })
  const finish = () => {
    update(db => { db.fullCount.items.forEach(i => { if (i.counted !== null) i.count = i.counted; i.counted = null }); db.fullCount.last = TODAY })
    setToast('Monthly count saved')
  }
  const exportCsv = () => download(`glaze-monthly-count-${TODAY}.csv`, csv([
    ['Item', 'Last count', 'This count', 'Difference'],
    ...fc.items.map(i => [i.item, i.count, i.counted ?? '', i.counted === null ? '' : i.counted - i.count]),
  ]))
  return (
    <div className="panel">
      <h2>Monthly full count <small>last done {fmtDate(fc.last)} · {done} of {fc.items.length} counted</small></h2>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>Once a month, count everything, down to the glue sticks. Leave a line blank to keep last month’s number.</p>
      <div className="fullcount">
        {fc.items.map(i => (
          <div key={i.item} className="srow">
            <span className="nm">{i.item}<small>last month: {i.count}{i.counted !== null && i.counted !== i.count ? ` · ${i.counted > i.count ? '+' : ''}${i.counted - i.count}` : ''}</small></span>
            {i.counted === null
              ? <button className="btn o sm" onClick={() => set(i.item, i.count)}>Count</button>
              : <Counter label={i.item} value={i.counted} onChange={v => set(i.item, v)} />}
          </div>
        ))}
      </div>
      <div className="acts">
        <button className="btn y" disabled={!done} onClick={finish}>Save the monthly count</button>
        {can.storage && <button className="btn o" onClick={exportCsv}>Export for Google Sheets</button>}
      </div>
    </div>
  )
}

function Suppliers({ role }) {
  const { db, update, setToast } = useStore()
  return (
    <div className="panel">
      <h2>Suppliers <small>Darlene is sending the names and numbers</small></h2>
      {Object.entries(db.suppliers).map(([g, s]) => (
        <div key={g} className="suprow">
          <span className="nm"><b>{g}</b><small>{s.note}</small></span>
          <div className="field"><label htmlFor={'sn' + g}>Name</label><input id={'sn' + g} type="text" value={s.name} onChange={e => update(db => { db.suppliers[g].name = e.target.value })} /></div>
          <div className="field"><label htmlFor={'sp' + g}>{s.how === 'inperson' || s.how === 'storage' ? 'Phone (not needed)' : 'WhatsApp number'}</label>
            <input id={'sp' + g} type="tel" placeholder={s.how === 'inperson' ? 'Downstairs' : s.how === 'storage' ? '—' : '+233 …'} disabled={s.how === 'inperson' || s.how === 'storage'} value={s.phone} onChange={e => update(db => { db.suppliers[g].phone = e.target.value })} /></div>
        </div>
      ))}
      <button className="btn y" style={{ alignSelf: 'flex-start' }} onClick={() => setToast('Suppliers saved')}>Save suppliers</button>
    </div>
  )
}

function Power() {
  const { db, update, setToast } = useStore()
  const [amt, setAmt] = useState('')
  const monthPower = db.power.filter(p => p.date.slice(0, 7) === TODAY.slice(0, 7)).reduce((s, p) => s + p.amount, 0)
  return (
    <div className="panel" style={{ maxWidth: 520 }}>
      <h2>Electricity top-ups <small>{ghs(monthPower)} so far this month</small></h2>
      {db.power.slice().reverse().map((p, i) => <div key={i} className="qline" style={{ fontSize: 14 }}><span>{fmtDate(p.date)}</span><span>{ghs(p.amount)}</span></div>)}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input aria-label="Top-up amount" type="number" placeholder="Amount (GH₵)" value={amt} onChange={e => setAmt(e.target.value)} />
        <button className="btn b sm" disabled={!amt} onClick={() => { update(db => db.power.push({ date: TODAY, amount: +amt })); setAmt(''); setToast('Top-up recorded') }}>Add</button>
      </div>
    </div>
  )
}
