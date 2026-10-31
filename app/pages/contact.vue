<script setup lang="ts">
import { PhArrowUpRight, PhEnvelopeSimple, PhMapPin, PhPhone } from '@phosphor-icons/vue'
import { company } from '~/data/site'

useSeoMeta({
  title: 'Request a demo',
  description: 'Book a call with ARX Fintech. Tell us about your brokerage plan and we map the services, timeline and costs with you.',
})

const next = [
  { title: 'We reply in one business day', text: 'A specialist reads your request and books a call at a time that suits you.' },
  { title: 'We map your plan', text: 'On the call, we review your model, markets and budget, and answer your questions.' },
  { title: 'You get a clear proposal', text: 'Services, dates and costs in one document, with no obligation.' },
]
</script>

<template>
  <section v-bind="sceneAttrs({ morph: 0, x: -2.3, y: -0.4, z: 8.5, tilt: 0.4 })" class="relative min-h-[calc(100dvh-3.5rem)] pt-16 pb-24 md:min-h-[calc(100dvh-4.5rem)] md:pt-24">
    <div class="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
      <div>
        <ScrambleText text="Contact" tag="p" class="eyebrow" :delay="200" />
        <SplitText text="Request a *demo*" tag="h1" mode="chars" :delay="150" class="display mt-5 text-[2.75rem] text-ink-50 sm:text-6xl lg:text-7xl" />
        <p class="lede mt-6" v-reveal="500">Tell us about your brokerage. We show you the platform and build a plan that fits your goals.</p>
        <ol class="mt-12 space-y-8">
          <li v-for="(n, i) in next" :key="n.title" class="flex gap-5" v-reveal="140 + i * 70">
            <span class="grid size-9 shrink-0 place-items-center rounded-full border border-accent/40 font-mono text-sm text-accent">{{ i + 1 }}</span>
            <div>
              <h2 class="font-display text-xl font-semibold text-ink-50">{{ n.title }}</h2>
              <p class="mt-1 leading-relaxed text-ink-300">{{ n.text }}</p>
            </div>
          </li>
        </ol>
        <div class="mt-14 grid gap-3" v-reveal="300">
          <a :href="`mailto:${company.email}`" class="panel group flex items-center gap-4 p-5 transition-colors hover:border-accent/50">
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><PhEnvelopeSimple :size="20" /></span>
            <span class="flex-1">
              <span class="eyebrow block !text-ink-500">Email</span>
              <span class="mt-1 block text-ink-50">{{ company.email }}</span>
            </span>
            <PhArrowUpRight :size="18" class="text-ink-500 transition-colors group-hover:text-accent" />
          </a>
          <a :href="company.phoneHref" class="panel group flex items-center gap-4 p-5 transition-colors hover:border-accent/50">
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><PhPhone :size="20" /></span>
            <span class="flex-1">
              <span class="eyebrow block !text-ink-500">Phone</span>
              <span class="mt-1 block text-ink-50">{{ company.phone }}</span>
            </span>
            <PhArrowUpRight :size="18" class="text-ink-500 transition-colors group-hover:text-accent" />
          </a>
          <a :href="company.mapUrl" target="_blank" rel="noopener noreferrer" class="panel group flex items-center gap-4 p-5 transition-colors hover:border-accent/50">
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><PhMapPin :size="20" /></span>
            <span class="flex-1">
              <span class="eyebrow block !text-ink-500">Office</span>
              <address class="mt-1 block leading-relaxed text-ink-50 not-italic">
                {{ company.address.street }}<br />{{ company.address.area }}, {{ company.address.city }}, {{ company.address.country }}
              </address>
            </span>
            <PhArrowUpRight :size="18" class="text-ink-500 transition-colors group-hover:text-accent" />
          </a>
        </div>
      </div>
      <div v-reveal="120">
        <DemoForm />
      </div>
    </div>
  </section>
</template>
