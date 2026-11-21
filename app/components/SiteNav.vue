<script setup lang="ts">
import { PhArrowRight, PhArrowUpRight, PhCaretDown, PhChatCircleText, PhList, PhX } from '@phosphor-icons/vue'
import { groups, inGroup, type GroupId } from '~/data/site'

const open = ref<GroupId | null>(null)
const mobile = ref(false)
const root = ref<HTMLElement>()
const rail = ref<HTMLElement>()
const glider = reactive({ x: 0, w: 0, on: false })
const route = useRoute()
const { $lenis, $reduced } = useNuxtApp()

const menus = groups.map((g) => ({ ...g, items: inGroup(g.id) }))

const isGroupActive = (id: GroupId) =>
  menus.find((m) => m.id === id)?.items.some((s) => route.path === `/${s.slug}`) ?? false

const moveGlider = (el?: HTMLElement | null) => {
  if (!el || !rail.value) {
    glider.on = false
    return
  }
  const rr = rail.value.getBoundingClientRect()
  const er = el.getBoundingClientRect()
  if (!er.width) {
    glider.on = false
    return
  }
  glider.x = er.left - rr.left
  glider.w = er.width
  glider.on = true
}

const syncGlider = () => {
  const target = rail.value?.querySelector<HTMLElement>('[data-nav-active="true"]')
  moveGlider(target)
}

const onRailHover = (e: Event) => moveGlider(e.currentTarget as HTMLElement)

const onHeaderMove = (e: PointerEvent) => {
  if ($reduced || e.pointerType !== 'mouse' || !root.value) return
  const r = root.value.getBoundingClientRect()
  root.value.style.setProperty('--hx', `${e.clientX - r.left}px`)
}

const toggle = (id: GroupId) => {
  open.value = open.value === id ? null : id
  nextTick(syncGlider)
}

const close = () => {
  open.value = null
  mobile.value = false
  nextTick(syncGlider)
}

const onDown = (e: PointerEvent) => {
  if (open.value && !root.value?.contains(e.target as Node)) close()
}

const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()

watch(() => route.fullPath, close)
watch(mobile, (v) => (v ? $lenis?.stop() : $lenis?.start()))

onMounted(() => {
  document.addEventListener('pointerdown', onDown)
  document.addEventListener('keydown', onKey)
  window.addEventListener('resize', syncGlider, { passive: true })
  nextTick(syncGlider)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDown)
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', syncGlider)
  $lenis?.start()
})
</script>

