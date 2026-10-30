<script setup lang="ts">
import { PhArrowUpRight } from '@phosphor-icons/vue'
import { facts, groups, inGroup, values } from '~/data/site'

useSeoMeta({
  title: 'About us',
  description: 'ARX Fintech gives new and existing brokerages the company setup, technology and operational support they need to launch, run and grow.',
})

const stages = groups.map((g) => ({ ...g, items: inGroup(g.id) }))
</script>

<template>
  <div>
    <section v-bind="sceneAttrs({ morph: 2, x: 1.8, z: 7.2, tilt: 1.05 })" class="relative flex min-h-[calc(100dvh-4.5rem)] items-center py-16">
      <div class="shell">
        <div class="max-w-xl">
          <ScrambleText text="About ARX Fintech" tag="p" class="eyebrow" :delay="200" />
          <SplitText text="We build the *infrastructure* behind brokerages" tag="h1" mode="chars" :delay="150" class="display mt-5 text-[2.75rem] text-ink-50 sm:text-6xl lg:text-7xl" />
          <p class="lede mt-6" v-reveal="600">
            ARX Fintech gives new and existing brokerage firms complete technology and operational support, from company setup to the dealing desk.
          </p>
        </div>
      </div>
    </section>

    <section class="relative border-y border-white/8 bg-ink-950/50 backdrop-blur-md">
      <dl class="shell grid grid-cols-2 md:grid-cols-4">
        <div v-for="(f, i) in facts" :key="f.label" class="border-white/8 py-10 pr-6 md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0" v-reveal="i * 80">
          <dt class="font-display text-6xl font-semibold tracking-tight text-accent md:text-7xl"><ScrambleText :text="f.value" :delay="i * 120" /></dt>
          <dd class="mt-3 max-w-[22ch] font-mono text-xs leading-relaxed tracking-wide text-ink-300 uppercase">{{ f.label }}</dd>
        </div>
      </dl>
    </section>

    <section v-bind="sceneAttrs({ morph: 0, x: -2.3, z: 9, tilt: 0.4 })" class="relative py-24 md:py-36">
      <div class="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SplitText text="How we *work*" class="display text-5xl text-ink-50 md:text-6xl lg:sticky lg:top-32 lg:self-start" />
        <div class="grid gap-4 sm:grid-cols-2">
          <article v-for="(v, i) in values" :key="v.title" class="panel p-6 md:p-8" :class="i % 2 === 1 && 'sm:mt-10'" v-reveal="i * 80">
            <h3 class="font-display text-2xl font-semibold tracking-tight text-ink-50">{{ v.title }}</h3>
            <p class="mt-3 leading-relaxed text-ink-300">{{ v.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section v-bind="sceneAttrs({ morph: 1, x: 0, y: -0.2, z: 10, tilt: 0 })" class="relative py-24 md:py-36">
      <div class="shell">
        <SplitText text="What we *do*" class="display max-w-3xl text-5xl text-ink-50 md:text-6xl" />
        <div class="mt-12 divide-y divide-white/8 border-y border-white/8">
          <div v-for="(s, i) in stages" :key="s.id" class="grid gap-6 py-10 md:grid-cols-[1fr_1.4fr] md:gap-16" v-reveal="i * 60">
            <div>
              <h3 class="font-display text-3xl font-semibold tracking-tight text-ink-50">{{ s.label }}</h3>
              <p class="mt-2 max-w-[42ch] leading-relaxed text-ink-300">{{ s.text }}</p>
            </div>
            <ul class="grid content-start gap-2 sm:grid-cols-2">
              <li v-for="it in s.items" :key="it.slug">
                <NuxtLink :to="`/${it.slug}`" class="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-ink-100 transition-colors hover:bg-ink-800/70">
                  <span class="flex items-center gap-3">
                    <component :is="it.icon" :size="18" class="text-accent" />
                    {{ it.label }}
                  </span>
                  <PhArrowUpRight :size="16" class="text-ink-500 transition-colors group-hover:text-accent" />
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <CtaBand title="Let us build your brokerage *together*" />
  </div>
</template>
