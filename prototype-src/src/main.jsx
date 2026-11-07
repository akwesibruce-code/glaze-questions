import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import Shell from './Shell.jsx'
import { StoreProvider } from './store.jsx'

const framed = new URLSearchParams(location.search).has('frame')

createRoot(document.getElementById('root')).render(
  framed ? <StoreProvider><App /></StoreProvider> : <Shell />
)
