<script setup lang="ts">
import { PhArrowRight, PhArrowUpRight, PhCheck } from '@phosphor-icons/vue'
import { bySlug, groups, inGroup, services } from '~/data/site'

const route = useRoute()
const svc = computed(() => bySlug[String(route.params.slug)])

if (!svc.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const s = computed(() => svc.value!)
const group = computed(() => groups.find((g) => g.id === s.value.group)!)
const related = computed(() => {
  const same = inGroup(s.value.group).filter((x) => x.slug !== s.value.slug)
  const rest = services.filter((x) => x.group !== s.value.group && x.slug !== s.value.slug)
  return [...same, ...rest].slice(0, 3)
})
const cells = ['md:col-span-2', '', '', 'md:col-span-2']

useSeoMeta({
  title: () => s.value.label,
  description: () => s.value.lede,
  ogTitle: () => plain(s.value.headline),
  ogDescription: () => s.value.lede,
})
</script>

<template>
  <div :key="s.slug">
    <section v-bind="sceneAttrs(s.scene)" class="relative flex min-h-[calc(100dvh-4.5rem)] items-center py-16">
      <div class="shell">
        <div class="max-w-2xl">
          <ScrambleText :text="group.label" tag="p" class="eyebrow" :delay="200" />
          <SplitText :text="s.headline" tag="h1" mode="chars" :delay="150" class="display mt-5 text-[2.75rem] text-ink-50 sm:text-6xl lg:text-7xl" />
          <p class="lede mt-6" v-reveal="600">{{ s.lede }}</p>
          <div class="mt-10 flex flex-wrap gap-3" v-reveal="750">
            <NuxtLink :to="{ path: '/contact', query: { topic: s.slug } }" class="btn btn-primary">
              Request a demo
              <PhArrowRight :size="16" />
            </NuxtLink>
            <a href="#included" class="btn btn-ghost">What is included</a>
          </div>
        </div>
      </div>
    </section>

    <section id="included" v-bind="sceneAttrs({ ...s.scene, x: -s.scene.x, z: s.scene.z + 2.5 })" class="relative scroll-mt-24 py-24 md:py-32">
      <div class="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
        <SplitText text="What is *included*" class="display text-5xl text-ink-50 md:text-6xl lg:sticky lg:top-32 lg:self-start" />
        <ul class="panel divide-y divide-white/8 px-6 md:px-8">
          <li v-for="(b, i) in s.bullets" :key="b" class="flex items-start gap-4 py-5 text-ink-100" v-reveal="i * 50">
            <span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"><PhCheck :size="13" weight="bold" /></span>
            {{ b }}
          </li>
        </ul>
      </div>
    </section>

    <section v-bind="sceneAttrs({ ...s.scene, x: 0, y: 0, z: s.scene.z + 4 })" class="relative py-24 md:py-32">
      <div class="shell">
        <SplitText text="Why brokers *choose* it" class="display max-w-3xl text-5xl text-ink-50 md:text-6xl" />
        <div class="mt-14 grid gap-4 md:grid-cols-3">
          <article v-for="(f, i) in s.features" :key="f.title" class="panel flex min-h-60 flex-col p-6 md:p-8" :class="cells[i]" v-reveal="i * 80">
            <span class="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent"><component :is="f.icon" :size="22" /></span>
            <h3 class="mt-auto pt-10 font-display text-2xl font-semibold tracking-tight text-ink-50">{{ f.title }}</h3>
            <p class="mt-2 max-w-[48ch] leading-relaxed text-ink-300">{{ f.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section v-bind="sceneAttrs({ ...s.scene, x: 0, y: -2.2, z: s.scene.z + 2 })" class="relative py-24 md:py-32">
      <div class="shell">
        <SplitText text="How it *works*" class="display max-w-3xl text-5xl text-ink-50 md:text-6xl" />
        <div class="mt-16">
          <StepsRow :items="s.steps" />
        </div>
      </div>
    </section>

    <section v-bind="sceneAttrs({ ...s.scene, x: -2.4, y: 0, z: s.scene.z + 2 })" class="relative py-24 md:py-32">
      <div class="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SplitText text="Common *questions*" class="display text-5xl text-ink-50 md:text-6xl lg:sticky lg:top-32 lg:self-start" />
        <FaqList :items="s.faq" />
      </div>
    </section>

    <section class="relative py-16 md:py-24">
      <div class="shell">
        <ScrambleText text="Related services" tag="h2" class="eyebrow" />
        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <NuxtLink
            v-for="(r, i) in related"
            :key="r.slug"
            :to="`/${r.slug}`"
            class="panel group flex items-start gap-4 p-6 transition-colors hover:border-accent/40"
            v-reveal="i * 70"
          >
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><component :is="r.icon" :size="20" /></span>
            <span class="flex-1">
              <span class="block font-display text-lg font-semibold text-ink-50">{{ r.label }}</span>
              <span class="mt-1 block text-sm leading-relaxed text-ink-300">{{ r.blurb }}</span>
            </span>
            <PhArrowUpRight :size="18" class="shrink-0 text-ink-500 transition-colors group-hover:text-accent" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <CtaBand :topic="s.slug" />
  </div>
</template>
