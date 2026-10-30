<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import type { Faq } from '~/data/site'

defineProps<{ items: Faq[]; name?: string }>()
</script>

<template>
  <div class="divide-y divide-white/8 border-y border-white/8">
    <details v-for="(f, i) in items" :key="f.q" :name="name ?? 'faq'" class="faq group" v-reveal="i * 60">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-ink-50 md:text-lg [&::-webkit-details-marker]:hidden">
        {{ f.q }}
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-ink-800 text-ink-300 transition-[rotate,background-color] duration-300 group-open:rotate-180 group-open:bg-accent group-open:text-accent-ink">
          <PhCaretDown :size="16" />
        </span>
      </summary>
      <p class="max-w-[62ch] pb-6 leading-relaxed text-ink-300">{{ f.a }}</p>
    </details>
  </div>
</template>
