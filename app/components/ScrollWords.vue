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
    gsap.set(els, { opacity: 1 })
    return
  }
  ctx = gsap.context(() => {
    gsap.fromTo(
      els,
      { opacity: 0.14 },
      { opacity: 1, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: root.value, start: 'top 80%', end: 'bottom 50%', scrub: true } },
    )
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <component :is="tag" ref="root">
    <span class="sr-only">{{ plain(text) }}</span>
    <span aria-hidden="true">
      <template v-for="(w, i) in words" :key="i">
        <component :is="w.em ? 'em' : 'span'" data-w :class="w.em && 'font-serif font-normal text-accent italic'">{{ w.w }}</component>{{ ' ' }}
      </template>
    </span>
  </component>
</template>
