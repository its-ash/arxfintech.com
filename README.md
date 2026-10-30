# ARX Fintech website

<img src="public/logo.png" alt="ARX Fintech" width="200" />

Marketing website for [arxfintech.com](https://arxfintech.com). ARX Fintech sets up offshore and regulated brokerages and supplies the trading technology and digital tools that they need.

The site is a static Nuxt 4 site. It has a dark theme, a scroll-driven Three.js particle scene and animated typography.

## Features

- 13 services in 4 groups: company setup, digital presence, trading technology and consultancy.
- One page for each service. The pages come from one data file.
- A Three.js particle scene. When you scroll, the particles change shape: globe, candlestick chart, gyroscope rings, liquidity wave and the ARX logo.
- Scene effects: intro burst, curl-noise drift, cursor repel, scroll-speed turbulence, bloom, grain and vignette.
- Text animations: 3D character flip, word mask reveal, scramble text, scroll-lit statements and scroll-driven display type.
- A demo request form with validation. The form sends data to Web3Forms.
- Support for reduced motion, keyboard navigation and screen readers.

## Stack

| Area | Tool |
| --- | --- |
| Framework | Nuxt 4, Vue 3, TypeScript (strict) |
| Styles | Tailwind CSS v4 |
| 3D | Three.js with post-processing (bloom) |
| Scroll | GSAP ScrollTrigger, Lenis |
| Icons | Phosphor Icons |
| Fonts | Clash Display, Playfair Display, Geist, Geist Mono (self-hosted by `@nuxt/fonts`) |

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm

## Get started

```bash
nvm use
npm install
make run
```

Open http://localhost:3000.

## Commands

| Command | Action |
| --- | --- |
| `make run` | Start the development server. |
| `make build` | Generate the static site in `docs/` and add `docs/.nojekyll`. |
| `make deploy` | Build, commit and push to `main`. |
| `npm run typecheck` | Run the TypeScript check. |
| `npm run preview` | Preview the production build. |

## Environment variables

Copy `.env.example` to `.env` and set the values:

| Name | Use |
| --- | --- |
| `NUXT_PUBLIC_WEB3FORMS_KEY` | Access key for the demo form. Get a key at [web3forms.com](https://web3forms.com). |

> [!IMPORTANT]
> The site is static. Set the key before you run `make build`. If the key is empty, the form shows an error message and sends nothing.

## Project structure

```text
app/
  assets/css/main.css      Design tokens, fonts and animation styles
  components/              Layout, navigation, form and text animation components
  data/site.ts             All copy, services, groups and FAQs
  layouts/default.vue      Page shell with the 3D canvas
  lib/scene.ts             Three.js particle scene
  pages/                   Home, service ([slug]), about and contact pages
  plugins/                 Smooth scroll and reveal directive
public/                    Logo, icons, robots.txt and CNAME
docs/                      Build output for GitHub Pages
```

## Edit content

All text is in `app/data/site.ts`.

- To add a service, add an object to `services`. The page, navigation, footer and form options update automatically.
- To show a word in the serif italic accent style, wrap it in asterisks, for example `'Copy trading that *grows* deposits'`.
- Do not use em-dashes in copy.

## Control the 3D scene

Each page section sets the scene state with `sceneAttrs`:

```vue
<section v-bind="sceneAttrs({ morph: 1, x: 0, y: -0.2, z: 7, tilt: 0 })">
```

| Key | Meaning |
| --- | --- |
| `morph` | Shape: `0` globe, `1` candlestick chart, `2` rings, `3` liquidity wave, `4` ARX logo |
| `x`, `y` | Position of the shape |
| `z` | Camera distance |
| `tilt` | Rotation on the X axis |

When you scroll from one section to the next, the scene blends between the two states. Give neighbouring sections adjacent `morph` values for clean transitions.

## Brand

- Background: `#111111`
- Accent: `#D6FB61`
- Logo: `public/logo.png`

To change a colour, edit `--color-accent` in `app/assets/css/main.css` and `COLORS` in `app/lib/scene.ts`.

## Deploy

GitHub Pages serves the `docs/` folder from the `main` branch. The custom domain is set in `public/CNAME`.

1. Set `NUXT_PUBLIC_WEB3FORMS_KEY` in `.env`.
2. Run `make deploy`.
3. In the GitHub repository settings, set Pages to deploy from `main` and `/docs` (one time only).

## Accessibility and performance

- If the user selects reduced motion, smooth scroll, the intro and time-based motion stop.
- Bloom runs only on screens wider than 767 px.
- The 3D scene loads separately, after the page content.
- If WebGL is not available, the page shows a plain dark background.
