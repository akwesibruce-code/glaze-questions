import { useState } from 'react'
import { useStore, go } from '../store.jsx'
import { DateBox } from './Today.jsx'
import { ROLES, ghs, fmtDate, quoteFor, findActivity, DEPOSIT, TODAY, addDays } from '../data.js'

const LABEL = { new: 'New', quoted: 'Quote sent', booked: 'Booked', released: 'Released', declined: 'Declined' }

export default function Requests({ role, id }) {
  const { db } = useStore()
  const [filter, setFilter] = useState('new')
  if (id) { const r = db.requests.find(x => x.id === id); if (r) return <Detail r={r} role={role} /> }
  const list = db.requests.filter(r => filter === 'all' || r.status === filter)
  return (
    <>
      <h1>Event requests</h1>
      <p className="sub">Every request gets a reply the same day. Only Darlene approves quotes.</p>
      <div className="chips">
        {[['new', 'New'], ['quoted', 'Quote sent'], ['booked', 'Booked'], ['all', 'All']].map(([k, l]) => (
          <button key={k} className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)}>{l} ({k === 'all' ? db.requests.length : db.requests.filter(r => r.status === k).length})</button>
        ))}
      </div>
      <div className="cardlist">
        {list.length === 0 && <div className="empty">Nothing here right now.</div>}
        {list.map(r => (
          <button key={r.id} className="erow" onClick={() => go('staff/requests/' + r.id)}>
            <DateBox date={r.date} />
            <span className="m"><b>{r.bookingName}</b><small>{r.type} · {r.time} · {r.guests} guests · {r.audience}</small></span>
            <span className={'pill ' + r.status}>{LABEL[r.status]}</span>
          </button>
        ))}
      </div>
    </>
  )
}

function Detail({ r, role }) {
  const { update, setToast } = useStore()
  const can = ROLES[role].can
  const q = quoteFor(r)
  const [total, setTotal] = useState(Math.round(r.quoteTotal ?? q.total))
  const [preview, setPreview] = useState(false)
  const act = findActivity(r.activity)
  const deposit = total * DEPOSIT
  const due = addDays(TODAY, 2)
  const set = fn => update(db => fn(db.requests.find(x => x.id === r.id)))
  const first = r.contactName.replace('Example ', '')

  const msg = `Hi ${first}! Thank you for choosing Glaze for your ${r.type.toLowerCase()} on ${fmtDate(r.date)} at ${r.time}.\n\n${act ? act.name : 'Your activity'} for ${r.guests} guests: ${ghs(total)}${r.guests >= 6 ? ' (includes 10% group discount)' : ''}.\n\nTo lock in your date, please pay a 70% deposit of ${ghs(deposit)} by ${fmtDate(due)}. Pay by MoMo or card here: glazegh.com/pay\n\nSee you soon!\nGlaze Art Studio`

  return (
    <>
      <button className="back" onClick={() => go('staff/requests')}>← All requests</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{r.bookingName}</h1><span className={'pill ' + r.status}>{LABEL[r.status]}</span>
      </div>
      <div className="two">
        <div className="panel">
          <h2>The request</h2>
          <dl className="kv">
            <dt>Event</dt><dd>{r.type} · {r.audience}{r.ages ? `, ages ${r.ages}` : ''}</dd>
            {r.celebrant && <><dt>Birthday star</dt><dd>{r.celebrant}</dd></>}
            <dt>When</dt><dd>{fmtDate(r.date)} at {r.time} · {r.duration}</dd>
            <dt>Guests</dt><dd>{r.guests}</dd>
            <dt>Activity</dt><dd>{act ? act.name : <i>Not sure yet: {r.unsure}</i>}</dd>
            <dt>Food and decor</dt><dd>{r.vendor === 'own' ? `Own vendor: ${r.vendorName}, ${r.vendorPhone}` : r.vendor === 'glaze' ? `Glaze vendor${r.inspo ? ` · ${r.inspo}` : ''}` : 'None'}</dd>
            {r.logistics && <><dt>Notes</dt><dd>{r.logistics}</dd></>}
            <dt>Contact</dt><dd>{r.contactName} · {r.phone}{r.email ? ` · ${r.email}` : ''}</dd>
          </dl>
        </div>

        <div className="panel">
          <h2>Quote <small>only your team sees this</small></h2>
          {q.lines.map(l => <div key={l.label} className="qline"><span>{l.label}</span><span>{l.tbc ? 'TBC' : ghs(l.amount)}</span></div>)}
          {can.approve && r.status === 'new'
            ? <div className="field" style={{ marginTop: 6 }}><label htmlFor="tot">Final price (you can adjust)</label><input id="tot" type="number" value={total} onChange={e => setTotal(+e.target.value)} /></div>
            : null}
          <div className="qline tot"><span>Total</span><span>{ghs(total)}</span></div>
          <div className="qline"><span>70% deposit to lock the date</span><b>{ghs(deposit)}</b></div>

          {r.status === 'new' && (can.approve ? <>
            <button className="btn o" onClick={() => setPreview(!preview)}>{preview ? 'Hide' : 'Preview'} the message</button>
            {preview && <pre className="msgprev">{msg}</pre>}
            <button className="btn y" onClick={() => { set(x => { x.status = 'quoted'; x.quoteTotal = total; x.depositDue = due }); setToast('Quote sent on WhatsApp and email') }}>Approve and send quote</button>
            <button className="btn o sm" onClick={() => { set(x => { x.status = 'declined' }); setToast('Request declined') }}>Decline politely</button>
          </> : <div className="lock">Waiting for Darlene to approve. {role === 'ops' ? 'You can review it and add notes for her.' : ''}</div>)}

          {r.status === 'quoted' && <>
            <div className="note warn">Deposit due {fmtDate(r.depositDue || due)}. The date is released automatically if it isn’t paid.</div>
            {(can.money || can.approve) && <button className="btn b" onClick={() => { set(x => { x.status = 'booked'; x.depositPaid = Math.round((x.quoteTotal || total) * DEPOSIT) }); setToast('Deposit recorded. Date locked in.') }}>Mark deposit paid</button>}
            {can.approve && <button className="btn o sm" onClick={() => { set(x => { x.status = 'released' }); setToast('Date released') }}>Release the date</button>}
          </>}
          {r.status === 'booked' && <div className="note ok">Deposit of {ghs(r.depositPaid || deposit)} paid. {ghs((r.quoteTotal || total) - (r.depositPaid || deposit))} due on the day.</div>}
        </div>
      </div>
    </>
  )
}
