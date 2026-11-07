import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import './styles.css'
import Shell, { Framed } from './Shell.jsx'
import { useStore, useRoute } from './store.jsx'
import Site from './customer/Site.jsx'

function SiteApp() {
  const route = useRoute()
  const { toast, reset } = useStore()
  useEffect(() => { window.__glazeReset = reset }, [reset])
  return <>{<Site route={route} />}{toast && <div className="toast" role="status">{toast}</div>}</>
}

const framed = new URLSearchParams(location.search).has('frame')
createRoot(document.getElementById('root')).render(framed ? <Framed App={SiteApp} /> : <Shell kind="site" App={SiteApp} />)
