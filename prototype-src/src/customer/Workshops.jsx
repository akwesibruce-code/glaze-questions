import { useState, useEffect } from 'react'
import { useStore } from '../store.jsx'
import { img } from '../assets.js'
import { ghs, fmtDate, TODAY, addDays } from '../data.js'

const HOLD_DAYS = 3

export default function Workshops() {
  const { db, update, setToast } = useStore()
  const [w, setW] = useState(null)
  const [pay, setPay] = useState('now')
  const [form, setForm] = useState({ name: '', phone: '', qty: 1 })
  const [done, setDone] = useState('')
  const until = addDays(TODAY, HOLD_DAYS)

  useEffect(() => {
    if (!w) return
    const k = e => e.key === 'Escape' && setW(null)
    addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [w])

  const open = ws => { setW(ws); setPay('now'); setDone(''); setForm({ name: '', phone: '', qty: 1 }) }
  const left = ws => ws.spots - ws.booked - ws.holds.length
  const full = w && left(w) <= 0

  const confirm = () => {
    update(db => {
      const x = db.workshops.find(k => k.id === w.id)
      if (full) x.waitlist.push(form.name)
      else if (pay === 'now') x.booked += +form.qty
      else for (let i = 0; i < +form.qty; i++) x.holds.push({ name: form.name, until })
    })
    setDone(full ? 'waitlist' : pay)
  }

  return (
    <>
      <section className="hero slim"><div className="wrap">
        <div className="txt">
          <h1>December workshops</h1>
          <p>A new schedule every month, out on the 1st. Book your spot online, or hold it and pay at the studio.</p>
        </div>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="note info">Example schedule. Kirsty’s flyers go here each month.</div>
        <div className="flyers">
          {db.workshops.map(ws => {
            const l = left(ws)
            return (
              <article key={ws.id} className="flyer">
                <div className="art">
                  <img src={img(ws.img)} alt="" />
                  <span className={'badge' + (l <= 0 ? ' full' : '')}>{l <= 0 ? 'Fully booked' : `${l} ${l === 1 ? 'spot' : 'spots'} left`}</span>
                  <div className="t"><h3>{ws.title}</h3><div>{fmtDate(ws.date)} · {ws.time}</div></div>
                </div>
                <div className="meta">
                  <div><b>{ghs(ws.price)}</b><small>per person, materials included</small></div>
                  <button className={'btn ' + (l <= 0 ? 'o' : 'y')} onClick={() => open(ws)}>{l <= 0 ? 'Join waitlist' : 'Book'}</button>
                </div>
              </article>
            )
          })}
        </div>
        <div className="channel">
          <b>Never miss a workshop</b>
          <span>Follow the Glaze WhatsApp channel. We post the schedule, closures and offers, no more than three times a month.</span>
          <button className="btn y" style={{ alignSelf: 'flex-start' }} onClick={() => setToast('Opens the Glaze WhatsApp channel')}>Follow on WhatsApp</button>
        </div>
      </div></section>

      {w && (
        <div className="sheet-bg" onClick={e => e.target === e.currentTarget && setW(null)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-label={w.title}>
            <button className="x" onClick={() => setW(null)} aria-label="Close">×</button>
            {done ? <>
              <h3>{done === 'waitlist' ? 'You’re on the waitlist' : done === 'now' ? 'You’re booked!' : 'Your spot is held'}</h3>
              <p style={{ margin: 0 }}>
                {done === 'waitlist' && 'If a spot opens up, we’ll message you on WhatsApp straight away.'}
                {done === 'now' && `See you on ${fmtDate(w.date)} at ${w.time}. Your ticket has been sent on WhatsApp.`}
                {done === 'hold' && `Pay at the studio by ${fmtDate(until)} to keep it. After that, it goes to the next person on the waitlist.`}
              </p>
              <button className="btn b" onClick={() => setW(null)}>Done</button>
            </> : <>
              <h3>{w.title}</h3>
              <div style={{ color: 'var(--muted)', marginTop: -6 }}>{fmtDate(w.date)} · {w.time} · {ghs(w.price)} per person</div>
              <div className="field"><label htmlFor="wn">Your name</label><input id="wn" type="text" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="row2">
                <div className="field"><label htmlFor="wp">WhatsApp number</label><input id="wp" type="tel" autoComplete="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                {!full && <div className="field"><label htmlFor="wq">Tickets</label><select id="wq" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })}>{[1, 2, 3, 4].filter(n => n <= left(w)).map(n => <option key={n}>{n}</option>)}</select></div>}
              </div>
              {full ? <div className="note info">This one is fully booked. Join the waitlist and we’ll message you if a spot opens.</div> : <>
                <button className={'opt' + (pay === 'now' ? ' on' : '')} aria-pressed={pay === 'now'} onClick={() => setPay('now')}><span className="dot" aria-hidden="true" /><div><b>Pay now · {ghs(w.price * form.qty)}</b><small>MoMo or card. Your spot is confirmed straight away.</small></div></button>
                <button className={'opt' + (pay === 'hold' ? ' on' : '')} aria-pressed={pay === 'hold'} onClick={() => setPay('hold')}><span className="dot" aria-hidden="true" /><div><b>Hold my spot, pay at the studio</b><small>Cash, MoMo or card at Glaze by {fmtDate(until)}. Unpaid holds are released after {HOLD_DAYS} days.</small></div></button>
              </>}
              <button className="btn y full" disabled={!form.name || !form.phone} onClick={confirm}>{full ? 'Join the waitlist' : pay === 'now' ? `Pay ${ghs(w.price * form.qty)}` : 'Hold my spot'}</button>
              {(!form.name || !form.phone) && <p className="lead" style={{ fontSize: 13, textAlign: 'center', margin: '-4px auto 0' }}>Add your name and WhatsApp number to continue.</p>}
            </>}
          </div>
        </div>
      )}
    </>
  )
}
