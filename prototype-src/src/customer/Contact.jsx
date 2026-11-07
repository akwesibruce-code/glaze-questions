import { useState } from 'react'
import { useStore } from '../store.jsx'
import { img } from '../assets.js'

export default function Contact() {
  const { setToast } = useStore()
  const [f, setF] = useState({ name: '', phone: '', msg: '' })
  return (
    <>
      <section className="hero slim"><div className="wrap"><div className="txt">
        <span className="eyebrow">contact</span>
        <h1 className="lc">say hello</h1>
        <p>The quickest way to reach us is WhatsApp. We reply during studio hours.</p>
      </div></div></section>
      <section className="sec"><div className="wrap">
        <div className="contacts">
          <button className="ccard" onClick={() => setToast('Opens a WhatsApp chat with Glaze')}><b>WhatsApp</b><span>055 324 6316</span><small>Fastest reply</small></button>
          <button className="ccard" onClick={() => setToast('Opens the Glaze WhatsApp channel')}><b>WhatsApp channel</b><span>Schedule, closures, offers</span><small>Up to 3 posts a month</small></button>
          <a className="ccard" href="https://www.instagram.com/glazeartgh/" target="_blank" rel="noopener"><b>Instagram</b><span>@glazeartgh</span><small>See what people are making</small></a>
          <div className="ccard"><b>Email</b><span>operations@glazegh.com</span><small>For partnerships and invoices</small></div>
        </div>
        <div className="split contactsplit">
          <div className="card">
            <h2 className="lc">send us a message</h2>
            <div className="row2">
              <div className="field"><label htmlFor="cn">Name</label><input id="cn" type="text" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
              <div className="field"><label htmlFor="cp">WhatsApp number</label><input id="cp" type="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></div>
            </div>
            <div className="field"><label htmlFor="cm">Message</label><textarea id="cm" value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} /></div>
            <button className="btn y" style={{ alignSelf: 'flex-start' }} disabled={!f.name || !f.phone || !f.msg} onClick={() => { setF({ name: '', phone: '', msg: '' }); setToast('Message sent. We’ll reply on WhatsApp.') }}>Send message</button>
          </div>
          <div className="visit">
            <img src={img('studio')} alt="Inside the Glaze studio" style={{ borderRadius: 14, aspectRatio: '16/10', objectFit: 'cover', width: '100%' }} />
            <b>Visit us</b>
            <span>Second floor, above Melcom Mini, Peter Ala Adjetey Avenue, Labone, Accra.</span>
            <span>Closed Mondays and Tuesdays.</span>
            <a className="btn o sm" style={{ justifySelf: 'start' }} href="https://maps.google.com/?q=Glaze+Art+Studio+Labone+Accra" target="_blank" rel="noopener">Get directions</a>
          </div>
        </div>
      </div></section>
    </>
  )
}
