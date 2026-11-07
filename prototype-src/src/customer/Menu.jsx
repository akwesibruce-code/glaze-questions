import { useState } from 'react'
import { go } from '../store.jsx'
import { ADULT_MENU, KIDS_MENU, ghs } from '../data.js'

export default function Menu() {
  const [tab, setTab] = useState('adults')
  const list = tab === 'kids' ? KIDS_MENU : ADULT_MENU.filter(a => !a.wood)
  return (
    <>
      <section className="hero slim"><div className="wrap">
        <div className="txt">
          <h1>Our art menu</h1>
          <p>Experiences for every level. Walk in, or book for your group. Groups of 6 or more get 10% off.</p>
        </div>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="tabs" role="tablist" aria-label="Menu">
          <button role="tab" aria-selected={tab === 'adults'} className={tab === 'adults' ? 'on' : ''} onClick={() => setTab('adults')}>Adults</button>
          <button role="tab" aria-selected={tab === 'kids'} className={tab === 'kids' ? 'on' : ''} onClick={() => setTab('kids')}>Kids</button>
        </div>
        <div className="menu-grid">
          {list.map(a => (
            <div key={a.id} className="menuitem">
              <div><b>{a.name}{a.star ? ' *' : ''}</b><small>{a.blurb}</small></div>
              <b className="p">{ghs(a.price)}</b>
            </div>
          ))}
        </div>
        {tab === 'adults' && <>
          <p className="lead" style={{ fontSize: 13 }}>* Needs at least 4 people and a week’s notice.</p>
          <div className="woodcard">
            <h3>Woodworking</h3>
            <span className="lead">Create your own unique wooden piece, from planters to side tables. We curate it with you, so the price depends on what you make.</span>
            <div className="menu-grid">
              <div className="menuitem"><div><b>Planter stand</b><small>Build the base, paint your pot, add a plant</small></div><b className="p">{ghs(600)}</b></div>
              <div className="menuitem"><div><b>Side table</b><small>Assemble, paint and varnish</small></div><b className="p">{ghs(850)}</b></div>
            </div>
          </div>
        </>}
        <button className="btn y" style={{ alignSelf: 'flex-start' }} onClick={() => go('events')}>Book for a group</button>
      </div></section>
    </>
  )
}
