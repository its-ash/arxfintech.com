<script setup lang="ts">
import { gsap } from 'gsap'

defineProps<{ rows: string[][] }>()

const DOTS = ['#d6fb61', '#00eeff', '#19ff9b', '#ff3d7f', '#ffc933', '#d95cff']

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
  <section ref="root" aria-hidden="true" class="relative overflow-hidden border-y border-white/12 bg-ink-950/72 py-8 backdrop-blur-xl shadow-[inset_0_1px_0_rgb(255_255_255/.08)] md:py-12">
    <div
      v-for="(r, i) in rows"
      :key="i"
      data-row
      class="flex w-max font-display text-[clamp(3rem,9vw,8.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] whitespace-nowrap uppercase"
    >
      <span v-for="(w, j) in [...r, ...r]" :key="j" class="flex items-center">
        <span :class="(j + i) % 2 ? 'text-outline' : 'text-ink-50'">{{ w }}</span>
        <span
          class="mx-[0.3em] inline-block size-[0.17em] rotate-45 shadow-[0_0_16px_currentColor]"
          :style="{ backgroundColor: DOTS[(j + i * 2) % DOTS.length], color: DOTS[(j + i * 2) % DOTS.length] }"
        />
      </span>
    </div>
  </section>
</template>
