<script setup lang="ts">
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
  <section v-bind="sceneAttrs({ morph: 0, x: -2.3, y: -0.4, z: 8.5, tilt: 0.4 })" class="relative min-h-[calc(100dvh-4.5rem)] pt-16 pb-24 md:pt-24">
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
      </div>
      <div v-reveal="120">
        <DemoForm />
      </div>
    </div>
  </section>
</template>
