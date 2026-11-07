import { useEffect, useRef, useState } from 'react'
import App from './App.jsx'
import { StoreProvider, useStore } from './store.jsx'

// A computer has a mouse or trackpad that can hover. Phones and tablets don't.
// Checked once when the page opens. A computer has a fine pointer that can hover
// and a reasonably wide screen; anything else gets the phone layout.
const detect = () => (window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 900 ? 'desktop' : 'phone')
const ss = { get: k => { try { return sessionStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { sessionStorage.setItem(k, v) } catch (e) {} } }
const routeOf = h => (h || '').replace(/^#\/?/, '') || 'home'

export default function Shell() {
  const [native] = useState(detect)
  const [mode, setMode] = useState(() => ss.get('glaze-view') || native)
  const [route, setRoute] = useState(routeOf(location.hash))
  const [tip, setTip] = useState(() => ss.get('glaze-tip') !== 'off')
  const frame = useRef(null)
  const direct = mode === native
  useEffect(() => ss.set('glaze-view', mode), [mode])

  // keep the shell's route in step with whichever window shows the app
  useEffect(() => {
    if (direct) {
      const f = () => setRoute(routeOf(location.hash))
      addEventListener('hashchange', f); return () => removeEventListener('hashchange', f)
    }
  }, [direct])
  const onFrameLoad = () => {
    const w = frame.current?.contentWindow; if (!w) return
    const f = () => { const r = routeOf(w.location.hash); setRoute(r); history.replaceState(null, '', '#/' + r) }
    w.addEventListener('hashchange', f); f()
  }
  const nav = path => {
    if (direct) location.hash = '/' + path
    else if (frame.current) frame.current.contentWindow.location.hash = '/' + path
  }
  const closeTip = () => { setTip(false); ss.set('glaze-tip', 'off') }
  const src = `${location.pathname}?frame=1#/${route}`

  const bar = reset => (
    <>
      <div className="protobar"><div className="in">
        <span className="tag">Glaze prototype</span>
        <span className="msg">Example data only. Nothing is sent or charged.</span>
        <div className="ctrls">
          <div className="seg" role="group" aria-label="Which side of the app">
            <button className={!route.startsWith('staff') ? 'on' : ''} onClick={() => nav('home')}>Customer site</button>
            <button className={route.startsWith('staff') ? 'on' : ''} onClick={() => nav('staff')}>Staff app</button>
          </div>
          <div className="seg" role="group" aria-label="Preview size">
            <button className={mode === 'desktop' ? 'on' : ''} onClick={() => setMode('desktop')} aria-pressed={mode === 'desktop'}>Desktop</button>
            <button className={mode === 'phone' ? 'on' : ''} onClick={() => setMode('phone')} aria-pressed={mode === 'phone'}>Phone</button>
          </div>
          <button className="reset" onClick={reset}>Reset demo</button>
        </div>
      </div></div>
      {tip && <div className="tip"><div className="in">
        <span><b>Try this:</b> send an event request on the customer site, then open the Staff app and approve it as Darlene. Use “Signed in as” to see each role.</span>
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
            <div className="side">
              <h2>Phone view</h2>
              <p>This is how customers and staff see Glaze on their phones.</p>
              <p>Scroll and tap inside the phone. Switch to Desktop at the top to see the full website.</p>
            </div>
            <div className="phone"><iframe ref={frame} title="Glaze on a phone" src={src} onLoad={onFrameLoad} /></div>
          </div>
        : <Scaled frame={frame} src={src} onLoad={onFrameLoad} />}
    </>
  )
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
      <iframe ref={frame} title="Glaze on a desktop" src={src} onLoad={onLoad} style={{ width: 1280, height: s.h / s.scale, transform: `scale(${s.scale})` }} />
    </div>
  )
}
