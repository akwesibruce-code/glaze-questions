import { useStore, go } from '../store.jsx'
import { ROLES, ghs, fmtDate, quoteFor } from '../data.js'

export const dayTotal = s => s.cash + s.momo + s.card + s.transfer

export default function Today({ role }) {
  const { db } = useStore()
  const can = ROLES[role].can
  const today = db.sales[db.sales.length - 1]
  const short = db.till.expected - db.till.counted
  const low = db.stock.filter(s => s.count < s.min)
  const waiting = db.requests.filter(r => r.status === 'new')
  const upcoming = db.requests.filter(r => r.status === 'quoted' || r.status === 'booked').sort((a, b) => a.date.localeCompare(b.date))
  const max = Math.max(...db.sales.map(dayTotal))
  const week = db.sales.reduce((s, d) => s + dayTotal(d), 0)
  const greet = role === 'darlene' ? 'Good evening, D' : `Hi, ${ROLES[role].name.toLowerCase()}`

  return (
    <>
      <h1>{greet}</h1>
      <p className="sub">Friday 6 November · here’s where Glaze stands today</p>

      <div className="grid">
        {can.money && <div className={'kpi' + (short ? ' alert' : '')}><span className="l">Cash in till</span><span className="v">{ghs(db.till.counted)}</span><span className="s">{short ? `${ghs(short)} short of ${ghs(db.till.expected)} expected` : 'Matches the till'}</span></div>}
        {can.money && <div className="kpi"><span className="l">Sales today</span><span className="v">{ghs(dayTotal(today))}</span><span className="s">{ghs(week)} over the last 6 open days</span></div>}
        <button className="kpi" style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit' }} onClick={() => go('staff/requests')}><span className="l">Event requests waiting</span><span className="v">{waiting.length}</span><span className="s">Reply the same day</span></button>
        <button className={'kpi' + (low.length ? ' alert' : '')} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit' }} onClick={() => go('staff/stock')}><span className="l">Running low</span><span className="v">{low.length} items</span><span className="s">{low.slice(0, 3).map(s => s.item).join(', ')}</span></button>
      </div>

      <div className="two">
        {can.money && <div className="panel">
          <h2>Daily sales <small>all payment methods</small></h2>
          <div className="bars" role="img" aria-label="Sales per day for the last six open days">
            {db.sales.map((d, i) => (
              <div key={d.day} className={'b' + (i === db.sales.length - 1 ? ' today' : '')}>
                <em>{(dayTotal(d) / 1000).toFixed(1)}k</em>
                <div className="col" style={{ height: `${(dayTotal(d) / max) * 100}%` }} />
                <span>{d.day.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
          </div>
          {short > 0 && <div className="note warn">Tonight’s count: {db.till.note}</div>}
        </div>}

        <div className="panel">
          <h2>Upcoming events <small>who has paid</small></h2>
          <div className="scroll"><table className="tbl">
            <thead><tr><th>Date</th><th>Event</th><th className="n">Guests</th><th>Payment</th></tr></thead>
            <tbody>{upcoming.map(r => (
              <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => go('staff/requests/' + r.id)}>
                <td>{fmtDate(r.date)}</td><td>{r.bookingName.replace('Example: ', '')}<br /><small style={{ color: 'var(--muted)' }}>{r.type}</small></td><td className="n">{r.guests}</td>
                <td>{r.status === 'booked' ? <span className="pill booked">Deposit paid</span> : <span className="pill quoted">Awaiting deposit</span>}{can.money && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{ghs(r.quoteTotal || quoteFor(r).total)} total</div>}</td>
              </tr>))}</tbody>
          </table></div>
        </div>

        <div className="panel">
          <h2>What’s needed <small>from today’s count</small></h2>
          {low.length ? low.map(s => (
            <div key={s.item} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 14 }}>
              <span>{s.item}<br /><small style={{ color: 'var(--muted)' }}>{db.sources[s.group]}</small></span>
              <span className="pill low">{s.count}{s.unit === '%' ? '%' : ''} left</span>
            </div>)) : <div className="empty">Everything is stocked.</div>}
        </div>

        {role === 'lead' && <div className="panel">
          <h2>Your Tuesday update</h2>
          <p style={{ margin: 0, fontSize: 14 }}>Due every Tuesday: this week’s 1-1 classes, items to restock, and a check-in with Darlene.</p>
          <button className="btn b sm" style={{ alignSelf: 'flex-start' }} onClick={() => go('staff/tools')}>Write it</button>
        </div>}

        {(role === 'ops' || role === 'darlene') && <div className="panel">
          <h2>Staff requests <small>logged by ops</small></h2>
          {db.log.slice(0, 4).map(l => (
            <div key={l.id} style={{ fontSize: 14, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
              <b>{l.kind}</b> · {l.from} {l.escalate && <span className="pill low">For Darlene</span>}<br /><span style={{ color: 'var(--muted)' }}>{l.what} → {l.action}</span>
            </div>))}
        </div>}
      </div>
    </>
  )
}
