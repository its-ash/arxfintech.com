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

  let first = true
  nuxtApp.hook('page:finish', () => {
    if (!first && !location.hash) lenis?.scrollTo(0, { immediate: true, force: true })
    first = false
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  return { provide: { lenis, reduced } }
})
