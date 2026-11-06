import { useState } from 'react'
import { go } from '../store.jsx'
import { ADULT_MENU, KIDS_MENU, ghs } from '../data.js'

export default function Menu() {
  const [tab, setTab] = useState('adults')
  const list = tab === 'kids' ? KIDS_MENU : ADULT_MENU.filter(a => !a.wood)
  return (
    <section className="sec">
      <h2>Our art menu</h2>
      <p className="lead">Experiences for every level. Walk in, or book for your group. Groups of 6 or more get 10% off.</p>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'adults'} className={tab === 'adults' ? 'on' : ''} onClick={() => setTab('adults')}>Adults</button>
        <button role="tab" aria-selected={tab === 'kids'} className={tab === 'kids' ? 'on' : ''} onClick={() => setTab('kids')}>Kids</button>
      </div>
      <div>
        {list.map(a => (
          <div key={a.id} className="menuitem">
            <div><b>{a.name}{a.star ? ' *' : ''}</b><small>{a.blurb}</small></div>
            <b className="p">{ghs(a.price)}</b>
          </div>
        ))}
      </div>
      {tab === 'adults' && <>
        <p className="lead" style={{ fontSize: 13 }}>* Needs at least 4 people and a week’s notice.</p>
        <div className="card">
          <b style={{ fontFamily: 'var(--display)', fontSize: 24, color: 'var(--blue)', fontWeight: 400 }}>Woodworking</b>
          <span>Create your own unique wooden piece, from planters to side tables. We curate it with you.</span>
          <div className="menuitem" style={{ padding: '6px 0' }}><div><b>Planter stand</b><small>Build the base, paint your pot, add a plant</small></div><b className="p">{ghs(600)}</b></div>
          <div className="menuitem" style={{ padding: '6px 0', border: 0 }}><div><b>Side table</b><small>Assemble, paint and varnish</small></div><b className="p">{ghs(850)}</b></div>
        </div>
      </>}
      <button className="btn y" onClick={() => go('events')}>Book for a group</button>
    </section>
  )
}
