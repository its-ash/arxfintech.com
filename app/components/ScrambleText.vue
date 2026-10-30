<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string; tag?: string; delay?: number }>(), { tag: 'span', delay: 0 })

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$+/<>'
const out = ref(props.text)
const el = useTemplateRef<HTMLElement>('el')
let raf = 0
let timer: ReturnType<typeof setTimeout> | undefined
let io: IntersectionObserver | undefined

const run = () => {
  const src = props.text
  const start = performance.now()
  const dur = 450 + src.length * 32
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / dur)
    const done = Math.floor(p * src.length)
    out.value = [...src].map((c, i) => (i < done || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('')
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!el.value || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  io = new IntersectionObserver(
    ([e]) => {
      if (!e?.isIntersecting) return
      io?.disconnect()
      timer = setTimeout(run, props.delay)
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  io.observe(el.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(timer)
  io?.disconnect()
})
</script>

<template>
  <component :is="tag" ref="el">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">{{ out }}</span>
  </component>
</template>
