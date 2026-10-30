<script setup lang="ts">
import type { Step } from '~/data/site'

defineProps<{ items: Step[] }>()
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="absolute top-5 right-0 left-0 hidden h-px bg-white/10 md:block">
      <div class="step-line h-full w-full bg-accent" />
    </div>
    <ol class="relative grid gap-10 md:grid-cols-4 md:gap-6">
      <li v-for="(s, i) in items" :key="s.title" v-reveal="i * 90">
        <span class="grid size-10 place-items-center rounded-full border border-accent/40 bg-ink-950 font-mono text-sm text-accent">{{ i + 1 }}</span>
        <h3 class="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-50">{{ s.title }}</h3>
        <p class="mt-2 max-w-[30ch] leading-relaxed text-ink-300">{{ s.text }}</p>
      </li>
    </ol>
  </div>
</template>
