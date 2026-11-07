import { go, useStore } from '../store.jsx'
import { useReveal, useScrolled } from '../motion.js'
import { img, logo } from '../assets.js'
import { ADULT_MENU, ghs, fmtDate } from '../data.js'
import Events from './Events.jsx'
import Calendar from './Workshops.jsx'
import Menu from './Menu.jsx'
import Book from './Book.jsx'
import Contact from './Contact.jsx'

// Same tabs as glazegh.com today: Art Menu, Events, Calendar, Contact, Book Now.
const NAV = [['art-menu', 'Art Menu'], ['events', 'Events'], ['calendar', 'Calendar'], ['contact', 'Contact']]
const I = {
  home: <path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5" />,
  'art-menu': <><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.8-1.8 0-1.2-1-1.6-1-2.7 0-.9.8-1.5 1.7-1.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>,
  events: <><path d="M12 3l2.5 5.5L20 9.3l-4 4 1 5.7L12 16.3 7 19l1-5.7-4-4 5.5-.8Z" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  book: <><path d="M4 10h16M6 10v9M18 10v9M3 7h18" /></>,
}
const BOTTOM = [['home', 'Home'], ['art-menu', 'Menu'], ['events', 'Events'], ['calendar', 'Calendar'], ['book', 'Book']]

export default function Site({ route }) {
  const { setToast } = useStore()
  const page = route.split('/')[0] || 'home'
  useScrolled()
  useReveal(route)
  return (
    <div className="site">
      <a className="skip" href="#main">Skip to content</a>
      <header className="top"><div className="wrap">
        <button className="brand" onClick={() => go('home')} aria-label="Glaze home"><img src={logo} alt="Glaze Art Studio" /></button>
        <nav aria-label="Main">{NAV.map(([k, l]) => <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}>{l}</button>)}</nav>
        <button className="wa" onClick={() => setToast('Opens a WhatsApp chat with Glaze: 055 324 6316')}>WhatsApp</button>
        <button className="btn y cta" onClick={() => go('book')}>Book now</button>
      </div></header>
      <main id="main" key={page} className="pagein">
        {page === 'events' ? <Events />
          : page === 'calendar' ? <Calendar />
          : page === 'art-menu' ? <Menu />
          : page === 'book' ? <Book />
          : page === 'contact' ? <Contact />
          : <Home />}
      </main>
      <Footer />
      <nav className="bnav b5" aria-label="Main">
        {BOTTOM.map(([k, l]) => (
          <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)} aria-current={page === k ? 'page' : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[k]}</svg>{l}
          </button>
        ))}
      </nav>
    </div>
  )
}

const ACTS = ['canvas painting', 'calabash bowls', 'clay modelling', 'candle making', 'charcoal sketching', 'tote bags', 'mixed media collage', 'paint & plant', 'woodworking', 'basket weaving']

