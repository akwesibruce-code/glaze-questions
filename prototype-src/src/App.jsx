import { useEffect } from 'react'
import { useStore, useRoute } from './store.jsx'
import Site from './customer/Site.jsx'
import Staff from './staff/Staff.jsx'

// The app itself, without the preview bar. The Shell decides whether it is
// shown directly or inside a phone frame / scaled desktop frame.
export default function App() {
  const route = useRoute()
  const { toast, reset } = useStore()
  useEffect(() => { window.__glazeReset = reset }, [reset])
  return (
    <>
      {route.startsWith('staff') ? <Staff route={route} /> : <Site route={route} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
