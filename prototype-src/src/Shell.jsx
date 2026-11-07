import { useEffect, useRef, useState } from 'react'
import { StoreProvider, useStore } from './store.jsx'

// Checked once when the page opens. A computer has a fine pointer that can hover
// and a reasonably wide screen; anything else gets the phone layout.
const detect = () => (window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 900 ? 'desktop' : 'phone')
const ss = { get: k => { try { return sessionStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { sessionStorage.setItem(k, v) } catch (e) {} } }
const routeOf = h => (h || '').replace(/^#\/?/, '')
const BASE = import.meta.env.BASE_URL

const COPY = {
  site: {
    tag: 'Glaze website · prototype',
    tip: <>Try this: book a table or send an event request, then open the <a href={`${BASE}staff/`} target="_blank" rel="noopener">staff platform prototype</a> to see it arrive.</>,
    side: ['Phone view', 'This is how customers see the Glaze website on their phones.'],
  },
  staff: {
    tag: 'Glaze staff platform · prototype',
    tip: <>Try this: sign in as Darlene and approve a request. Sign out and back in as another role to see what each person can do.</>,
    side: ['Phone view', 'This is how staff use the platform on their phones, added to the home screen like an app.'],
  },
}

// Wraps either prototype with a slim preview bar: Desktop / Phone switch and a
// reset. Customer and staff prototypes are separate pages with no switch between them.
export default function Shell({ kind, App }) {
  const [native] = useState(detect)
  const key = 'glaze-view-' + kind
  const [mode, setMode] = useState(() => ss.get(key) || native)
  const [route, setRoute] = useState(routeOf(location.hash))
  const [tip, setTip] = useState(() => ss.get('glaze-tip-' + kind) !== 'off')
  const frame = useRef(null)
  const direct = mode === native
  const c = COPY[kind]
  useEffect(() => ss.set(key, mode), [mode])

  const onFrameLoad = () => {
    const w = frame.current?.contentWindow; if (!w) return
    const f = () => { const r = routeOf(w.location.hash); setRoute(r); history.replaceState(null, '', r ? '#/' + r : location.pathname) }
    w.addEventListener('hashchange', f); f()
  }
  useEffect(() => {
    if (!direct) return
    const f = () => setRoute(routeOf(location.hash))
    addEventListener('hashchange', f); return () => removeEventListener('hashchange', f)
  }, [direct])

  const closeTip = () => { setTip(false); ss.set('glaze-tip-' + kind, 'off') }
  const src = `${location.pathname}?frame=1${route ? '#/' + route : ''}`

  const bar = reset => (
    <>
      <div className="protobar"><div className="in">
        <span className="tag">{c.tag}</span>
        <span className="msg">Example data only. Nothing is sent or charged.</span>
        <div className="ctrls">
          <div className="seg" role="group" aria-label="Preview size">
            <button className={mode === 'desktop' ? 'on' : ''} onClick={() => setMode('desktop')} aria-pressed={mode === 'desktop'}>Desktop view</button>
            <button className={mode === 'phone' ? 'on' : ''} onClick={() => setMode('phone')} aria-pressed={mode === 'phone'}>Phone view</button>
          </div>
          <button className="reset" onClick={reset}>Reset demo</button>
        </div>
      </div></div>
      {tip && <div className="tip"><div className="in">
        <span>{c.tip}</span>
        <button onClick={closeTip} aria-label="Hide tip">×</button>
      </div></div>}
    </>
  )

  if (direct) return <StoreProvider><DirectBar bar={bar} /><App /></StoreProvider>

  const resetFramed = () => { const w = frame.current?.contentWindow; w && w.__glazeReset && w.__glazeReset() }
  return (
    <>
      {bar(resetFramed)}
      {mode === 'phone'
        ? <div className="stage">
            <div className="side"><h2>{c.side[0]}</h2><p>{c.side[1]}</p><p>Scroll and tap inside the phone. Switch to Desktop view at the top to see the full-size version.</p></div>
            <div className="phone"><iframe ref={frame} title="Phone preview" src={src} onLoad={onFrameLoad} /></div>
          </div>
        : <Scaled frame={frame} src={src} onLoad={onFrameLoad} />}
    </>
  )
}

export function Framed({ App }) {
  return <StoreProvider><App /></StoreProvider>
}

function DirectBar({ bar }) {
  const { reset } = useStore()
  return bar(reset)
}

// Desktop view on a phone: render the page at 1280px wide and shrink it to fit.
function Scaled({ frame, src, onLoad }) {
  const box = useRef(null)
  const [s, setS] = useState({ scale: 0.3, h: 600 })
  useEffect(() => {
    const f = () => {
      const top = box.current ? box.current.getBoundingClientRect().top + window.scrollY : 0
      const w = document.documentElement.clientWidth
      setS({ scale: w / 1280, h: Math.max(400, window.innerHeight - top) })
    }
    f(); addEventListener('resize', f); return () => removeEventListener('resize', f)
  }, [])
  return (
    <div ref={box} className="scaled" style={{ height: s.h }}>
      <iframe ref={frame} title="Desktop preview" src={src} onLoad={onLoad} style={{ width: 1280, height: s.h / s.scale, transform: `scale(${s.scale})` }} />
    </div>
  )
}
