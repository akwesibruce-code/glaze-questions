import { useStore, go } from '../store.jsx'
import { ROLES, ghs, quoteFor, longToday } from '../data.js'
import { needs } from './stockLogic.js'

export const dayTotal = s => s.cash + s.momo + s.card + s.transfer

export function DateBox({ date }) {
  const d = new Date(date + 'T12:00:00')
  return <span className="date"><small>{d.toLocaleDateString('en-GB', { month: 'short' })}</small><b>{d.getDate()}</b><small>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</small></span>
}

export default function Today({ role }) {
  const { db } = useStore()
  const can = ROLES[role].can
  const today = db.sales[db.sales.length - 1]
  const short = db.till.expected - db.till.counted
  const low = db.stock.filter(s => needs(s))
  const waiting = db.requests.filter(r => r.status === 'new')
  // The lead instructor only sees confirmed (deposit paid) events, never requests or quotes.
  const upcoming = db.requests.filter(r => can.requests ? (r.status === 'quoted' || r.status === 'booked') : r.status === 'booked').sort((a, b) => a.date.localeCompare(b.date))
  const max = Math.max(...db.sales.map(dayTotal))
  const week = db.sales.reduce((s, d) => s + dayTotal(d), 0)
  const h = new Date().getHours()
  const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  const greet = role === 'darlene' ? `${part}, D` : `${part}, ${ROLES[role].name.toLowerCase()}`

  return (
    <>
      <h1>{greet}</h1>
      <p className="sub">{longToday()} · here’s where Glaze stands today</p>

      <div className="kpis">
        {can.money && <div className={'kpi' + (short ? ' alert' : '')}><span className="l">Cash in till</span><span className="v">{ghs(db.till.counted)}</span><span className="s">{short > 0 ? `${ghs(short)} short of ${ghs(db.till.expected)} expected` : short < 0 ? `${ghs(-short)} over` : 'Matches the till'}</span></div>}
        {can.money && <div className="kpi"><span className="l">Sales today</span><span className="v">{ghs(dayTotal(today))}</span><span className="s">{ghs(week)} over the last 6 open days</span></div>}
        {can.requests
          ? <button className={'kpi' + (waiting.length ? ' alert' : '')} onClick={() => go('staff/requests')}><span className="l">Event requests waiting</span><span className="v">{waiting.length}</span><span className="s">{waiting.length ? 'Reply today · tap to open' : 'All replied'}</span></button>
          : <button className="kpi" onClick={() => go('staff/bookings')}><span className="l">Confirmed events</span><span className="v">{upcoming.length}</span><span className="s">Deposit paid · tap for details</span></button>}
        <button className={'kpi' + (low.length ? ' alert' : '')} onClick={() => go('staff/stock')}><span className="l">Running low</span><span className="v">{low.length} {low.length === 1 ? 'item' : 'items'}</span><span className="s">{low.slice(0, 3).map(s => s.item).join(', ')}</span></button>
      </div>

      <div className="two">
        {can.money && <div className="panel">
          <h2>Daily sales <small>all payment methods</small></h2>
          <div className="bars" role="img" aria-label="Sales per day for the last six open days">
            {db.sales.map((d, i) => (
              <div key={d.day} className={'b' + (i === db.sales.length - 1 ? ' today' : '')}>
                <em>{(dayTotal(d) / 1000).toFixed(1)}k</em>
                <div className="col" style={{ height: `${(dayTotal(d) / max) * 78}%` }} />
                <span>{d.day.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
          </div>
          {short > 0 && <div className="note warn">Tonight’s count: {db.till.note}</div>}
        </div>}

        <div className="panel">
          <h2>{can.requests ? 'Upcoming events' : 'Confirmed events'} <small>{can.requests ? 'who has paid' : 'deposit paid'}</small></h2>
          <div className="cardlist">
            {upcoming.length === 0 && <div className="empty">No confirmed events yet.</div>}
            {upcoming.map(r => (
              <button key={r.id} className="erow" onClick={() => go('staff/requests/' + r.id)}>
                <DateBox date={r.date} />
                <span className="m"><b>{r.bookingName.replace('Example: ', '')}</b><small>{r.type} · {r.guests} guests{can.money ? ` · ${ghs(r.quoteTotal || quoteFor(r).total)}` : ''}</small></span>
                {r.status === 'booked' ? <span className="pill booked">{can.requests ? 'Deposit paid' : 'Confirmed'}</span> : <span className="pill quoted">Awaiting deposit</span>}
              </button>))}
          </div>
        </div>

        <div className="panel">
          <h2>What’s needed <small>from today’s count</small></h2>
          {low.length ? low.map(s => (
            <div key={s.item} className="srow">
              <span className="nm">{s.item}<small>{s.office} in the office{s.storage !== null && can.storage ? ` · ${s.storage} in storage` : ''} · {db.suppliers[s.group].name}</small></span>
              <span className={'pill ' + (needs(s).kind === 'refill' ? 'quoted' : 'low')}>{needs(s).label}</span>
            </div>)) : <div className="empty">Everything is stocked.</div>}
          <button className="btn o sm" style={{ alignSelf: 'flex-start' }} onClick={() => go('staff/stock')}>Open the stock count</button>
        </div>

        {role === 'lead' && <div className="panel">
          <h2>Your Tuesday update</h2>
          <p style={{ margin: 0, fontSize: 14 }}>Due every Tuesday: this week’s 1-1 classes, items to restock, and a check-in with Darlene.</p>
          <button className="btn b sm" style={{ alignSelf: 'flex-start' }} onClick={() => go('staff/tools')}>Write it</button>
        </div>}

        {(role === 'ops' || role === 'darlene') && <div className="panel">
          <h2>Staff requests <small>logged by ops</small></h2>
          {db.log.slice(0, 4).map(l => (
            <div key={l.id} className="logitem">
              <span><b>{l.kind}</b> · {l.from} {l.escalate && <span className="pill low">For Darlene</span>}</span>
              <span className="meta">{l.what} → {l.action}</span>
            </div>))}
        </div>}
      </div>
    </>
  )
}