<template>
  <header ref="root" class="site-header font-roboto" @pointermove="onHeaderMove">
    <nav aria-label="Main" class="shell grid h-14 grid-cols-[1fr_auto] items-center gap-3 md:h-18 lg:grid-cols-[1fr_auto_1fr]">
      <NuxtLink
        to="/"
        class="group relative justify-self-start flex shrink-0 items-center py-1 transition-transform duration-300 hover:scale-[1.03]"
        aria-label="ARX Fintech home"
      >
        <span aria-hidden="true" class="pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-full bg-[radial-gradient(circle,rgb(214_251_97/.16),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <BrandLogo priority class="relative h-7 md:h-9" />
      </NuxtLink>

      <ul ref="rail" class="nav-rail hidden items-center gap-0.5 justify-self-center lg:flex" @pointerleave="syncGlider">
        <li
          aria-hidden="true"
          class="nav-glider"
          :style="{
            width: `${glider.w}px`,
            transform: `translate3d(${glider.x}px, 0, 0)`,
            opacity: glider.on ? 1 : 0,
          }"
        />
        <li v-for="m in menus" :key="m.id" class="relative z-10">
          <NuxtLink
            v-if="m.items.length === 1"
            :to="`/${m.items[0]!.slug}`"
            :data-nav-active="route.path === `/${m.items[0]!.slug}`"
            class="flex h-9 items-center rounded-full px-4 text-sm tracking-[0.01em] transition-colors duration-200"
            :class="route.path === `/${m.items[0]!.slug}` ? 'text-ink-50 font-medium' : 'text-ink-300 hover:text-ink-50'"
            @pointerenter="onRailHover"
            @focus="onRailHover"
          >
            {{ m.short }}
          </NuxtLink>
          <template v-else>
            <button
              type="button"
              :data-nav-active="open === m.id || isGroupActive(m.id)"
              class="flex h-9 items-center gap-1.5 rounded-full px-4 text-sm tracking-[0.01em] transition-colors duration-200"
              :class="open === m.id || isGroupActive(m.id) ? 'text-ink-50 font-medium' : 'text-ink-300 hover:text-ink-50'"
              :aria-expanded="open === m.id"
              :aria-controls="`menu-${m.id}`"
              @pointerenter="onRailHover"
              @focus="onRailHover"
              @click="toggle(m.id)"
            >
              {{ m.short }}
              <PhCaretDown :size="13" class="transition-transform duration-200" :class="open === m.id && 'rotate-180 text-accent'" />
            </button>
            <Transition name="pop">
              <div
                v-if="open === m.id"
                :id="`menu-${m.id}`"
                class="panel absolute top-full left-1/2 mt-4 w-[28rem] origin-top -translate-x-1/2 overflow-hidden !bg-[rgb(13_15_22/.95)] p-2.5"
              >
                <div aria-hidden="true" class="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(0_245_255/.65),rgb(214_251_97/.9),rgb(255_42_133/.55),transparent)]" />
                <p class="px-3 pt-2 pb-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">{{ m.label }}</p>
                <NuxtLink
                  v-for="s in m.items"
                  :key="s.slug"
                  :to="`/${s.slug}`"
                  class="group/item flex items-start gap-3.5 rounded-xl p-3 transition-colors duration-200 hover:bg-white/[0.06]"
                  active-class="bg-white/[0.08]"
                >
                  <span class="icon-badge size-9 shrink-0 rounded-lg transition-transform duration-200 group-hover/item:scale-105">
                    <component :is="s.icon" :size="18" />
                  </span>
                  <span class="flex-1">
                    <span class="block text-sm font-medium text-ink-50 transition-colors group-hover/item:text-accent">{{ s.label }}</span>
                    <span class="mt-0.5 block text-sm leading-snug text-ink-300">{{ s.blurb }}</span>
                  </span>
                  <PhArrowUpRight :size="15" class="mt-1 shrink-0 text-ink-500 opacity-0 transition-[opacity,transform,color] duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:text-accent group-hover/item:opacity-100" />
                </NuxtLink>
              </div>
            </Transition>
          </template>
        </li>
        <li class="relative z-10">
          <NuxtLink
            to="/about"
            :data-nav-active="route.path === '/about'"
            class="flex h-9 items-center rounded-full px-4 text-sm tracking-[0.01em] transition-colors duration-200"
            :class="route.path === '/about' ? 'text-ink-50 font-medium' : 'text-ink-300 hover:text-ink-50'"
            @pointerenter="onRailHover"
            @focus="onRailHover"
          >
            About
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-2 justify-self-end">
        <NuxtLink to="/contact" class="btn btn-primary btn-cinema hidden !min-h-10.5 !px-5 text-sm md:inline-flex">
          Request a demo
          <PhArrowRight :size="15" />
        </NuxtLink>

        <button
          type="button"
          class="-mr-1 grid size-11 place-items-center rounded-full border border-white/16 bg-ink-950/70 text-ink-50 backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent lg:hidden"
          :aria-label="mobile ? 'Close menu' : 'Open menu'"
          :aria-expanded="mobile"
          aria-controls="mobile-menu"
          @click="mobile = !mobile"
        >
          <PhX v-if="mobile" :size="20" />
          <PhList v-else :size="20" />
        </button>
      </div>
    </nav>
  </header>

  <Transition name="sheet">
    <nav
      v-if="mobile"
      id="mobile-menu"
      aria-label="Mobile navigation"
      class="fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-white/10 bg-ink-950/96 px-5 pt-5 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur-2xl md:top-18 lg:hidden"
    >
      <div v-for="m in menus" :key="m.id" class="border-b border-white/10 py-4 first:pt-0">
        <p class="mb-2 px-2 font-mono text-xs tracking-[0.14em] text-ink-500 uppercase">{{ m.label }}</p>
        <NuxtLink
          v-for="s in m.items"
          :key="s.slug"
          :to="`/${s.slug}`"
          class="flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 text-ink-50 transition-colors hover:bg-white/[0.06] hover:text-accent"
          active-class="bg-white/[0.08] text-accent"
        >
          <span class="icon-badge size-8 shrink-0 rounded-lg"><component :is="s.icon" :size="17" /></span>
          {{ s.label }}
        </NuxtLink>
      </div>
      <div class="pt-4">
        <NuxtLink
          to="/about"
          class="flex min-h-11 items-center rounded-xl px-2 py-2 text-ink-50 transition-colors hover:bg-white/[0.06] hover:text-accent"
          active-class="bg-white/[0.08] text-accent"
        >
          About
        </NuxtLink>
      </div>
    </nav>
  </Transition>

  <div
    v-if="!mobile && route.path !== '/contact'"
    class="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden"
  >
    <NuxtLink
      to="/contact"
      class="btn btn-primary btn-cinema pointer-events-auto w-full max-w-xs !min-h-12 shadow-[0_16px_40px_-8px_rgb(0_0_0/.95),0_8px_28px_-10px_rgb(214_251_97/.6)]"
    >
      <PhChatCircleText :size="18" />
      Contact us
      <PhArrowRight :size="16" />
    </NuxtLink>
  </div>
</template>
