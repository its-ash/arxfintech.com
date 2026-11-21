<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue'
import type { Faq } from '~/data/site'

defineProps<{ items: Faq[]; name?: string }>()
</script>

<template>
  <div class="panel divide-y divide-white/10 px-6 md:px-8">
    <details v-for="(f, i) in items" :key="f.q" :name="name ?? 'faq'" class="faq group" v-reveal="i * 60">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-ink-50 transition-colors hover:text-accent md:text-lg [&::-webkit-details-marker]:hidden">
        {{ f.q }}
        <span class="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-ink-800/90 text-ink-300 transition-[rotate,background-color,color,border-color] duration-300 group-hover:border-accent/40 group-hover:text-accent group-open:rotate-180 group-open:border-accent group-open:bg-accent group-open:text-accent-ink">
          <PhCaretDown :size="16" />
        </span>
      </summary>
      <p class="max-w-[62ch] pb-6 leading-relaxed text-ink-300">{{ f.a }}</p>
    </details>
  </div>
</template>
