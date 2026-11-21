import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = reduced ? null : new Lenis({ lerp: 0.1, anchors: true })

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return
        const card = (e.target as Element | null)?.closest<HTMLElement>('.panel')
        if (!card) return
        const r = card.getBoundingClientRect()
        card.style.setProperty('--px', `${e.clientX - r.left}px`)
        card.style.setProperty('--py', `${e.clientY - r.top}px`)
      },
      { passive: true },
    )
  }

  let first = true
  nuxtApp.hook('page:finish', () => {
    if (!first && !location.hash) lenis?.scrollTo(0, { immediate: true, force: true })
    first = false
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  return { provide: { lenis, reduced } }
})
