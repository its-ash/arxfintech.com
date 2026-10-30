<script setup lang="ts">
import { PhArrowRight, PhArrowUpRight, PhCheck } from '@phosphor-icons/vue'
import { bySlug, compare, facts, groups, homeFaq, homeSteps, inGroup, kinetic, reasons, site } from '~/data/site'

useSeoMeta({
  title: null,
  ogTitle: site.title,
  ogDescription: site.description,
})

const stages = groups.map((g) => ({ ...g, items: inGroup(g.id) }))
const trading = inGroup('trading')
const digital = inGroup('digital')
const bento: Record<string, string> = {
  'website-creation': 'md:col-span-2 md:row-span-2 bg-[linear-gradient(160deg,rgb(214_251_97/.12),transparent_55%)]',
  'business-email': 'md:col-start-4 md:row-span-2 md:row-start-1',
}
</script>

<template>
  <div>
    <section v-bind="sceneAttrs({ morph: 0, x: 1.7, z: 7, tilt: 0.35 })" class="relative flex min-h-[calc(100dvh-4.5rem)] items-center py-16">
      <div class="shell">
        <div class="max-w-2xl">
          <ScrambleText text="Brokerage technology partner" tag="p" class="eyebrow" :delay="300" />
          <SplitText
            text="Launch your brokerage with *one* partner"
            tag="h1"
            mode="chars"
            :delay="250"
            class="display mt-6 text-[3rem] text-ink-50 sm:text-7xl lg:text-[5.75rem]"
          />
          <p class="lede mt-7" v-reveal="700">
            Company setup, trading platform, liquidity bridge and every digital tool you need. Built and run by one team.
          </p>
          <div class="mt-10 flex flex-wrap gap-3" v-reveal="850">
            <NuxtLink to="/contact" class="btn btn-primary">
              Request a demo
              <PhArrowRight :size="16" />
            </NuxtLink>
            <a href="#services" class="btn btn-ghost">Explore services</a>
          </div>
        </div>
      </div>
    </section>

    <KineticBand :rows="kinetic" />

    <section id="services" v-bind="sceneAttrs({ morph: 0, x: -2.4, z: 10, tilt: 0.5 })" class="relative scroll-mt-24 py-24 md:py-36">
      <div class="shell grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div class="lg:sticky lg:top-32 lg:self-start">
          <SplitText text="Everything a brokerage needs, in *four* stages" class="display text-5xl text-ink-50 md:text-6xl" />
          <p class="lede mt-6" v-reveal="120">Start at any stage. Each service works alone, and all of them work better together.</p>
        </div>
        <div class="grid gap-6">
          <article
            v-for="(s, i) in stages"
            :key="s.id"
            class="panel !bg-ink-900/92 p-7 md:sticky md:p-9"
            :style="{ top: `calc(7.5rem + ${i * 1.5}rem)` }"
          >
            <div class="flex items-center justify-between gap-4">
              <ScrambleText :text="s.label" class="eyebrow" />
              <span class="font-mono text-xs text-ink-500">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <h3 class="mt-4 font-display text-3xl font-semibold tracking-tight text-ink-50 md:text-4xl">{{ s.stage }}</h3>
            <p class="mt-3 max-w-[48ch] leading-relaxed text-ink-300">{{ s.text }}</p>
            <ul class="mt-7 flex flex-wrap gap-2">
              <li v-for="it in s.items" :key="it.slug">
                <NuxtLink :to="`/${it.slug}`" class="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-ink-950/50 px-4 text-sm text-ink-100 transition-colors hover:border-accent hover:text-accent">
                  <component :is="it.icon" :size="16" class="text-accent" />
                  {{ it.label }}
                </NuxtLink>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="relative border-y border-white/8 bg-ink-950/60 backdrop-blur-md">
      <dl class="shell grid grid-cols-2 md:grid-cols-4">
        <div v-for="(f, i) in facts" :key="f.label" class="border-white/8 py-10 pr-6 md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0" v-reveal="i * 80">
          <dt class="font-display text-6xl font-semibold tracking-tight text-accent md:text-7xl">
            <ScrambleText :text="f.value" :delay="i * 120" />
          </dt>
          <dd class="mt-3 max-w-[22ch] font-mono text-xs leading-relaxed tracking-wide text-ink-300 uppercase">{{ f.label }}</dd>
        </div>
      </dl>
    </section>

    <section v-bind="sceneAttrs({ morph: 1, x: 0, y: -0.15, z: 7.2, tilt: 0 })" class="relative flex min-h-[150dvh] flex-col justify-between py-24 md:py-36">
      <div class="shell">
        <SplitText text="Trading technology your clients *feel*" class="display max-w-3xl text-5xl text-ink-50 md:text-7xl" />
        <p class="lede mt-6" v-reveal="120">Fast execution, deep liquidity and social trading tools, all under your brand.</p>
      </div>
      <div class="shell mt-[60dvh] md:mt-0">
        <ul class="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="(t, i) in trading" :key="t.slug" class="border-t border-white/15 pt-6" v-reveal="i * 80">
            <component :is="t.icon" :size="26" class="text-accent" />
            <h3 class="mt-4 font-display text-2xl font-semibold tracking-tight text-ink-50">{{ t.label }}</h3>
            <p class="mt-2 leading-relaxed text-ink-300">{{ t.blurb }}</p>
            <NuxtLink :to="`/${t.slug}`" class="link-arrow mt-4 text-sm" :aria-label="`Learn more about ${t.label}`">
              Learn more
              <PhArrowRight :size="14" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section v-bind="sceneAttrs({ morph: 2, x: 0, z: 9.5, tilt: 1.2 })" class="relative py-24 md:py-36">
      <div class="shell">
        <SplitText text="Offshore or regulated? We set up *both*." class="display max-w-3xl text-5xl text-ink-50 md:text-6xl" />
        <div class="mt-14 grid gap-6 md:grid-cols-2">
          <article v-for="(c, i) in compare" :key="c.slug" class="panel flex flex-col p-7 md:p-10" v-reveal="i * 100">
            <component :is="bySlug[c.slug]!.icon" :size="30" class="text-accent" />
            <h3 class="mt-6 font-serif text-5xl text-ink-50 italic">{{ c.title }}</h3>
            <p class="mt-4 max-w-[44ch] leading-relaxed text-ink-300">{{ c.text }}</p>
            <ul class="mt-8 space-y-3">
              <li v-for="p in c.points" :key="p" class="flex items-center gap-3 text-ink-100">
                <span class="grid size-6 place-items-center rounded-full bg-accent-soft text-accent"><PhCheck :size="13" weight="bold" /></span>
                {{ p }}
              </li>
            </ul>
            <NuxtLink :to="`/${c.slug}`" class="link-arrow mt-10" :aria-label="`${bySlug[c.slug]!.label} details`">
              {{ bySlug[c.slug]!.label }}
              <PhArrowRight :size="16" />
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section v-bind="sceneAttrs({ morph: 2, x: 2.2, z: 10, tilt: 0.7 })" class="relative py-24 md:py-36">
      <div class="shell">
        <SplitText text="Your brand online before *day one*" class="display max-w-3xl text-5xl text-ink-50 md:text-6xl" />
        <p class="lede mt-6" v-reveal="120">We register, build and host everything your clients see and use to reach you.</p>
        <div class="mt-14 grid gap-4 md:auto-rows-[minmax(15rem,auto)] md:grid-cols-4">
          <NuxtLink
            v-for="(d, i) in digital"
            :key="d.slug"
            :to="`/${d.slug}`"
            class="panel group flex flex-col p-6 transition-colors hover:border-accent/50 md:p-8"
            :class="bento[d.slug]"
            v-reveal="i * 80"
          >
            <div class="flex items-start justify-between gap-4">
              <span class="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent"><component :is="d.icon" :size="22" /></span>
              <PhArrowUpRight :size="20" class="text-ink-500 transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </div>
            <h3 class="mt-auto pt-10 font-display text-2xl font-semibold tracking-tight text-ink-50" :class="d.slug === 'website-creation' && 'md:text-4xl'">{{ d.label }}</h3>
            <p class="mt-2 leading-relaxed text-ink-300">{{ d.blurb }}</p>
            <ul v-if="d.slug === 'website-creation' || d.slug === 'business-email'" class="mt-6 space-y-2 text-sm text-ink-300">
              <li v-for="b in d.bullets.slice(0, 4)" :key="b" class="flex items-start gap-2.5">
                <PhCheck :size="15" class="mt-0.5 shrink-0 text-accent" />
                {{ b }}
              </li>
            </ul>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-bind="sceneAttrs({ morph: 3, x: 0, y: -1, z: 6.5, tilt: 0.55 })" class="relative flex min-h-[110dvh] items-center py-24 md:py-36">
      <div class="shell">
        <ScrambleText text="Why ARX Fintech" tag="p" class="eyebrow" />
        <ScrollWords
          text="We are your *technology partner*, not just a vendor. We build long-term relationships on trust, technology and *performance*."
          class="mt-8 max-w-5xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-ink-50 md:text-6xl lg:text-7xl"
        />
      </div>
    </section>

    <section v-bind="sceneAttrs({ morph: 3, x: 1.6, y: -0.6, z: 8, tilt: 0.6 })" class="relative py-24 md:py-32">
      <div class="shell">
        <ul class="max-w-2xl divide-y divide-white/8 border-y border-white/8">
          <li v-for="(r, i) in reasons" :key="r" class="flex items-center gap-5 py-5 text-lg text-ink-100" v-reveal="i * 50">
            <span class="font-mono text-xs text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ r }}
          </li>
        </ul>
      </div>
    </section>

    <section v-bind="sceneAttrs({ morph: 3, x: 0, y: -1.7, z: 9, tilt: 0.7 })" class="relative py-24 md:py-36">
      <div class="shell">
        <SplitText text="From first call to *live* brokerage" class="display max-w-3xl text-5xl text-ink-50 md:text-6xl" />
        <div class="mt-16">
          <StepsRow :items="homeSteps" />
        </div>
      </div>
    </section>

    <section v-bind="sceneAttrs({ morph: 3, x: -2, y: -0.5, z: 10, tilt: 0.5 })" class="relative py-24 md:py-36">
      <div class="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div class="lg:sticky lg:top-32 lg:self-start">
          <SplitText text="Questions brokers *ask*" class="display text-5xl text-ink-50 md:text-6xl" />
          <p class="lede mt-6" v-reveal="120">
            Need something else?
            <NuxtLink to="/contact" class="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">Talk to our team</NuxtLink>.
          </p>
        </div>
        <FaqList :items="homeFaq" />
      </div>
    </section>

    <CtaBand />
  </div>
</template>
