import { createContext, useContext, useEffect, useState } from 'react'
import { seed } from './data.js'

const KEY = 'glaze-proto-v2'
const Ctx = createContext(null)

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.requests) return s } catch (e) {}
  return seed()
}

export function StoreProvider({ children }) {
  const [db, setDb] = useState(load)
  const [toast, setToast] = useState('')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch (e) {} }, [db])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t) }, [toast])
  const update = fn => setDb(prev => { const next = structuredClone(prev); fn(next); return next })
  const reset = () => { setDb(seed()); setToast('Example data reset') }
  return <Ctx.Provider value={{ db, update, reset, toast, setToast }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

export function useRoute() {
  const get = () => (location.hash.replace(/^#\/?/, '') || 'home')
  const [r, setR] = useState(get)
  useEffect(() => { const f = () => { setR(get()); window.scrollTo(0, 0) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  return r
}

export const go = path => { location.hash = '/' + path }
