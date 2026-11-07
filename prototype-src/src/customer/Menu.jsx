import { useState } from 'react'
import { go } from '../store.jsx'
import { ADULT_MENU, KIDS_MENU, ghs } from '../data.js'
import { img } from '../assets.js'

// Placeholder photos until Glaze sends a photo of each piece.
const PHOTO = id => {
  const k = id.replace(/^k-/, '')
  if (/calabash|basket|crochet|sewing|charm|bedazzle|wand|frame/.test(k)) return 'calabash'
  if (/collage|textured|tote|tshirt|cap/.test(k)) return 'collage'
  if (/charcoal/.test(k)) return 'sketch'
  if (/clay|gypsum|plant|wood/.test(k)) return 'studio'
  if (/dance/.test(k)) return 'apron'
  return id.startsWith('k-') ? 'kids' : 'paint'
}

export default function Menu() {
  const [tab, setTab] = useState('adults')
  const list = tab === 'kids' ? KIDS_MENU : ADULT_MENU.filter(a => !a.wood)
  return (
    <>
      <section className="hero slim"><div className="wrap">
        <div className="txt">
          <span className="eyebrow">art menu</span>
          <h1 className="lc">pick your art</h1>
          <p>Experiences for every level. Walk in, or book for your group. Groups of 6 or more get 10% off.</p>
        </div>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="tabs" role="tablist" aria-label="Menu">
          <button role="tab" aria-selected={tab === 'adults'} className={tab === 'adults' ? 'on' : ''} onClick={() => setTab('adults')}>Adults</button>
          <button role="tab" aria-selected={tab === 'kids'} className={tab === 'kids' ? 'on' : ''} onClick={() => setTab('kids')}>Kids</button>
        </div>
        <div className="note info">Placeholder photos for now. Glaze is sending a photo of each piece.</div>
        <div className="menu-grid">
          {list.map(a => (
            <div key={a.id} className="menuitem">
              <img className="mthumb" src={img(PHOTO(a.id))} alt="" loading="lazy" />
              <div><b>{a.name}{a.star ? ' *' : ''}</b><small>{a.blurb}</small></div>
              <b className="p">{ghs(a.price)}</b>
            </div>
          ))}
        </div>
        {tab === 'adults' && <>
          <p className="lead" style={{ fontSize: 13 }}>* Needs at least 4 people and a week’s notice.</p>
          <div className="woodcard">
            <h3 className="lc">woodworking</h3>
            <span className="lead">Create your own unique wooden piece, from planters to side tables. We curate it with you, so the price depends on what you make.</span>
            <div className="menu-grid">
              <div className="menuitem"><img className="mthumb" src={img('studio')} alt="" loading="lazy" /><div><b>Planter stand</b><small>Build the base, paint your pot, add a plant</small></div><b className="p">{ghs(600)}</b></div>
              <div className="menuitem"><img className="mthumb" src={img('studio')} alt="" loading="lazy" /><div><b>Side table</b><small>Assemble, paint and varnish</small></div><b className="p">{ghs(850)}</b></div>
            </div>
          </div>
        </>}
        <div className="acts"><button className="btn y" onClick={() => go('book')}>Book a table</button><button className="btn o" onClick={() => go('events')}>Book for a group</button></div>
      </div></section>
    </>
  )
}
