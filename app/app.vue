<script setup lang="ts">
import { company, site } from '~/data/site'

const route = useRoute()
const canonical = computed(() => {
  const path = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
  return `${site.url}${path}`
})

useHead({
  titleTemplate: (t) => (t ? `${t} | ${site.name}` : site.title),
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${site.url}/#organization`,
            name: site.name,
            legalName: company.legalName,
            url: `${site.url}/`,
            logo: {
              '@type': 'ImageObject',
              url: `${site.url}/icon-512.png`,
              width: 512,
              height: 512,
            },
            image: site.ogImage,
            description: site.description,
            email: company.email,
            telephone: company.phoneHref.replace('tel:', ''),
            identifier: { '@type': 'PropertyValue', propertyID: 'DET Trade License', value: company.license },
            address: {
              '@type': 'PostalAddress',
              streetAddress: company.address.street,
              addressLocality: `${company.address.area}, ${company.address.city}`,
              addressCountry: company.address.countryCode,
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'sales',
              email: company.email,
              telephone: company.phoneHref.replace('tel:', ''),
              availableLanguage: ['English'],
            },
          },
          {
            '@type': 'WebSite',
            '@id': `${site.url}/#website`,
            name: site.name,
            url: `${site.url}/`,
            description: site.description,
            inLanguage: 'en',
            publisher: { '@id': `${site.url}/#organization` },
          },
        ],
      }),
    },
  ],
})

useSeoMeta({
  description: site.description,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  ogSiteName: site.name,
  ogLocale: 'en_US',
  ogType: 'website',
  ogUrl: canonical,
  ogImage: site.ogImage,
  ogImageSecureUrl: site.ogImage,
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: site.ogImageAlt,
  twitterCard: 'summary_large_image',
  twitterImage: site.ogImage,
  twitterImageAlt: site.ogImageAlt,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
