import { useState } from 'react'
import { useStore } from '../store.jsx'
import { fmtDate } from '../data.js'

const TODAY = '2026-11-06'

export default function Tools({ role }) {
  const tabs = {
    darlene: [['report', 'Lesson reports'], ['tuesday', 'Tuesday update'], ['log', 'Staff request log']],
    lead: [['report', 'Lesson reports'], ['tuesday', 'Tuesday update']],
    ops: [['log', 'Staff request log'], ['report', 'Lesson reports'], ['tuesday', 'Tuesday update']],
    frontdesk: [],
  }[role]
  const [tab, setTab] = useState(tabs[0]?.[0])
  if (!tabs.length) return (
    <>
      <h1>Staff tools</h1>
      <div className="lock">Sick, running late, or need something paid for? Message the ops manager on WhatsApp. She logs it and sends anything important to Darlene.</div>
    </>
  )
  return (
    <>
      <h1>Staff tools</h1>
      <div className="chips">{tabs.map(([k, l]) => <button key={k} className={'chip' + (tab === k ? ' on' : '')} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === 'report' && <Report role={role} />}
      {tab === 'tuesday' && <Tuesday role={role} />}
      {tab === 'log' && <Log role={role} />}
    </>
  )
}

function Report({ role }) {
  const { db, update, setToast } = useStore()
  const empty = { student: '', did: '', notes: '', next: '' }
  const [f, setF] = useState(empty)
  const write = role === 'lead' || role === 'darlene'
  return (
    <div className="two">
      {write && <div className="panel">
        <h2>New lesson report</h2>
        <div className="field"><label htmlFor="rs">Student</label><input id="rs" type="text" value={f.student} onChange={e => setF({ ...f, student: e.target.value })} /></div>
        <div className="field"><label htmlFor="rd">What we did today</label><span className="hint">Core lesson areas and the end product</span><textarea id="rd" value={f.did} onChange={e => setF({ ...f, did: e.target.value })} /></div>
        <div className="field"><label htmlFor="rn">Student notes</label><span className="hint">How were they today? Progress, enjoyment, difficulties, what to work on next. Always word it positively.</span><textarea id="rn" value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></div>
        <div className="field"><label htmlFor="rx">Next lesson</label><input id="rx" type="text" value={f.next} onChange={e => setF({ ...f, next: e.target.value })} /></div>
        <button className="btn y" disabled={!f.student || !f.did} onClick={() => { update(db => db.reports.unshift({ ...f, id: 'lr' + Date.now(), date: TODAY })); setF(empty); setToast('Report saved and ready to send to the parent') }}>Save report</button>
      </div>}
      <div className="panel">
        <h2>Recent reports</h2>
        {db.reports.map(r => (
          <div key={r.id} style={{ fontSize: 14, borderBottom: '1px solid var(--line)', paddingBottom: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <b>{r.student} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {fmtDate(r.date)}</span></b>
            <span><b>Today:</b> {r.did}</span><span><b>Notes:</b> {r.notes}</span><span><b>Next:</b> {r.next}</span>
          </div>))}
      </div>
    </div>
  )
}

function Tuesday({ role }) {
  const { db, update, setToast } = useStore()
  const empty = { classes: '', restock: '', ask: '' }
  const [f, setF] = useState(empty)
  return (
    <div className="two">
      {role === 'lead' ? <div className="panel">
        <h2>This week’s update</h2>
        <div className="field"><label htmlFor="tc">1-1 classes this week</label><span className="hint">Who’s confirmed, who’s cancelling</span><textarea id="tc" value={f.classes} onChange={e => setF({ ...f, classes: e.target.value })} /></div>
        <div className="field"><label htmlFor="tr">Out of stock or running low</label><textarea id="tr" value={f.restock} onChange={e => setF({ ...f, restock: e.target.value })} /></div>
        <div className="field"><label htmlFor="ta">Anything big this week, Darlene?</label><span className="hint">Events or things to plan around</span><textarea id="ta" value={f.ask} onChange={e => setF({ ...f, ask: e.target.value })} /></div>
        <button className="btn y" disabled={!f.classes} onClick={() => { update(db => db.tuesday.unshift({ ...f, date: TODAY })); setF(empty); setToast('Sent to Darlene') }}>Send to Darlene</button>
      </div> : <div className="lock">The lead instructor sends this every Tuesday. It lands here for you.</div>}
      <div className="panel">
        <h2>Past updates</h2>
        {db.tuesday.length === 0 ? <div className="empty">No updates yet. The first one arrives on Tuesday.</div> : db.tuesday.map((u, i) => (
          <div key={i} style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}><b>{fmtDate(u.date)}</b><span><b>Classes:</b> {u.classes}</span>{u.restock && <span><b>Restock:</b> {u.restock}</span>}{u.ask && <span><b>For Darlene:</b> {u.ask}</span>}</div>))}
      </div>
    </div>
  )
}

function Log({ role }) {
  const { db, update, setToast } = useStore()
  const empty = { from: '', kind: 'Sick', what: '', action: '', escalate: false }
  const [f, setF] = useState(empty)
  const list = role === 'darlene' ? [...db.log].sort((a, b) => b.escalate - a.escalate) : db.log
  return (
    <div className="two">
      {role === 'ops' ? <div className="panel">
        <h2>Log a staff message</h2>
        <div className="row2">
          <div className="field"><label htmlFor="lf">From</label><input id="lf" type="text" value={f.from} onChange={e => setF({ ...f, from: e.target.value })} /></div>
          <div className="field"><label htmlFor="lk">Type</label><select id="lk" value={f.kind} onChange={e => setF({ ...f, kind: e.target.value })}>{['Sick', 'Running late', 'Update', 'Payment request', 'Other'].map(k => <option key={k}>{k}</option>)}</select></div>
        </div>
        <div className="field"><label htmlFor="lw">What they asked or said</label><textarea id="lw" value={f.what} onChange={e => setF({ ...f, what: e.target.value })} /></div>
        <div className="field"><label htmlFor="la">Action taken</label><input id="la" type="text" value={f.action} onChange={e => setF({ ...f, action: e.target.value })} /></div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700 }}><input type="checkbox" checked={f.escalate} onChange={e => setF({ ...f, escalate: e.target.checked })} /> Darlene needs to decide or know</label>
        <button className="btn y" disabled={!f.from || !f.what} onClick={() => { update(db => db.log.unshift({ ...f, id: 'l' + Date.now(), date: TODAY })); setF(empty); setToast(f.escalate ? 'Logged and sent to Darlene' : 'Logged') }}>Save to the log</button>
      </div> : <div className="lock">The ops manager logs every staff message here. Anything marked for you is at the top.</div>}
      <div className="panel">
        <h2>Log</h2>
        {list.map(l => (
          <div key={l.id} style={{ fontSize: 14, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
            <b>{l.kind}</b> · {l.from} · <span style={{ color: 'var(--muted)' }}>{fmtDate(l.date)}</span> {l.escalate && <span className="pill low">For Darlene</span>}
            <div style={{ color: 'var(--muted)' }}>{l.what}{l.action ? ` → ${l.action}` : ''}</div>
          </div>))}
      </div>
    </div>
  )
}
