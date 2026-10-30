<script setup lang="ts">
import { site } from '~/data/site'

const route = useRoute()

useHead({
  titleTemplate: (t) => (t ? `${t} | ${site.name}` : site.title),
  link: [{ rel: 'canonical', href: computed(() => `${site.url}${route.path === '/' ? '' : route.path}`) }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon-512.png`,
        description: site.description,
      }),
    },
  ],
})

useSeoMeta({
  description: site.description,
  ogSiteName: site.name,
  ogType: 'website',
  ogUrl: computed(() => `${site.url}${route.path}`),
  ogImage: `${site.url}/icon-512.png`,
  twitterCard: 'summary',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
