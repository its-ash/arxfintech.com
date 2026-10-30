<script setup lang="ts">
import { gsap } from 'gsap'
import type Lenis from 'lenis'
import { ArxScene, SCENE_KEYS, type SceneState } from '~/lib/scene'

const canvas = useTemplateRef<HTMLCanvasElement>('cv')
const failed = ref(false)
const nuxtApp = useNuxtApp()
let scene: ArxScene | undefined
let ctx: gsap.Context | undefined
let unhook: (() => void) | undefined
let unscroll: (() => void) | undefined

const read = (el: HTMLElement): SceneState =>
  Object.fromEntries(SCENE_KEYS.map((k) => [k, Number(el.dataset[k] ?? 0) || 0])) as unknown as SceneState

const bind = () => {
  if (!scene) return
  ctx?.revert()
  const s = scene
  ctx = gsap.context(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-scene]')]
    if (!els.length) return
    Object.assign(s.state, read(els[0]!))
    els.slice(1).forEach((el, i) => {
      gsap.fromTo(s.state, read(els[i]!), {
        ...read(el),
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: nuxtApp.$reduced ? true : 1 },
      })
    })
  })
}

const onPointer = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  scene?.setPointer((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1))
}

const onScroll = (l: Lenis) => scene?.setVelocity(l.velocity)

onMounted(async () => {
  await nextTick()
  if (!canvas.value) return
  try {
    scene = new ArxScene(canvas.value, Boolean(nuxtApp.$reduced), '/logo.png')
  } catch {
    failed.value = true
    return
  }
  bind()
  unhook = nuxtApp.hook('page:finish', () => nextTick(bind))
  addEventListener('pointermove', onPointer, { passive: true })
  unscroll = nuxtApp.$lenis?.on('scroll', onScroll)
})

onBeforeUnmount(() => {
  unhook?.()
  ctx?.revert()
  removeEventListener('pointermove', onPointer)
  unscroll?.()
  scene?.dispose()
})
</script>

<template>
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 bg-ink-950">
    <canvas v-if="!failed" ref="cv" class="absolute inset-0 size-full" />
  </div>
</template>