function Home() {
  const { db } = useStore()
  const picks = ['canvas', 'calabash-s', 'clay-250', 'candle-1', 'collage', 'charm'].map(id => ADULT_MENU.find(a => a.id === id))
  const upcoming = db.workshops.slice(0, 3)
  return (
    <>
      <section className="hero home"><div className="wrap">
        <div className="txt">
          <span className="eyebrow">glaze art studio · Labone, Accra</span>
          <h1 className="lc">where creativity never ends</h1>
          <p>A multipurpose creative studio in the heart of Labone. Walk in and paint, join a workshop, or host your next celebration with us.</p>
          <div className="acts">
            <button className="btn y" onClick={() => go('book')}>Book a reservation</button>
            <button className="btn ghost" onClick={() => go('events')}>Host an event</button>
          </div>
        </div>
        <div className="collage">
          <img className="c1" src={img('studio')} alt="Inside the Glaze studio" />
          <img className="c2" src={img('paint')} alt="Painting at a Glaze table" />
          <img className="c3" src={img('apron')} alt="A Glaze instructor in a Glaze apron" />
        </div>
      </div></section>

      <div className="ribbon" aria-hidden="true"><div className="track">{[...ACTS, ...ACTS].map((a, i) => <span key={i}>{a}<i>✦</i></span>)}</div></div>

      <section className="sec"><div className="wrap">
        <h2 className="lc">three ways to create</h2>
        <div className="ways">
          {[
            ['book', 'walk in & paint', 'Pick a table, choose your art when you arrive. Kids from GH₵150, adults from GH₵200.', 'Book a table', 'kids'],
            ['calendar', 'monthly workshops', 'A new schedule every month: candles, clay, sketching and more, with an instructor.', 'See the calendar', 'calabash'],
            ['events', 'host an event', 'Birthdays, team bonding, exhibitions and private bookings. Same-day quotes.', 'Enquire now', 'collage'],
          ].map(([to, t, d, cta, ph]) => (
            <article key={to} className="way" onClick={() => go(to)}>
              <img src={img(ph)} alt="" />
              <div className="body"><h3 className="lc">{t}</h3><p>{d}</p><button className="btn b sm" onClick={e => { e.stopPropagation(); go(to) }}>{cta}</button></div>
            </article>
          ))}
        </div>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="head-row"><h2 className="lc">this month at glaze</h2><button className="btn o sm" onClick={() => go('calendar')}>Full calendar</button></div>
        <div className="hscroll">
          {upcoming.map(w => {
            const left = w.spots - w.booked - w.holds.length
            return (
              <button key={w.id} className="mini" onClick={() => go('calendar')}>
                <img src={img(w.img)} alt="" />
                <span className="d"><b>{new Date(w.date + 'T12:00:00').getDate()}</b>{new Date(w.date + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short' })}</span>
                <span className="t"><b>{w.title}</b><small>{fmtDate(w.date)} · {w.time} · {ghs(w.price)}</small><em className={left <= 0 ? 'full' : ''}>{left <= 0 ? 'Fully booked · waitlist open' : `${left} spots left`}</em></span>
              </button>
            )
          })}
        </div>
      </div></section>

      <section className="sec band"><div className="wrap split">
        <img src={img('kids')} alt="Children painting at a Glaze birthday party" />
        <div className="txt">
          <h2 className="lc">host an event</h2>
          <ul className="ticks">{['Birthdays', 'Corporate events', 'Workshops', 'Art exhibitions', 'Private bookings', 'and more…'].map(x => <li key={x}>{x}</li>)}</ul>
          <div className="facts"><span><b>45</b> creating at once</span><span><b>same day</b> quotes</span><span><b>kids</b> & adults</span></div>
          <button className="btn y" style={{ alignSelf: 'flex-start' }} onClick={() => go('events')}>Enquire now</button>
        </div>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="head-row"><h2 className="lc">from the art menu</h2><button className="btn o sm" onClick={() => go('art-menu')}>Full menu</button></div>
        <div className="picks">
          {picks.map(a => (
            <button key={a.id} className="pick" onClick={() => go('art-menu')}>
              <b>{a.name}</b><small>{a.blurb}</small><span>{ghs(a.price)}</span>
            </button>
          ))}
        </div>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="visitrow">
          <div className="visit">
            <h2 className="lc">visit us</h2>
            <span>Second floor, above Melcom Mini, Peter Ala Adjetey Avenue, Labone, Accra.</span>
            <span>Closed Mondays and Tuesdays. Opening hours to be confirmed.</span>
            <a className="btn o sm" href="https://maps.google.com/?q=Glaze+Art+Studio+Labone+Accra" target="_blank" rel="noopener">Get directions</a>
          </div>
          <div className="channel">
            <b>never miss a workshop</b>
            <span>Follow the Glaze WhatsApp channel for the monthly schedule, closures and offers. No more than three posts a month.</span>
            <button className="btn y" style={{ alignSelf: 'flex-start' }} onClick={() => go('contact')}>Follow on WhatsApp</button>
          </div>
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
        <div><b>Visit us</b>Second floor, above Melcom Mini, Peter Ala Adjetey Avenue, Labone, Accra</div>
        <div><b>Get in touch</b>operations@glazegh.com<br />+233 (0) 553 246 316</div>
        <div><b>Follow us</b><a href="https://www.instagram.com/glazeartgh/" target="_blank" rel="noopener">Instagram @glazeartgh</a><br />WhatsApp channel</div>
        <div><b>Quick links</b>
          <button onClick={() => go('book')}>Book a table</button>
          <button onClick={() => go('events')}>Book an event</button>
          <button onClick={() => go('calendar')}>Upcoming workshops</button>
        </div>
      </div>
    </div></footer>
  )
}
