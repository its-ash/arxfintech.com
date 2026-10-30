<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string; tag?: string; mode?: 'words' | 'chars'; delay?: number }>(), {
  tag: 'h2',
  mode: 'words',
  delay: 0,
})

const parts = computed(() => {
  let j = 0
  return toWords(props.text).map((p, i) => {
    const chars = [...p.w].map((c) => ({ c, j: j++ }))
    return { ...p, i, chars }
  })
})
</script>

<template>
  <component :is="tag" class="split" :data-mode="mode" v-reveal="delay">
    <span class="sr-only">{{ plain(text) }}</span>
    <span aria-hidden="true">
      <template v-for="p in parts" :key="p.i">
        <span class="sw"><component :is="p.em ? 'em' : 'span'" class="si" :style="{ '--i': p.i }"><template v-if="mode === 'chars'"><span v-for="c in p.chars" :key="c.j" class="sc" :style="{ '--j': c.j }">{{ c.c }}</span></template><template v-else>{{ p.w }}</template></component></span>{{ ' ' }}
      </template>
    </span>
  </component>
</template>
