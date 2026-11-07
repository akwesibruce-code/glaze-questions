import { useState } from 'react'
import { useStore, go } from '../store.jsx'
import { img } from '../assets.js'
import { ADULT_MENU, KIDS_MENU, EVENT_TYPES, CAP_ART, CAP_OTHER, findActivity, isOffDay, ghs, TODAY } from '../data.js'
const blank = { type: '', audience: '', ages: '', celebrant: '', bookingName: '', date: '', time: '', duration: '2 hours', guests: '', activity: '', unsure: '', vendor: 'none', vendorName: '', vendorPhone: '', inspoFile: '', inspo: '', logistics: '', contactName: '', phone: '', email: '' }
const STEPS = ['Your event', 'Date and group', 'Activity', 'Food and decor', 'Your details']
const VENDORS = [
  ['none', 'We don’t need any', ''],
  ['own', 'I’ll use my own vendor', 'Free. We just need their contact to coordinate set-up.'],
  ['glaze', 'I’d like to use Glaze’s vendor', 'We handle everything and deal with the vendor for you.'],
]
const FAQ = [
  ['How many people can you host?', 'Up to 45 for art activities, depending on the activity, and around 70 for non-art events.'],
  ['Can we bring our own food or decor?', 'Yes. Share your vendor’s name and number so we can coordinate set-up. No extra fee. Or let us handle it with our vendors.'],
  ['Can we book a Monday or Tuesday?', 'Sometimes, depending on the event. An extra fee applies.'],
  ['Is there a group discount?', 'Groups of 6 or more get 10% off.'],
]

