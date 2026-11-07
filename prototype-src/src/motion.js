import { useEffect } from 'react'

// Gentle scroll reveals. Anything already on screen is left alone, so the page
// never shows blank space; only content further down eases in as it arrives.
const SEL = '.sec h2, .way, .mini, .pick, .flyer, .stepc, .menuitem, .ccard, .visit, .channel, .split > img, .split .txt, .card, .faq details, .woodcard, .tiles .tile'

export function useReveal(key) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = [...document.querySelectorAll(SEL)].filter(e => e.getBoundingClientRect().top > window.innerHeight * 0.92)
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) } })
    }, { rootMargin: '0px 0px -8% 0px' })
    els.forEach((e, i) => {
      const sib = e.parentElement ? [...e.parentElement.children].indexOf(e) : 0
      e.style.transitionDelay = `${(sib % 4) * 70}ms`
      e.classList.add('rv'); io.observe(e)
    })
    // safety: never leave anything hidden
    const t = setTimeout(() => els.forEach(e => e.classList.add("in")), 2500)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [key])
}

export function useScrolled() {
  useEffect(() => {
    const f = () => document.documentElement.classList.toggle('scrolled', window.scrollY > 8)
    f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f)
  }, [])
}
