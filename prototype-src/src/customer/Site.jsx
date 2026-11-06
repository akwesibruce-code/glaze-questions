import { go } from '../store.jsx'
import { img, logo } from '../assets.js'
import Events from './Events.jsx'
import Workshops from './Workshops.jsx'
import Menu from './Menu.jsx'

const NAV = [
  ['home', 'Home', '⌂'],
  ['events', 'Events', '✦'],
  ['workshops', 'Workshops', '◷'],
  ['menu', 'Menu', '☰'],
]

export default function Site({ route }) {
  const page = route.split('/')[0]
  return (
    <div className="site">
      <header className="top">
        <img src={logo} alt="Glaze Art Studio" onClick={() => go('home')} style={{ cursor: 'pointer' }} />
        <a className="wa" href="#/workshops">Join our WhatsApp channel</a>
      </header>
      {page === 'events' ? <Events /> : page === 'workshops' ? <Workshops /> : page === 'menu' ? <Menu /> : <Home />}
      <nav className="bnav" aria-label="Main">
        {NAV.map(([k, l, i]) => (
          <button key={k} className={(page === k || (k === 'home' && !NAV.some(n => n[0] === page))) ? 'on' : ''} onClick={() => go(k)}>
            <i aria-hidden="true">{i}</i>{l}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Home() {
  return (
    <>
      <section className="hero">
        <h1>Create something beautiful</h1>
        <p>An art studio in Labone for kids, adults and groups. Walk in, book a workshop or host your next celebration with us.</p>
        <img src={img('studio')} alt="Inside the Glaze studio" />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn y" onClick={() => go('events')}>Plan an event</button>
          <button className="btn o" style={{ background: 'transparent', color: '#fff', borderColor: '#6E95D6' }} onClick={() => go('workshops')}>This month’s workshops</button>
        </div>
      </section>
      <section className="sec">
        <h2>What’s on at Glaze</h2>
        <div className="tiles">
          <button className="tile" onClick={() => go('events')}><img src={img('kids')} alt="" /><span>Birthdays & events</span></button>
          <button className="tile" onClick={() => go('workshops')}><img src={img('calabash')} alt="" /><span>Workshops</span></button>
          <button className="tile" onClick={() => go('menu')}><img src={img('paint')} alt="" /><span>Art menu</span></button>
          <button className="tile" onClick={() => go('menu')}><img src={img('collage')} alt="" /><span>Walk-ins welcome</span></button>
        </div>
      </section>
      <section className="sec">
        <div className="info">
          <b>Visit us</b>
          <span>Peter Ala Adjetey Avenue, Labone, Accra. Second floor, above Melcom.</span>
          <span>Phone and WhatsApp: 055 324 6316</span>
          <span>Instagram: @glazeartgh</span>
        </div>
      </section>
    </>
  )
}