export default function Events() {
  const [step, setStep] = useState(-1)
  const [f, setF] = useState(blank)
  const [sent, setSent] = useState(false)
  const { update, setToast } = useStore()
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const to = n => { setStep(n); window.scrollTo(0, 0) }

  if (sent) return (
    <section className="sec"><div className="wrap"><div className="formwrap">
      <div className="card done">
        <img src={img('kids')} alt="" />
        <div className="big">Request sent!</div>
        <p style={{ margin: 0 }}>Thank you, {f.contactName.split(' ')[0] || 'friend'}. Our team will send your quote on WhatsApp and email <b>today</b>. Your date is held once the 70% deposit is paid.</p>
        <button className="btn b" onClick={() => go('staff/requests')}>See it arrive in the staff app</button>
        <button className="btn o" onClick={() => { setF(blank); setSent(false); to(-1) }}>Back to events</button>
      </div>
    </div></div></section>
  )

  if (step === -1) return (
    <>
      <section className="hero"><div className="wrap">
        <div className="txt">
          <h1>Host your event at Glaze</h1>
          <p>Birthdays, team bonding, group hangouts and pop-ups. Tell us what you have in mind and we’ll send you a quote the same day.</p>
          <div className="acts"><button className="btn y" onClick={() => to(0)}>Request a quote</button></div>
        </div>
        <img className="ph" src={img('kids')} alt="A child painting at Glaze" />
      </div></section>
      <section className="sec"><div className="wrap">
        <h2>How it works</h2>
        <div className="steps3">
          {[['Tell us about your event', 'Date, group size, activity and anything else we should know.'], ['Get your quote today', 'We review every request and send your quote on WhatsApp and email.'], ['Lock in your date', 'Pay a 70% deposit to confirm. The rest is paid on the day.']].map(([t, d], i) => (
            <div key={t} className="stepc"><span className="n">{i + 1}</span><div><b>{t}</b><span>{d}</span></div></div>
          ))}
        </div>
        <div className="chips">
          <button className="btn o sm" onClick={() => setToast('Kids party pack PDF opens here')}>Kids party pack (PDF)</button>
          <button className="btn o sm" onClick={() => setToast('Adults party pack PDF opens here')}>Adults party pack (PDF)</button>
        </div>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="twocol">
          <div className="faq">
            <h2 style={{ marginBottom: 12 }}>Good to know</h2>
            <div className="note info">Darlene is putting together the real questions. These are examples.</div>
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
          <div className="channel">
            <b>Ready when you are</b>
            <span>Tell us your date and group size. We’ll reply with a quote today.</span>
            <button className="btn y" onClick={() => to(0)}>Request a quote</button>
          </div>
        </div>
      </div></section>
    </>
  )

  const act = findActivity(f.activity)
  const g = +f.guests || 0
  const cap = act && !act.art ? CAP_OTHER : CAP_ART
  const tooSoon = f.date && (new Date(f.date) - new Date(TODAY)) / 864e5 < 7
  const ok = [
    f.type && f.audience && f.bookingName && (f.type !== 'Birthday' || f.celebrant),
    f.date && f.time && g > 0,
    f.activity || f.unsure,
    f.vendor !== 'own' || (f.vendorName && f.vendorPhone),
    f.contactName && f.phone,
  ][step]
  const menu = f.audience === 'Kids' ? KIDS_MENU : ADULT_MENU

  const submit = () => {
    update(db => db.requests.unshift({ ...f, id: 'r' + Date.now(), status: 'new', created: TODAY, guests: g, unsure: f.unsure.trim(), inspo: [f.inspoFile && `Photo: ${f.inspoFile}`, f.inspo].filter(Boolean).join(' · '), channel: 'Both' }))
    setSent(true); window.scrollTo(0, 0)
  }

  return (
    <section className="sec"><div className="wrap"><div className="formwrap">
      <button className="back" onClick={() => to(step - 1)}>← {step === 0 ? 'Back to events' : 'Back'}</button>
      <div className="progress"><small>Step {step + 1} of {STEPS.length}</small><div className="bar" aria-hidden="true">{STEPS.map((s, i) => <span key={s} className={i <= step ? 'on' : ''} />)}</div></div>
      <div className="card">
        <h2>{STEPS[step]}</h2>

        {step === 0 && <>
          <div className="field"><label>What are you celebrating?</label>
            <div className="chips">{EVENT_TYPES.map(t => <button key={t} className={'chip' + (f.type === t ? ' on' : '')} aria-pressed={f.type === t} onClick={() => set('type', t)}>{t}</button>)}</div></div>
          <div className="field"><label>Who is it for?</label>
            <div className="chips">{['Kids', 'Adults', 'Both'].map(t => <button key={t} className={'chip' + (f.audience === t ? ' on' : '')} aria-pressed={f.audience === t} onClick={() => set('audience', t)}>{t}</button>)}</div></div>
          <div className="row2">
            <div className="field"><label htmlFor="ages">Age range <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span></label><input id="ages" type="text" placeholder="e.g. 6 to 8" value={f.ages} onChange={e => set('ages', e.target.value)} /></div>
            {f.type === 'Birthday' && <div className="field"><label htmlFor="cel">Birthday star’s name</label><input id="cel" type="text" value={f.celebrant} onChange={e => set('celebrant', e.target.value)} /></div>}
          </div>
          <div className="field"><label htmlFor="bn">Name for the booking or organisation</label><input id="bn" type="text" value={f.bookingName} onChange={e => set('bookingName', e.target.value)} /></div>
        </>}

        {step === 1 && <>
          <div className="row2">
            <div className="field"><label htmlFor="d">Date</label><input id="d" type="date" min={TODAY} value={f.date} onChange={e => set('date', e.target.value)} /></div>
            <div className="field"><label htmlFor="t">Start time</label><input id="t" type="time" value={f.time} onChange={e => set('time', e.target.value)} /></div>
          </div>
          {isOffDay(f.date) && <div className="note warn">We’re usually closed on Mondays and Tuesdays. We can sometimes open for events, with an extra fee. We’ll confirm in your quote.</div>}
          <div className="row2">
            <div className="field"><label htmlFor="du">How long?</label>
              <select id="du" value={f.duration} onChange={e => set('duration', e.target.value)}>{['1.5 hours', '2 hours', '3 hours', '4 hours', 'Not sure yet'].map(x => <option key={x}>{x}</option>)}</select></div>
            <div className="field"><label htmlFor="g">Number of guests</label><input id="g" type="number" min="1" inputMode="numeric" value={f.guests} onChange={e => set('guests', e.target.value)} /></div>
          </div>
          <span className="lead" style={{ fontSize: 13 }}>Groups of 6 or more get 10% off.</span>
          {g > CAP_ART && <div className="note warn">For art activities we can host up to {CAP_ART} people, depending on the activity. Non-art events go up to about {CAP_OTHER}. Send your request and we’ll work it out with you.</div>}
        </>}

        {step === 2 && <>
          <p className="lead">Prices are per person. Pick one, or tell us you’re not sure yet.</p>
          {f.audience === 'Both' && <div className="note info">Showing the adult menu. Kids’ options can be added in your quote.</div>}
          <div className="acts-list">
            {menu.map(a => (
              <button key={a.id} className={'act' + (f.activity === a.id ? ' on' : '')} aria-pressed={f.activity === a.id} onClick={() => { set('activity', a.id); set('unsure', '') }}>
                <div className="nm"><b>{a.name}</b><small>{a.blurb}</small></div>
                <span className="p">{a.wood ? 'from ' : ''}{ghs(a.price)}{a.star && <small>min. 4 people</small>}</span>
              </button>
            ))}
            <button className={'act' + (!f.activity && f.unsure ? ' on' : '')} aria-pressed={!f.activity && !!f.unsure} onClick={() => { set('activity', ''); set('unsure', f.unsure || ' ') }}>
              <div className="nm"><b>I’m not sure yet</b><small>Tell us the vibe and we’ll suggest something.</small></div>
            </button>
          </div>
          {!f.activity && f.unsure && <div className="field"><label htmlFor="un">What do you have in mind?</label><textarea id="un" value={f.unsure.trim()} onChange={e => set('unsure', e.target.value || ' ')} /></div>}
          {act && act.star && (g < 4 || tooSoon) && <div className="note warn">{act.name} needs at least 4 people and a week’s notice.</div>}
          {act && act.wood && <div className="note info">Woodworking is curated with you. Prices start from GH₵600 and depend on the piece you make.</div>}
          {act && g > cap && <div className="note warn">This activity usually takes up to {cap} people.</div>}
        </>}

        {step === 3 && <>
          <div className="field"><label>Food, cake or decor</label>
            <div className="cardlist">
              {VENDORS.map(([k, t, d]) => (
                <button key={k} className={'opt' + (f.vendor === k ? ' on' : '')} aria-pressed={f.vendor === k} onClick={() => set('vendor', k)}>
                  <span className="dot" aria-hidden="true" /><div><b>{t}</b>{d && <small>{d}</small>}</div>
                </button>
              ))}
            </div></div>
          {f.vendor === 'own' && <div className="row2">
            <div className="field"><label htmlFor="vn">Vendor name</label><input id="vn" type="text" value={f.vendorName} onChange={e => set('vendorName', e.target.value)} /></div>
            <div className="field"><label htmlFor="vp">Vendor phone</label><input id="vp" type="tel" value={f.vendorPhone} onChange={e => set('vendorPhone', e.target.value)} /></div>
          </div>}
          {f.vendor === 'glaze' && <>
            <div className="field"><label htmlFor="up">Upload your inspiration</label><span className="hint">Photos of decor, colours or themes you love, so we can quote.</span>
              <input id="up" type="file" accept="image/*" onChange={e => set('inspoFile', e.target.files[0]?.name || '')} /></div>
            <div className="field"><label htmlFor="iv">Or describe it</label><textarea id="iv" value={f.inspo} onChange={e => set('inspo', e.target.value)} placeholder="Colours, theme, table set-up…" /></div>
          </>}
          <div className="field"><label htmlFor="lg">Anything else we should know? <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span></label><textarea id="lg" value={f.logistics} onChange={e => set('logistics', e.target.value)} placeholder="Cake time, music, set-up, accessibility…" /></div>
        </>}

        {step === 4 && <>
          <div className="field"><label htmlFor="cn">Your name</label><input id="cn" type="text" autoComplete="name" value={f.contactName} onChange={e => set('contactName', e.target.value)} /></div>
          <div className="row2">
            <div className="field"><label htmlFor="ph">WhatsApp number</label><input id="ph" type="tel" autoComplete="tel" value={f.phone} onChange={e => set('phone', e.target.value)} /></div>
            <div className="field"><label htmlFor="em">Email <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span></label><input id="em" type="email" autoComplete="email" value={f.email} onChange={e => set('email', e.target.value)} /></div>
          </div>
          <div className="note info">We’ll send your quote on WhatsApp and email today. A 70% deposit locks in your date.</div>
        </>}
      </div>

      <div className="stickynext">
        {step < 4
          ? <button className="btn b full" disabled={!ok} onClick={() => to(step + 1)}>Continue</button>
          : <button className="btn y full" disabled={!ok} onClick={submit}>Send my request</button>}
        {!ok && <p className="lead" style={{ fontSize: 13, textAlign: 'center', margin: '8px auto 0' }}>Fill in the details above to continue.</p>}
      </div>
    </div></div></section>
  )
}
