import { useState } from 'react'
import { useStore, go } from '../store.jsx'
import { ROLES, ghs, fmtDate, findActivity } from '../data.js'
import { DateBox } from './Today.jsx'

const CLASSES = [
  { date: '2026-11-07', time: '10:00', what: '1-1 art class', who: 'Example student (age 9)' },
  { date: '2026-11-08', time: '12:00', what: '1-1 art class', who: 'Example student (age 12)' },
  { date: '2026-11-11', time: '16:00', what: '1-1 art class', who: 'Example student (adult)' },
]

export function Bookings() {
  const { db } = useStore()
  const items = [
    ...db.requests.filter(r => r.status === 'booked' || r.status === 'quoted').map(r => ({ date: r.date, time: r.time, kind: 'Event', title: r.bookingName.replace('Example: ', ''), detail: `${r.guests} guests · ${findActivity(r.activity)?.name || 'Activity TBC'}`, pill: r.status, go: 'staff/requests/' + r.id })),
    ...db.workshops.map(w => ({ date: w.date, time: w.time, kind: 'Workshop', title: w.title, detail: `${w.booked} booked of ${w.spots}${w.holds.length ? ` · ${w.holds.length} held` : ''}`, go: 'staff/workshops' })),
    ...CLASSES.map(c => ({ date: c.date, time: c.time, kind: '1-1 class', title: c.who, detail: c.what })),
    ...(db.tables || []).map(x => ({ date: x.date, time: x.time, kind: 'Table', title: x.name, detail: `${x.people} people · ${findActivity(x.activity)?.name || 'choosing on arrival'} · ${x.status === 'paid' ? 'paid online' : 'pay at studio'}`, pill2: x.status === 'paid' ? 'booked' : 'quoted', pill2t: x.status === 'paid' ? 'Paid online' : 'Pay at studio' })),
  ].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  return (
    <>
      <h1>Bookings</h1>
      <p className="sub">Events, table bookings, workshops and 1-1 classes in one list. Front desk, Darlene, the lead instructor and ops see this.</p>
      <div className="cardlist">
        {items.map((i, k) => (
          <button key={k} className="erow" style={{ cursor: i.go ? 'pointer' : 'default' }} onClick={() => i.go && go(i.go)}>
            <DateBox date={i.date} />
            <span className="m"><b>{i.title}</b><small>{i.kind} · {i.time} · {i.detail}</small></span>
            {i.pill ? <span className={'pill ' + i.pill}>{i.pill === 'booked' ? 'Deposit paid' : 'Awaiting deposit'}</span> : i.pill2 ? <span className={'pill ' + i.pill2}>{i.pill2t}</span> : <span className="pill new">{i.kind}</span>}
          </button>))}
      </div>
    </>
  )
}

export function WorkshopsAdmin({ role }) {
  const { db, update, setToast } = useStore()
  const can = ROLES[role].can
  const [f, setF] = useState({ title: '', date: '', time: '', price: '', spots: '', flyer: '' })
  const add = () => {
    update(db => db.workshops.push({ id: 'w' + Date.now(), title: f.title, date: f.date, time: f.time, price: +f.price, spots: +f.spots, img: 'collage', booked: 0, holds: [], waitlist: [] }))
    setF({ title: '', date: '', time: '', price: '', spots: '', flyer: '' }); setToast('Workshop posted to the website')
  }
  const hold = (wid, i, paid) => update(db => {
    const w = db.workshops.find(x => x.id === wid)
    w.holds.splice(i, 1)
    if (paid) w.booked += 1
  })
  return (
    <>
      <h1>Workshops</h1>
      <p className="sub">December schedule. Holds that aren’t paid by their date are released to the waitlist.</p>
      {db.workshops.map(w => (
        <div key={w.id} className="panel">
          <h2>{w.title} <small>{fmtDate(w.date)} · {w.time} · {ghs(w.price)}</small></h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="pill booked">{w.booked} paid</span>
            {w.holds.length > 0 && <span className="pill quoted">{w.holds.length} holding</span>}
            <span className={'pill ' + (w.spots - w.booked - w.holds.length <= 0 ? 'low' : 'new')}>{Math.max(0, w.spots - w.booked - w.holds.length)} of {w.spots} left</span>
            {w.waitlist.length > 0 && <span className="pill new">{w.waitlist.length} on waitlist</span>}
          </div>
          {w.holds.map((h, i) => (
            <div key={i} className="holdrow">
              <span>{h.name} · pay at studio by <b>{fmtDate(h.until)}</b></span>
              {can.money && <button className="btn b sm" onClick={() => { hold(w.id, i, true); setToast('Payment recorded') }}>Paid at studio</button>}
              {can.post && <button className="btn o sm" onClick={() => { hold(w.id, i, false); setToast(w.waitlist.length ? `Spot offered to ${w.waitlist[0]}` : 'Spot released') }}>Release</button>}
            </div>))}
          {w.waitlist.length > 0 && <div style={{ fontSize: 14, color: 'var(--muted)' }}>Waitlist: {w.waitlist.join(', ')}</div>}
        </div>
      ))}
      {can.post ? <div className="panel">
        <h2>Post a workshop</h2>
        <div className="field"><label htmlFor="wt">Title</label><input id="wt" type="text" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></div>
        <div className="row2">
          <div className="field"><label htmlFor="wd">Date</label><input id="wd" type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></div>
          <div className="field"><label htmlFor="wtm">Time</label><input id="wtm" type="time" value={f.time} onChange={e => setF({ ...f, time: e.target.value })} /></div>
          <div className="field"><label htmlFor="wpr">Price (GH₵)</label><input id="wpr" type="number" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} /></div>
          <div className="field"><label htmlFor="wsp">Spots</label><input id="wsp" type="number" value={f.spots} onChange={e => setF({ ...f, spots: e.target.value })} /></div>
        </div>
        <div className="field"><label htmlFor="wf">Flyer (Kirsty’s Instagram PNG)</label><input id="wf" type="file" accept="image/png,image/jpeg" onChange={e => setF({ ...f, flyer: e.target.files[0]?.name || '' })} /></div>
        <button className="btn y" disabled={!f.title || !f.date || !f.time || !f.price || !f.spots} onClick={add}>Post to the website</button>
      </div> : <div className="lock">Only Darlene and the ops manager post workshops.</div>}
    </>
  )
}
