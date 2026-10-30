<template>
  <div class="relative isolate min-h-dvh">
    <a href="#main" class="sr-only z-50 rounded-full bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">Skip to content</a>
    <LazySceneCanvas />
    <SiteNav />
    <main id="main" class="relative">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
