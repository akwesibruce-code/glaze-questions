import { useStore, useRoute, go } from './store.jsx'
import Site from './customer/Site.jsx'
import Staff from './staff/Staff.jsx'

export default function App() {
  const route = useRoute()
  const { reset, toast } = useStore()
  const isStaff = route.startsWith('staff')
  return (
    <>
      <div className="protobar">
        <b>Prototype</b><span>Example data only. Nothing is sent or charged.</span>
        <div className="sw">
          <button className={!isStaff ? 'on' : ''} onClick={() => go('home')}>Customer site</button>
          <button className={isStaff ? 'on' : ''} onClick={() => go('staff')}>Staff app</button>
        </div>
        <button className="reset" onClick={reset}>Reset demo</button>
      </div>
      {isStaff ? <Staff route={route} /> : <Site route={route} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
