# ARX Fintech website

Marketing site for https://arxfintech.com. Nuxt 4 static site, dark theme, Three.js scroll scene.

## Stack

- Nuxt 4 (`app/` directory), TypeScript strict, Vue 3.
- Tailwind CSS v4 through `@tailwindcss/vite`. Tokens are in `app/assets/css/main.css` (`@theme`).
- Three.js scene in `app/lib/scene.ts`. GSAP ScrollTrigger and Lenis in `app/plugins/smooth.client.ts`.
- Icons: `@phosphor-icons/vue` only.
- Fonts through `@nuxt/fonts`: Clash Display (`font-display`, headings), Playfair Display italic (`font-serif`, accent words), Geist (body), Geist Mono (`eyebrow`, labels, numbers), Roboto (`font-roboto`, site header only).

## Commands

- `make run`: dev server.
- `make build`: `nuxt generate`, copy `.output/public` to `docs/`, add `docs/.nojekyll`.
- `make deploy`: build, commit and push to `main`. GitHub Pages serves `docs/`.

## Content

- All copy and service data are in `app/data/site.ts`. Add a service there and the page, nav, footer and form update.
- Service pages use `app/pages/[slug].vue`.

## 3D scroll scene

- One fixed canvas (`app/components/SceneCanvas.client.vue`) for all pages.
- A section controls the scene with `v-bind="sceneAttrs({ morph, x, y, z, tilt })"`.
- `morph`: 0 globe, 1 candlestick chart, 2 gyroscope rings, 3 liquidity wave, 4 ARX logo (sampled from `public/logo.png`). Keep neighbouring sections on adjacent morph values.
- Effects: curl-noise drift, intro burst, cursor repel, scroll-velocity turbulence, bloom, grain and vignette (bloom only above 767px).
- Reduced motion turns off Lenis, intro, cursor repel and all time-based motion.

## Text animation

- `SplitText` (`mode="words"` mask reveal, `mode="chars"` 3D flip). Wrap accent words in `*...*` to render them in serif italic accent colour.
- `ScrambleText` for mono labels and numbers. `ScrollWords` for scroll-lit statements. `KineticBand` for scroll-driven display type rows.

## Rules

- Logo: use `<BrandLogo />`. It splits `public/logo.png` into white, red and green layers at runtime and blinks red and green in turn (1.6 s cycle, same rhythm as the particle logo in `scene.ts`).
- Brand: logo is `public/logo.png` (white, from arxfintech.com). Background `#111111`, accent `#D6FB61` (`--color-accent`, and `COLORS.accent` and `BG` in `app/lib/scene.ts`).
- Use only the one accent colour. Do not use em-dashes in copy.
- Animate only `transform`, `opacity` and `translate`.
- Use `v-reveal` (optional delay in ms) for entry reveals.
- The demo form (`DemoForm.vue`) posts to Web3Forms. Set `NUXT_PUBLIC_WEB3FORMS_KEY` at build time. It reads `?topic=<slug>` to preselect the service.
