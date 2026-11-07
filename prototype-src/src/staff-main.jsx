import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import './styles.css'
import Shell, { Framed } from './Shell.jsx'
import { useStore, useRoute } from './store.jsx'
import Staff from './staff/Staff.jsx'

function StaffApp() {
  const route = useRoute()
  const { toast, reset } = useStore()
  useEffect(() => { window.__glazeReset = reset }, [reset])
  const r = route === 'home' ? 'staff' : route.startsWith('staff') ? route : 'staff/' + route
  return <><Staff route={r} />{toast && <div className="toast" role="status">{toast}</div>}</>
}

const framed = new URLSearchParams(location.search).has('frame')
createRoot(document.getElementById('root')).render(framed ? <Framed App={StaffApp} /> : <Shell kind="staff" App={StaffApp} />)
