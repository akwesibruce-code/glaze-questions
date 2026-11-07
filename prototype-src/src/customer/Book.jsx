import { useState } from 'react'
import { useStore, go } from '../store.jsx'
import { img } from '../assets.js'
import { ADULT_MENU, KIDS_MENU, ghs, fmtDate, isOffDay, TODAY, findActivity } from '../data.js'

const TIMES = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
const blank = { date: '', time: '', adults: 2, kids: 0, activity: '', pay: 'studio', name: '', phone: '' }

export default function Book() {
  const { update } = useStore()
  const [f, setF] = useState(blank)
  const [done, setDone] = useState(false)
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const people = (+f.adults || 0) + (+f.kids || 0)
  const act = findActivity(f.activity)
  const total = act ? act.price * people : 0
  const off = isOffDay(f.date)
  const ok = f.date && !off && f.time && people > 0 && f.name && f.phone && (f.pay === 'studio' || act)

  const submit = () => {
    update(db => { (db.tables = db.tables || []).unshift({ id: 't' + Date.now(), ...f, people, total, status: f.pay === 'now' ? 'paid' : 'pay at studio' }) })
    setDone(true); window.scrollTo(0, 0)
  }

  if (done) return (
    <section className="sec"><div className="wrap"><div className="formwrap">
      <div className="card done">
        <img src={img('paint')} alt="" />
        <div className="big lc">see you soon!</div>
        <p style={{ margin: 0 }}>Your table for {people} is booked for <b>{fmtDate(f.date)} at {f.time}</b>. We’ve sent the details to your WhatsApp.</p>
        <p style={{ margin: 0, color: 'var(--muted)' }}>{f.pay === 'now' ? `Paid ${ghs(total)} by MoMo or card.` : 'You’ll choose your activity and pay at the studio. Cash, MoMo, card or bank transfer.'}</p>
        <button className="btn b" onClick={() => { setF(blank); setDone(false) }}>Book another table</button>
        <button className="btn o" onClick={() => go('home')}>Back to home</button>
      </div>
    </div></div></section>
  )

  const list = (+f.kids && !+f.adults) ? KIDS_MENU : ADULT_MENU.filter(a => !a.star && !a.wood)

  return (
    <>
      <section className="hero slim"><div className="wrap"><div className="txt">
        <span className="eyebrow">book now</span>
        <h1 className="lc">book a table</h1>
        <p>Reserve your spot and decide what to make when you arrive. Most guests pick on the day, and that’s fine.</p>
      </div></div></section>
      <section className="sec"><div className="wrap"><div className="formwrap">
        <div className="card">
          <h2 className="lc">when are you coming?</h2>
          <div className="row2">
            <div className="field"><label htmlFor="bd">Date</label><input id="bd" type="date" min={TODAY} value={f.date} onChange={e => set('date', e.target.value)} /></div>
            <div className="field"><label htmlFor="bt">Time</label><select id="bt" value={f.time} onChange={e => set('time', e.target.value)}><option value="">Choose a time</option>{TIMES.map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
          {off && <div className="note warn">We’re closed on Mondays and Tuesdays for walk-ins. Please pick another day, or <button className="linkbtn" onClick={() => go('events')}>ask about a private event</button>.</div>}
          <div className="row2">
            <div className="field"><label htmlFor="ba">Adults</label><Stepper id="ba" value={f.adults} onChange={v => set('adults', v)} /></div>
            <div className="field"><label htmlFor="bk">Kids</label><Stepper id="bk" value={f.kids} onChange={v => set('kids', v)} /></div>
          </div>
          {people >= 6 && <div className="note info">Groups of 6 or more get 10% off. For bigger groups, <button className="linkbtn" onClick={() => go('events')}>request an event quote</button>.</div>}
        </div>

        <div className="card">
          <h2 className="lc">what would you like to make?</h2>
          <button className={'opt' + (!f.activity ? ' on' : '')} aria-pressed={!f.activity} onClick={() => { set('activity', ''); set('pay', 'studio') }}><span className="dot" aria-hidden="true" /><div><b>I’ll decide when I arrive</b><small>Browse the art menu at the studio. Prices from GH₵150.</small></div></button>
          <div className="acts-list">
            {list.map(a => (
              <button key={a.id} className={'act' + (f.activity === a.id ? ' on' : '')} aria-pressed={f.activity === a.id} onClick={() => set('activity', a.id)}>
                <div className="nm"><b>{a.name}</b><small>{a.blurb}</small></div><span className="p">{ghs(a.price)}<small>per person</small></span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="lc">your details</h2>
          <div className="row2">
            <div className="field"><label htmlFor="bn">Name</label><input id="bn" type="text" autoComplete="name" value={f.name} onChange={e => set('name', e.target.value)} /></div>
            <div className="field"><label htmlFor="bp">WhatsApp number</label><input id="bp" type="tel" autoComplete="tel" value={f.phone} onChange={e => set('phone', e.target.value)} /></div>
          </div>
          <div className="field"><label>How would you like to pay?</label>
            <div className="cardlist">
              <button className={'opt' + (f.pay === 'studio' ? ' on' : '')} aria-pressed={f.pay === 'studio'} onClick={() => set('pay', 'studio')}><span className="dot" aria-hidden="true" /><div><b>Pay at the studio</b><small>Cash, MoMo, card or bank transfer on the day.</small></div></button>
              <button className={'opt' + (f.pay === 'now' ? ' on' : '')} aria-pressed={f.pay === 'now'} disabled={!act} onClick={() => act && set('pay', 'now')} style={!act ? { opacity: .55, cursor: 'not-allowed' } : undefined}><span className="dot" aria-hidden="true" /><div><b>Pay now{act ? ` · ${ghs(total)}` : ''}</b><small>{act ? 'MoMo or card. Skip the queue at the front desk.' : 'Choose an activity above to pay online.'}</small></div></button>
            </div>
          </div>
        </div>

        <button className="btn y full" disabled={!ok} onClick={submit}>{f.pay === 'now' && act ? `Pay ${ghs(total)} and book` : 'Book my table'}</button>
        {!ok && <p className="lead" style={{ fontSize: 13, textAlign: 'center', margin: '0 auto' }}>Add a date, time, number of people, your name and WhatsApp number.</p>}
      </div></div></section>
    </>
  )
}

function Stepper({ id, value, onChange }) {
  const v = +value || 0
  return (
    <div className="counter big">
      <button type="button" aria-label="Fewer" onClick={() => onChange(Math.max(0, v - 1))}>−</button>
      <input id={id} type="number" inputMode="numeric" min="0" value={v} onChange={e => onChange(Math.max(0, +e.target.value || 0))} />
      <button type="button" aria-label="More" onClick={() => onChange(v + 1)}>+</button>
    </div>
  )
}
