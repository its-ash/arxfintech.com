<script setup lang="ts">
import { gsap } from 'gsap'

const props = withDefaults(defineProps<{ text: string; tag?: string }>(), { tag: 'p' })

const words = computed(() => toWords(props.text))
const root = useTemplateRef<HTMLElement>('root')
const { $reduced } = useNuxtApp()
let ctx: gsap.Context | undefined

onMounted(() => {
  if (!root.value) return
  const els = root.value.querySelectorAll<HTMLElement>('[data-w]')
  if ($reduced) {
    gsap.set(els, { opacity: 1, y: 0 })
    return
  }
  ctx = gsap.context(() => {
    gsap.fromTo(
      els,
      { opacity: 0.24, y: 8 },
      { opacity: 1, y: 0, ease: 'none', stagger: 0.055, scrollTrigger: { trigger: root.value, start: 'top 82%', end: 'bottom 48%', scrub: true } },
    )
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <component :is="tag" ref="root" class="[text-shadow:0_2px_26px_rgb(8_9_14/.9)]">
    <span class="sr-only">{{ plain(text) }}</span>
    <span aria-hidden="true">
      <template v-for="(w, i) in words" :key="i">
        <component
          :is="w.em ? 'em' : 'span'"
          data-w
          class="inline-block"
          :class="w.em && 'font-serif font-normal text-accent italic [text-shadow:0_0_32px_rgb(214_251_97/.35)]'"
        >{{ w.w }}</component>{{ ' ' }}
      </template>
    </span>
  </component>
</template>
