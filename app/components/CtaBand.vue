<script setup lang="ts">
import { PhArrowRight } from '@phosphor-icons/vue'

withDefaults(defineProps<{ title?: string; text?: string; topic?: string }>(), {
  title: 'Ready to *launch* your brokerage?',
  text: 'Book a call with our team. We map your plan, timeline and costs in one conversation.',
  topic: undefined,
})
</script>

<template>
  <section v-bind="sceneAttrs({ morph: 4, x: 0, y: 0.95, z: 6.8, tilt: 0 })" class="relative flex min-h-dvh flex-col justify-end pt-[45dvh] pb-20 md:pb-28">
    <div class="shell flex flex-col items-center text-center">
      <SplitText :text="title" class="display max-w-4xl text-5xl text-ink-50 md:text-7xl" />
      <p class="lede mt-6 text-center" v-reveal="150">{{ text }}</p>
      <div class="mt-10 flex flex-wrap justify-center gap-3" v-reveal="250">
        <NuxtLink :to="topic ? { path: '/contact', query: { topic } } : '/contact'" class="btn btn-primary">
          Request a demo
          <PhArrowRight :size="16" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
