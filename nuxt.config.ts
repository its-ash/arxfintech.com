import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-30',
  devtools: { enabled: false },
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    build: { chunkSizeWarningLimit: 700 },
    optimizeDeps: { include: ['three', 'gsap', 'gsap/ScrollTrigger', 'lenis', '@phosphor-icons/vue'] },
  },
  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [400, 500, 600] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500] },
      { name: 'Clash Display', provider: 'fontshare', weights: [500, 600] },
      { name: 'Playfair Display', provider: 'google', weights: [400], styles: ['italic'] },
      { name: 'Roboto', provider: 'google', weights: [400, 500, 700] },
    ],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#111111' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://arxfintech.com',
      web3formsKey: '',
    },
  },
  nitro: {
    prerender: { crawlLinks: true, routes: ['/'] },
  },
  typescript: { strict: true },
})
