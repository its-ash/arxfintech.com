<script setup lang="ts">
import type { NuxtError } from '#app'
import { PhArrowLeft } from '@phosphor-icons/vue'

const props = defineProps<{ error: NuxtError }>()
const missing = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: () => (missing.value ? 'Page not found' : 'Something went wrong'), robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <section v-bind="sceneAttrs({ morph: 0, x: 0, y: 0, z: 9, tilt: 0.35 })" class="relative grid min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-4.5rem)] place-items-center py-24">
      <div class="shell flex flex-col items-center text-center">
        <p class="font-mono text-sm text-accent">{{ error.statusCode }}</p>
        <h1 class="display mt-4 text-5xl text-ink-50 md:text-7xl">{{ missing ? 'Page not found' : 'Something went wrong' }}</h1>
        <p class="lede mt-6 text-center">{{ missing ? 'The page you want does not exist or has moved.' : 'Please try again in a moment.' }}</p>
        <button type="button" class="btn btn-primary mt-10" @click="clearError({ redirect: '/' })">
          <PhArrowLeft :size="16" />
          Back to home
        </button>
      </div>
    </section>
  </NuxtLayout>
</template>
