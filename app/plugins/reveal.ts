let io: IntersectionObserver | undefined

const observer = () =>
  (io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        ;(e.target as HTMLElement).dataset.in = ''
        io?.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  ))

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: ({ value }) => ({ 'data-reveal': '', style: value ? { '--d': `${value}ms` } : undefined }),
    mounted(el, { value }) {
      el.dataset.reveal = ''
      if (value) el.style.setProperty('--d', `${value}ms`)
      observer().observe(el)
    },
    unmounted(el) {
      io?.unobserve(el)
    },
  })
})
