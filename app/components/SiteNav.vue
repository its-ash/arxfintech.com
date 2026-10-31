<script setup lang="ts">
import { PhCaretDown, PhChatCircleText, PhList, PhX } from '@phosphor-icons/vue'
import { groups, inGroup, type GroupId } from '~/data/site'

const open = ref<GroupId | null>(null)
const mobile = ref(false)
const root = ref<HTMLElement>()
const route = useRoute()
const { $lenis } = useNuxtApp()

const menus = groups.map((g) => ({ ...g, items: inGroup(g.id) }))

const toggle = (id: GroupId) => (open.value = open.value === id ? null : id)

const close = () => {
  open.value = null
  mobile.value = false
}

const onDown = (e: PointerEvent) => {
  if (open.value && !root.value?.contains(e.target as Node)) open.value = null
}

const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()

watch(() => route.fullPath, close)
watch(mobile, (v) => (v ? $lenis?.stop() : $lenis?.start()))

onMounted(() => {
  document.addEventListener('pointerdown', onDown)
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDown)
  document.removeEventListener('keydown', onKey)
  $lenis?.start()
})
</script>

<template>
  <header ref="root" class="sticky top-0 z-40 font-roboto border-b border-white/8 bg-ink-950/90 backdrop-blur-xl [@media(prefers-reduced-transparency:reduce)]:bg-ink-950">
    <nav aria-label="Main" class="shell flex h-14 items-center gap-2 md:h-18">
      <NuxtLink to="/" class="mr-auto flex shrink-0 items-center" aria-label="ARX Fintech home">
        <BrandLogo priority class="h-7 md:h-9" />
      </NuxtLink>

      <ul class="hidden items-center gap-1 lg:flex">
        <li v-for="m in menus" :key="m.id" class="relative">
          <NuxtLink
            v-if="m.items.length === 1"
            :to="`/${m.items[0]!.slug}`"
            class="flex h-10 items-center rounded-full px-3.5 text-sm text-ink-300 transition-colors hover:text-ink-50"
            active-class="bg-ink-800 text-ink-50"
          >
            {{ m.short }}
          </NuxtLink>
          <template v-else>
            <button
              type="button"
              class="flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors"
              :class="open === m.id ? 'bg-ink-800 text-ink-50' : 'text-ink-300 hover:text-ink-50'"
              :aria-expanded="open === m.id"
              :aria-controls="`menu-${m.id}`"
              @click="toggle(m.id)"
            >
              {{ m.short }}
              <PhCaretDown :size="14" class="transition-transform duration-200" :class="open === m.id && 'rotate-180'" />
            </button>
            <Transition name="pop">
              <div
                v-if="open === m.id"
                :id="`menu-${m.id}`"
                class="panel absolute top-full left-1/2 mt-4 w-[26rem] origin-top -translate-x-1/2 !bg-ink-900/97 p-2"
              >
                <p class="px-3 pt-2 pb-1 text-xs text-ink-500">{{ m.label }}</p>
                <NuxtLink
                  v-for="s in m.items"
                  :key="s.slug"
                  :to="`/${s.slug}`"
                  class="flex gap-3 rounded-xl p-3 transition-colors hover:bg-ink-800"
                  active-class="bg-ink-800"
                >
                  <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                    <component :is="s.icon" :size="18" />
                  </span>
                  <span>
                    <span class="block text-sm font-medium text-ink-50">{{ s.label }}</span>
                    <span class="block text-sm leading-snug text-ink-300">{{ s.blurb }}</span>
                  </span>
                </NuxtLink>
              </div>
            </Transition>
          </template>
        </li>
        <li>
          <NuxtLink to="/about" class="flex h-10 items-center rounded-full px-3.5 text-sm text-ink-300 transition-colors hover:text-ink-50" active-class="bg-ink-800 text-ink-50">
            About
          </NuxtLink>
        </li>
      </ul>

      <NuxtLink to="/contact" class="btn btn-primary ml-4 hidden !min-h-11 md:inline-flex">Request a demo</NuxtLink>

      <NuxtLink to="/contact" class="btn btn-primary !min-h-10 !px-4 text-sm md:hidden">
        <PhChatCircleText :size="16" />
        Contact
      </NuxtLink>

      <button
        type="button"
        class="-mr-2 hidden size-11 place-items-center rounded-full text-ink-50 md:grid lg:hidden"
        :aria-label="mobile ? 'Close menu' : 'Open menu'"
        :aria-expanded="mobile"
        aria-controls="mobile-menu"
        @click="mobile = !mobile"
      >
        <PhX v-if="mobile" :size="22" />
        <PhList v-else :size="22" />
      </button>
    </nav>

    <Transition name="sheet">
      <div v-if="mobile" id="mobile-menu" class="fixed inset-x-0 top-14 bottom-0 md:top-18 overflow-y-auto overscroll-contain border-t border-white/8 bg-ink-950 px-5 py-6 lg:hidden">
        <div v-for="m in menus" :key="m.id" class="border-b border-white/8 py-4 first:pt-0">
          <p class="mb-2 text-xs text-ink-500">{{ m.label }}</p>
          <NuxtLink v-for="s in m.items" :key="s.slug" :to="`/${s.slug}`" class="flex items-center gap-3 py-2.5 text-ink-50">
            <component :is="s.icon" :size="20" class="text-accent" />
            {{ s.label }}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-3 pt-5">
          <NuxtLink to="/about" class="py-2 text-ink-50">About</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-primary w-full">Request a demo</NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
