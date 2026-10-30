<script setup lang="ts">
import { groups, inGroup, site } from '~/data/site'

const cols = groups.map((g) => ({ ...g, items: inGroup(g.id) }))
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative border-t border-white/8 bg-ink-950/80 backdrop-blur-xl">
    <div class="shell grid gap-12 py-16 md:grid-cols-[1.3fr_repeat(4,1fr)]">
      <div>
        <NuxtLink to="/" class="inline-flex" aria-label="ARX Fintech home">
          <img src="/logo.png" alt="ARX Fintech" width="640" height="253" loading="lazy" class="h-11 w-auto" />
        </NuxtLink>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
          Company setup, trading technology and digital tools for brokers, from one partner.
        </p>
        <NuxtLink to="/contact" class="btn btn-ghost mt-6">Contact us</NuxtLink>
      </div>
      <nav v-for="c in cols" :key="c.id" :aria-label="c.label">
        <p class="text-sm font-medium text-ink-50">{{ c.label }}</p>
        <ul class="mt-4 space-y-3">
          <li v-for="s in c.items" :key="s.slug">
            <NuxtLink :to="`/${s.slug}`" class="text-sm text-ink-300 transition-colors hover:text-ink-50">{{ s.label }}</NuxtLink>
          </li>
          <li v-if="c.id === 'consulting'">
            <NuxtLink to="/about" class="text-sm text-ink-300 transition-colors hover:text-ink-50">About us</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
    <div class="shell flex flex-col gap-3 border-t border-white/8 py-6 text-xs leading-relaxed text-ink-500 md:flex-row md:justify-between">
      <p class="max-w-3xl">
        {{ site.name }} provides technology, company setup and consultancy services to financial businesses. We do not give investment advice or offer trading services to retail clients.
      </p>
      <p class="shrink-0">&copy; {{ year }} {{ site.name }}. All rights reserved.</p>
    </div>
  </footer>
</template>
