<script setup lang="ts">
import { gsap } from 'gsap'

defineProps<{ rows: string[][] }>()

const root = useTemplateRef<HTMLElement>('root')
const { $reduced } = useNuxtApp()
let ctx: gsap.Context | undefined

onMounted(() => {
  if ($reduced || !root.value) return
  ctx = gsap.context(() => {
    root.value!.querySelectorAll<HTMLElement>('[data-row]').forEach((row, i) => {
      const odd = i % 2 === 1
      gsap.fromTo(
        row,
        { xPercent: odd ? -28 : 0 },
        { xPercent: odd ? 0 : -28, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" aria-hidden="true" class="relative overflow-hidden border-y border-white/8 bg-ink-950/40 py-8 backdrop-blur-[2px] md:py-12">
    <div
      v-for="(r, i) in rows"
      :key="i"
      data-row
      class="flex w-max font-display text-[clamp(3rem,9vw,8.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] whitespace-nowrap uppercase"
    >
      <span v-for="(w, j) in [...r, ...r]" :key="j" class="flex items-center">
        <span :class="(j + i) % 2 ? 'text-outline' : 'text-ink-50'">{{ w }}</span>
        <span class="mx-[0.3em] inline-block size-[0.16em] rotate-45 bg-accent" />
      </span>
    </div>
  </section>
</template>
