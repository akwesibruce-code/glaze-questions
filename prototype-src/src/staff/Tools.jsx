import { useState } from 'react'
import { useStore } from '../store.jsx'
import { fmtDate, TODAY, ROLES } from '../data.js'
import PhoneInput, { fmtPhone } from '../PhoneInput.jsx'

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
  const can = ROLES[role].can
  const empty = { student: '', parent: '', wa: { cc: '+233', num: '' }, did: '', notes: '', next: '' }
  const [f, setF] = useState(empty)
  const [open, setOpen] = useState(null)
  const write = role === 'lead' || role === 'darlene'
  const msg = r => `Hello ${r.parent.replace('Example ', '')}, here is ${r.student.replace(/^Example /, '').replace(/ \(.*\)$/, '')}’s lesson report from Glaze.\n\nWhat we did today: ${r.did}\n\nHow they got on: ${r.notes}\n\nNext lesson: ${r.next}\n\nThank you!\nGlaze Art Studio`
  const save = () => {
    update(db => db.reports.unshift({ id: 'lr' + Date.now(), date: TODAY, status: role === 'darlene' ? 'ready' : 'review', student: f.student, parent: f.parent, parentPhone: fmtPhone(f.wa), did: f.did, notes: f.notes, next: f.next }))
    setF(empty); setToast(role === 'darlene' ? 'Report saved' : 'Report sent for review')
  }
  const send = r => {
    update(db => { const x = db.reports.find(k => k.id === r.id); x.status = 'sent'; x.sentOn = TODAY })
    setOpen(null); setToast(`Report sent to ${r.parent.replace('Example ', '')} on WhatsApp`)
  }
  const STATUS = { review: ['quoted', 'Waiting for review'], ready: ['new', 'Ready to send'], sent: ['booked', 'Sent to parent'] }
  return (
    <div className="two">
      {write && <div className="panel">
        <h2>New lesson report</h2>
        <div className="row2">
          <div className="field"><label htmlFor="rs">Student</label><input id="rs" type="text" value={f.student} onChange={e => setF({ ...f, student: e.target.value })} /></div>
          <div className="field"><label htmlFor="rp">Parent’s name</label><input id="rp" type="text" value={f.parent} onChange={e => setF({ ...f, parent: e.target.value })} /></div>
        </div>
        <PhoneInput id="rw" label="Parent’s WhatsApp" value={f.wa} onChange={v => setF({ ...f, wa: v })} />
        <div className="field"><label htmlFor="rd">What we did today</label><span className="hint">Core lesson areas and the end product</span><textarea id="rd" value={f.did} onChange={e => setF({ ...f, did: e.target.value })} /></div>
        <div className="field"><label htmlFor="rn">Student notes</label><span className="hint">How were they today? Progress, enjoyment, difficulties, what to work on next. Always word it positively.</span><textarea id="rn" value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></div>
        <div className="field"><label htmlFor="rx">Next lesson</label><input id="rx" type="text" value={f.next} onChange={e => setF({ ...f, next: e.target.value })} /></div>
        <button className="btn y" disabled={!f.student || !f.did || !f.parent || !f.wa.num} onClick={save}>{role === 'darlene' ? 'Save report' : 'Send for review'}</button>
        {role === 'lead' && <p className="lead" style={{ fontSize: 13, margin: 0 }}>Darlene or the ops manager reads it, then it goes to the parent on WhatsApp.</p>}
      </div>}
      <div className="panel">
        <h2>Reports <small>{db.reports.filter(r => r.status === 'review').length} waiting for review</small></h2>
        {db.reports.map(r => {
          const [cls, label] = STATUS[r.status || 'sent']
          return (
            <div key={r.id} className="logitem">
              <span style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}><b>{r.student}</b><span className="meta">· {fmtDate(r.date)}</span><span className={'pill ' + cls} style={{ marginLeft: 'auto' }}>{label}</span></span>
              <span className="meta">For {r.parent}{r.parentPhone ? ` · ${r.parentPhone}` : ''}</span>
              <span><b>Today:</b> {r.did}</span><span><b>Notes:</b> {r.notes}</span><span><b>Next:</b> {r.next}</span>
              {can.review && r.status !== 'sent' && (open === r.id ? <>
                <pre className="msgprev">{msg(r)}</pre>
                <div className="acts"><button className="btn y sm" onClick={() => send(r)}>Send to parent on WhatsApp</button><button className="btn o sm" onClick={() => setOpen(null)}>Not yet</button></div>
              </> : <button className="btn b sm" style={{ alignSelf: 'flex-start' }} onClick={() => setOpen(r.id)}>Review and send</button>)}
            </div>
          )
        })}
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
          <div key={i} className="logitem"><b>{fmtDate(u.date)}</b><span><b>Classes:</b> {u.classes}</span>{u.restock && <span><b>Restock:</b> {u.restock}</span>}{u.ask && <span><b>For Darlene:</b> {u.ask}</span>}</div>))}
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
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700, cursor: 'pointer' }}><input type="checkbox" style={{ width: 20, height: 20, accentColor: 'var(--blue)' }} checked={f.escalate} onChange={e => setF({ ...f, escalate: e.target.checked })} /> Darlene needs to decide or know</label>
        <button className="btn y" disabled={!f.from || !f.what} onClick={() => { update(db => db.log.unshift({ ...f, id: 'l' + Date.now(), date: TODAY })); setF(empty); setToast(f.escalate ? 'Logged and sent to Darlene' : 'Logged') }}>Save to the log</button>
      </div> : <div className="lock">The ops manager logs every staff message here. Anything marked for you is at the top.</div>}
      <div className="panel">
        <h2>Log</h2>
        {list.map(l => (
          <div key={l.id} className="logitem">
            <b>{l.kind}</b> · {l.from} · <span style={{ color: 'var(--muted)' }}>{fmtDate(l.date)}</span> {l.escalate && <span className="pill low">For Darlene</span>}
            <div className="meta">{l.what}{l.action ? ` → ${l.action}` : ''}</div>
          </div>))}
      </div>
    </div>
  )
}
