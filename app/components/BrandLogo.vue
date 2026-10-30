<script setup lang="ts">
withDefaults(defineProps<{ priority?: boolean }>(), { priority: false })

const layers = shallowRef<LogoLayers>()

onMounted(() => {
  logoLayers()
    .then((l) => (layers.value = l))
    .catch(() => undefined)
})
</script>

<template>
  <span class="relative inline-block">
    <img
      v-if="!layers"
      src="/logo.png"
      alt="ARX Fintech"
      width="640"
      height="253"
      :fetchpriority="priority ? 'high' : undefined"
      :loading="priority ? undefined : 'lazy'"
      class="block h-full w-auto"
    />
    <template v-else>
      <img :src="layers.base" alt="ARX Fintech" width="640" height="253" class="block h-full w-auto" />
      <img :src="layers.red" alt="" aria-hidden="true" class="logo-beat logo-beat-red absolute inset-0 h-full w-auto" />
      <img :src="layers.green" alt="" aria-hidden="true" class="logo-beat logo-beat-green absolute inset-0 h-full w-auto" />
    </template>
  </span>
</template>
