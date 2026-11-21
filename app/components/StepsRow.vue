<script setup lang="ts">
import type { Step } from '~/data/site'

defineProps<{ items: Step[] }>()
</script>

<template>
  <div class="relative">
    <div aria-hidden="true" class="absolute top-5 right-0 left-0 hidden h-[2px] bg-white/12 md:block">
      <div class="step-line h-full w-full shadow-[0_0_14px_rgb(0_238_255/.4)]" />
    </div>
    <ol class="relative grid gap-5 md:grid-cols-4 md:gap-5">
      <li v-for="(s, i) in items" :key="s.title" class="flex flex-col" v-reveal="i * 90">
        <span class="relative z-10 grid size-10 place-items-center rounded-full border border-accent/55 bg-ink-950 font-mono text-sm font-medium text-accent shadow-[0_0_24px_-4px_rgb(214_251_97/.55),inset_0_1px_0_rgb(255_255_255/.2)]">{{ i + 1 }}</span>
        <div class="panel panel-lift mt-5 flex-1 p-6">
          <h3 class="font-display text-2xl font-semibold tracking-tight text-ink-50">{{ s.title }}</h3>
          <p class="mt-2.5 leading-relaxed text-ink-300">{{ s.text }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>
