import { go, useStore } from '../store.jsx'
import { img, logo } from '../assets.js'
import Events from './Events.jsx'
import Workshops from './Workshops.jsx'
import Menu from './Menu.jsx'

const I = {
  home: <path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5" />,
  events: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  workshops: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  menu: <path d="M5 7h14M5 12h14M5 17h9" />,
}
const NAV = [['home', 'Home'], ['events', 'Events'], ['workshops', 'Workshops'], ['menu', 'Art menu']]

export default function Site({ route }) {
  const { setToast } = useStore()
  const page = NAV.some(n => n[0] === route.split('/')[0]) ? route.split('/')[0] : 'home'
  return (
    <div className="site">
      <header className="top"><div className="wrap">
        <button className="brand" onClick={() => go('home')} aria-label="Glaze home"><img src={logo} alt="Glaze Art Studio" /></button>
        <nav aria-label="Main">{NAV.map(([k, l]) => <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}>{l}</button>)}</nav>
        <button className="wa" onClick={() => setToast('Opens a WhatsApp chat with Glaze: 055 324 6316')}>WhatsApp us</button>
        <button className="btn y cta" onClick={() => go('events')}>Plan an event</button>
      </div></header>
      <main>
        {page === 'events' ? <Events /> : page === 'workshops' ? <Workshops /> : page === 'menu' ? <Menu /> : <Home />}
      </main>
      <Footer />
      <nav className="bnav" aria-label="Main">
        {NAV.map(([k, l]) => (
          <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)} aria-current={page === k ? 'page' : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[k]}</svg>
            {l === 'Art menu' ? 'Menu' : l}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Home() {
  return (
    <>
      <section className="hero"><div className="wrap">
        <div className="txt">
          <h1>Create something beautiful</h1>
          <p>An art studio in Labone for kids, adults and groups. Walk in, book a workshop, or host your next celebration with us.</p>
          <div className="acts">
            <button className="btn y" onClick={() => go('events')}>Plan an event</button>
            <button className="btn ghost" onClick={() => go('workshops')}>This month’s workshops</button>
          </div>
        </div>
        <img className="ph" src={img('studio')} alt="Inside the Glaze studio in Labone" />
      </div></section>
      <section className="sec"><div className="wrap">
        <h2>What’s on at Glaze</h2>
        <div className="tiles">
          <button className="tile" onClick={() => go('events')}><img src={img('kids')} alt="" /><span>Birthdays and events</span></button>
          <button className="tile" onClick={() => go('workshops')}><img src={img('calabash')} alt="" /><span>Monthly workshops</span></button>
          <button className="tile" onClick={() => go('menu')}><img src={img('paint')} alt="" /><span>Art menu</span></button>
          <button className="tile" onClick={() => go('menu')}><img src={img('collage')} alt="" /><span>Walk-ins welcome</span></button>
        </div>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="visit">
          <b>Visit us</b>
          <span>Peter Ala Adjetey Avenue, Labone, Accra. Second floor, above Melcom.</span>
          <span>Closed Mondays and Tuesdays.</span>
        </div>
      </div></section>
    </>
  )
}

function Footer() {
  return (
    <footer className="foot"><div className="wrap">
      <img src={logo} alt="Glaze Art Studio" />
      <div className="cols">
        <div><b>Visit</b><br />Peter Ala Adjetey Avenue, Labone, Accra. Second floor, above Melcom.</div>
        <div><b>Contact</b><br />055 324 6316<br />operations@glazegh.com</div>
        <div><b>Follow</b><br />Instagram @glazeartgh<br />The Glaze WhatsApp channel</div>
      </div>
    </div></footer>
  )
}
