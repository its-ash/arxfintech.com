<script setup lang="ts">
import { PhArrowRight, PhArrowUp, PhArrowUpRight, PhEnvelopeSimple, PhMapPin, PhPhone, PhSealCheck } from '@phosphor-icons/vue'
import { company, companyNote, groups, inGroup, site } from '~/data/site'

const { $lenis, $reduced } = useNuxtApp()

const cards = groups.map((g) => ({
  ...g,
  links: [
    ...inGroup(g.id).map((s) => ({ to: `/${s.slug}`, label: s.label })),
    ...(g.id === 'consulting'
      ? [
          { to: '/about', label: 'About us' },
          { to: '/contact', label: 'Contact us' },
        ]
      : []),
  ],
}))

const year = new Date().getFullYear()

const toTop = () => ($lenis ? $lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: $reduced ? 'auto' : 'smooth' }))
</script>

<template>
  <footer class="relative pt-8 pb-6 md:pt-12">
    <div class="shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      <section
        aria-label="ARX Fintech"
        class="panel flex flex-col bg-[linear-gradient(150deg,rgb(214_251_97/.1),transparent_55%)] p-6 sm:col-span-2 md:p-8 lg:row-span-2"
      >
        <NuxtLink to="/" class="inline-flex self-start" aria-label="ARX Fintech home">
          <BrandLogo class="h-11 md:h-12" />
        </NuxtLink>
        <p class="mt-5 max-w-sm font-display text-2xl leading-tight font-semibold tracking-tight text-ink-50 md:text-3xl">
          Company setup, trading technology and digital tools, from <em class="font-serif font-normal text-accent">one</em> partner.
        </p>

        <ul class="mt-8 grid gap-2">
          <li>
            <a :href="`mailto:${company.email}`" class="group flex items-center gap-3 rounded-xl border border-white/8 bg-ink-950/50 px-4 py-3 text-sm text-ink-100 transition-colors hover:border-accent/50 hover:text-accent">
              <PhEnvelopeSimple :size="18" class="shrink-0 text-accent" />
              <span class="flex-1 break-all">{{ company.email }}</span>
              <PhArrowUpRight :size="16" class="shrink-0 text-ink-500 transition-colors group-hover:text-accent" />
            </a>
          </li>
          <li>
            <a :href="company.phoneHref" class="group flex items-center gap-3 rounded-xl border border-white/8 bg-ink-950/50 px-4 py-3 text-sm text-ink-100 transition-colors hover:border-accent/50 hover:text-accent">
              <PhPhone :size="18" class="shrink-0 text-accent" />
              <span class="flex-1">{{ company.phone }}</span>
              <PhArrowUpRight :size="16" class="shrink-0 text-ink-500 transition-colors group-hover:text-accent" />
            </a>
          </li>
          <li>
            <a :href="company.mapUrl" target="_blank" rel="noopener noreferrer" class="group flex items-start gap-3 rounded-xl border border-white/8 bg-ink-950/50 px-4 py-3 text-sm text-ink-300 transition-colors hover:border-accent/50 hover:text-accent">
              <PhMapPin :size="18" class="mt-0.5 shrink-0 text-accent" />
              <address class="flex-1 leading-relaxed not-italic">
                {{ company.address.street }}<br />{{ company.address.area }}, {{ company.address.city }}, UAE
              </address>
              <PhArrowUpRight :size="16" class="mt-0.5 shrink-0 text-ink-500 transition-colors group-hover:text-accent" />
            </a>
          </li>
        </ul>

        <div class="mt-auto pt-8">
          <NuxtLink to="/contact" class="btn btn-primary">
            Request a demo
            <PhArrowRight :size="16" />
          </NuxtLink>
        </div>
      </section>

      <nav v-for="c in cards" :key="c.id" :aria-label="c.label" class="panel flex flex-col p-6">
        <p class="eyebrow">{{ c.label }}</p>
        <ul class="mt-5 grid gap-1">
          <li v-for="l in c.links" :key="l.to">
            <NuxtLink
              :to="l.to"
              class="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-ink-300 transition-colors hover:bg-ink-800/70 hover:text-ink-50"
            >
              {{ l.label }}
              <PhArrowUpRight :size="14" class="shrink-0 text-ink-700 transition-colors group-hover:text-accent" />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <section aria-label="Company registration" class="panel flex flex-col gap-5 p-6 sm:col-span-2 md:flex-row md:items-start md:gap-8 md:p-8 lg:col-span-3">
        <div class="flex shrink-0 items-center gap-3">
          <span class="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent"><PhSealCheck :size="22" /></span>
          <div>
            <p class="eyebrow !text-ink-500">DET Trade License</p>
            <p class="mt-1 font-mono text-lg text-accent">{{ company.license }}</p>
          </div>
        </div>
        <div class="space-y-2 text-xs leading-relaxed text-ink-500 md:border-l md:border-white/8 md:pl-8">
          <p class="text-ink-300">{{ companyNote }}</p>
          <p>
            {{ site.name }} provides technology, company setup and consultancy services to financial businesses. We do not give investment advice or offer trading services to retail clients.
          </p>
        </div>
      </section>

      <section aria-label="Copyright" class="panel flex flex-col justify-between gap-6 p-6 sm:col-span-2 lg:col-span-1">
        <p class="text-xs leading-relaxed text-ink-500">&copy; {{ year }} {{ company.legalName }}. All rights reserved.</p>
        <button
          type="button"
          class="group inline-flex items-center gap-2 self-start rounded-full border border-white/12 px-4 py-2 text-sm text-ink-100 transition-colors hover:border-accent hover:text-accent"
          @click="toTop"
        >
          <PhArrowUp :size="14" class="transition-transform duration-200 group-hover:-translate-y-0.5" />
          Back to top
        </button>
      </section>
    </div>
  </footer>
</template>
