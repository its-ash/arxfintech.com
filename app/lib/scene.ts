import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

export interface SceneState {
  morph: number
  x: number
  y: number
  z: number
  tilt: number
}

export const SCENE_KEYS = ['morph', 'x', 'y', 'z', 'tilt'] as const

const RADIUS = 2
const CANDLES = 44
const CHART_W = 6.4
const LOGO_W = 5.4
const FOV = 40
const BG = '#111111'

const COLORS = {
  base: new Color('#9c9c9c'),
  accent: new Color('#d6fb61'),
  bear: new Color('#ff5d6c'),
}

const HUBS: [number, number][] = [
  [51.5, -0.1], [40.7, -74], [1.35, 103.8], [25.2, 55.3], [22.3, 114.2],
  [35.7, 139.7], [-33.9, 151.2], [50.1, 8.7], [34.7, 33], [-26.2, 28],
  [-23.5, -46.6], [19.1, 72.9], [-4.6, 55.5], [-20.2, 57.5], [43.7, -79.4],
]

const ROUTES: [number, number][] = [
  [0, 1], [0, 3], [0, 7], [1, 10], [1, 14], [2, 4], [2, 6], [3, 11],
  [3, 12], [4, 5], [7, 8], [8, 3], [9, 13], [12, 0], [13, 2], [11, 2],
  [5, 1], [10, 9],
]

const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const pointsVert = /* glsl */ `
uniform float uMorph;
uniform float uTime;
uniform float uSize;
uniform float uScale;
uniform float uIntro;
uniform float uVel;
uniform vec3 uMouse;
uniform float uMouseOn;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform vec3 uBear;
attribute vec3 aCandle;
attribute vec3 aRing;
attribute vec3 aWave;
attribute vec3 aLogo;
attribute vec3 aLogoCol;
attribute float aSeed;
attribute float aTone;
varying vec3 vColor;
varying float vAlpha;

${NOISE}

vec3 rotX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c); }
vec3 rotZ(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z); }

vec3 ringPos() {
  float layer = aRing.z;
  float R = 1.45 + layer * 0.48;
  float dir = layer > 0.5 && layer < 1.5 ? -1.0 : 1.0;
  float u = aRing.x + uTime * 0.22 * dir * (1.0 + layer * 0.35);
  float tube = 0.04 + aSeed * 0.07;
  float r = R + tube * cos(aRing.y);
  vec3 p = vec3(r * cos(u), tube * sin(aRing.y), r * sin(u));
  if (layer > 0.5 && layer < 1.5) p = rotX(p, 1.15);
  else if (layer > 1.5) p = rotZ(rotX(p, -0.6), 1.05);
  return p;
}

vec3 wavePos(out float h) {
  vec3 w = aWave;
  h = sin(w.x * 1.1 + uTime * 0.9) * 0.22 + cos(w.z * 1.6 - uTime * 0.7) * 0.16 + snoise(vec3(w.x * 0.35, w.z * 0.35, uTime * 0.12)) * 0.45;
  return vec3(w.x, h, w.z);
}

float hat(float m, float k) { return clamp(1.0 - abs(m - k), 0.0, 1.0); }

void main() {
  float idx = floor(uMorph);
  float t = uMorph - idx;
  float ts = clamp((t - aSeed * 0.3) / 0.7, 0.0, 1.0);
  ts = ts * ts * (3.0 - 2.0 * ts);
  float m = idx + ts;
  float w0 = hat(m, 0.0);
  float w1 = hat(m, 1.0);
  float w2 = hat(m, 2.0);
  float w3 = hat(m, 3.0);
  float w4 = hat(m, 4.0);

  float h;
  vec3 pw = wavePos(h);
  vec3 p = position * w0 + aCandle * w1 + ringPos() * w2 + pw * w3 + aLogo * w4;

  vec3 cGlobe = mix(uBase, uAccent, step(0.93, aSeed));
  vec3 cCandle = mix(uBear, uAccent, aTone);
  vec3 cRing = mix(uBase, uAccent, 0.3 + 0.6 * step(0.55, fract(aSeed * 7.0)));
  vec3 cWave = mix(uBase * 0.55, uAccent, smoothstep(-0.25, 0.6, h));
  vec3 col = cGlobe * w0 + cCandle * w1 + cRing * w2 + cWave * w3 + aLogoCol * w4;

  float swirl = sin(ts * 3.14159);
  vec3 q = p * 0.45 + vec3(0.0, 0.0, uTime * 0.06);
  vec3 n = vec3(snoise(q), snoise(q + vec3(31.4, 0.0, 0.0)), snoise(q + vec3(0.0, -17.2, 9.1)));
  p += n * (0.025 + swirl * 0.95 + uVel * 0.6);

  float it = clamp(uIntro * 1.5 - aSeed * 0.5, 0.0, 1.0);
  it = 1.0 - pow(1.0 - it, 3.0);
  vec3 dir = normalize(vec3(sin(aSeed * 91.7), cos(aSeed * 47.3), sin(aSeed * 13.1 + 1.0)) + vec3(0.0001));
  p = mix(dir * (7.0 + aSeed * 9.0), p, it);

  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec2 dv = wp.xy - uMouse.xy;
  float f = uMouseOn * smoothstep(1.3, 0.0, length(dv));
  wp.xy += normalize(dv + vec2(0.0001)) * f * 0.55;
  wp.z += f * 0.5;

  vec4 mv = viewMatrix * wp;
  vec4 center = viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  gl_Position = projectionMatrix * mv;

  float twinkle = 0.75 + 0.25 * sin(uTime * 1.7 + aSeed * 60.0);
  gl_PointSize = uSize * uScale * (0.6 + aSeed * 0.8) * twinkle * (1.0 + swirl * 0.6 + f) / -mv.z;

  float facing = smoothstep(-2.4, 1.6, mv.z - center.z);
  vAlpha = mix(1.0, mix(0.18, 1.0, facing), w0 + w2) * mix(1.0, 0.45, w4) * it;
  vColor = col + f * uAccent * 0.6;
}
`

const pointsFrag = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha * uOpacity;
  gl_FragColor = vec4(vColor, a);
}
`

const arcsVert = /* glsl */ `
attribute float aT;
attribute float aOff;
varying float vT;
varying float vOff;

void main() {
  vT = aT;
  vOff = aOff;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const arcsFrag = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
varying float vT;
varying float vOff;

void main() {
  float head = fract(uTime * 0.16 + vOff);
  float d = head - vT;
  float trail = smoothstep(0.3, 0.0, d) * step(0.0, d);
  float a = (0.06 + trail * 1.2) * uOpacity;
  gl_FragColor = vec4(uColor * (1.0 + trail), a);
}
`

const dustVert = /* glsl */ `
uniform float uTime;
uniform float uScale;
attribute float aSeed;
varying float vA;

void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.2 + aSeed * 30.0) * 0.15;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (0.012 + aSeed * 0.02) * uScale / -mv.z;
  vA = 0.15 + aSeed * 0.3;
}
`

const dustFrag = /* glsl */ `
uniform vec3 uColor;
varying float vA;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vA);
}
`

const FinishShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
  vertexShader: /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
  fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 c = vUv - 0.5;
  float r = dot(c, c);
  vec2 off = c * r * 0.014;
  vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
  col *= 1.0 - r * 0.55;
  col += (hash(vUv * 900.0 + fract(uTime)) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`,
}

const fromLatLon = (lat: number, lon: number, r: number) => {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

const mulberry = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const hat = (m: number, k: number) => Math.max(0, 1 - Math.abs(m - k))

const buildCandles = (rnd: () => number) => {
  let price = 0
  const res: { open: number; close: number; high: number; low: number }[] = []
  for (let i = 0; i < CANDLES; i++) {
    const open = price
    const close = open + Math.sin(i / 6) * 0.06 + 0.025 + (rnd() - 0.5) * 0.36
    res.push({ open, close, high: Math.max(open, close) + rnd() * 0.16, low: Math.min(open, close) - rnd() * 0.16 })
    price = close
  }
  const min = Math.min(...res.map((c) => c.low))
  const k = 2.6 / (Math.max(...res.map((c) => c.high)) - min)
  const f = (v: number) => (v - min) * k - 1.3
  return res.map((c) => ({ open: f(c.open), close: f(c.close), high: f(c.high), low: f(c.low) }))
}

export class ArxScene {
  readonly state: SceneState = { morph: 0, x: 1.7, y: 0, z: 7, tilt: 0.35 }
  private cur: SceneState = { ...this.state }
  private renderer: WebGLRenderer
  private composer?: EffectComposer
  private finish?: ShaderPass
  private camera = new PerspectiveCamera(FOV, 1, 0.1, 100)
  private scene = new Scene()
  private group = new Group()
  private points: Points
  private pointsMat: ShaderMaterial
  private arcsMat: ShaderMaterial
  private dustMat: ShaderMaterial
  private dust: Points
  private geos: BufferGeometry[] = []
  private ro: ResizeObserver
  private pointer = { x: 0, y: 0, tx: 0, ty: 0, last: -1e9 }
  private mouse = new Vector3(99, 99, 0)
  private ray = new Vector3()
  private mouseOn = 0
  private vel = 0
  private velTarget = 0
  private spin = 0
  private aspect = 1
  private last = 0
  private elapsed = 0
  private small: boolean

  constructor(
    private canvas: HTMLCanvasElement,
    private reduced: boolean,
    logoUrl?: string,
  ) {
    this.small = matchMedia('(max-width: 767px)').matches
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setClearColor(BG, 1)
    this.scene.background = new Color(BG)
    this.scene.add(this.group)

    const count = this.small ? 6000 : 14000
    const rnd = mulberry(7)

    this.pointsMat = new ShaderMaterial({
      vertexShader: pointsVert,
      fragmentShader: pointsFrag,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: this.small ? 0.036 : 0.028 },
        uScale: { value: 1 },
        uIntro: { value: reduced ? 1 : 0 },
        uVel: { value: 0 },
        uMouse: { value: this.mouse },
        uMouseOn: { value: 0 },
        uOpacity: { value: 1 },
        uBase: { value: COLORS.base },
        uAccent: { value: COLORS.accent },
        uBear: { value: COLORS.bear },
      },
    })
    this.points = new Points(this.buildPoints(count, rnd), this.pointsMat)
    this.points.frustumCulled = false
    this.group.add(this.points)

    this.arcsMat = new ShaderMaterial({
      vertexShader: arcsVert,
      fragmentShader: arcsFrag,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uColor: { value: COLORS.accent } },
    })
    this.group.add(new LineSegments(this.buildArcs(), this.arcsMat))

    this.dustMat = new ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uScale: { value: 1 }, uColor: { value: COLORS.base } },
    })
    this.dust = new Points(this.buildDust(this.small ? 260 : 600, rnd), this.dustMat)
    this.scene.add(this.dust)

    if (!this.small) {
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.composer.addPass(new UnrealBloomPass(new Vector2(512, 512), 0.55, 0.4, 0.28))
      this.composer.addPass(new OutputPass())
      this.finish = new ShaderPass(FinishShader)
      this.composer.addPass(this.finish)
    }

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas)
    this.resize()
    if (logoUrl) this.loadLogo(logoUrl).catch(() => undefined)
    this.renderer.setAnimationLoop(this.tick)
  }

  setPointer(x: number, y: number) {
    this.pointer.tx = x
    this.pointer.ty = y
    this.pointer.last = this.elapsed
  }

  setVelocity(v: number) {
    this.velTarget = Math.min(1.4, Math.abs(v) / 45)
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.ro.disconnect()
    this.geos.forEach((g) => g.dispose())
    ;[this.pointsMat, this.arcsMat, this.dustMat].forEach((m) => m.dispose())
    this.composer?.dispose()
    this.renderer.dispose()
  }

  private async loadLogo(url: string) {
    const img = new Image()
    img.src = url
    await img.decode()
    const W = 420
    const H = Math.round((W * img.naturalHeight) / img.naturalWidth)
    const cv = document.createElement('canvas')
    cv.width = W
    cv.height = H
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    if (!ctx || !H) return
    ctx.drawImage(img, 0, 0, W, H)
    const { data } = ctx.getImageData(0, 0, W, H)
    const px: number[] = []
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3]! > 140) px.push(x, y)
    const n = px.length / 2
    if (!n) return
    const g = this.points.geometry
    const pos = g.getAttribute('aLogo') as BufferAttribute
    const col = g.getAttribute('aLogoCol') as BufferAttribute
    const k = LOGO_W / W
    const rnd = mulberry(11)
    for (let i = 0; i < pos.count; i++) {
      const j = Math.floor(rnd() * n) * 2
      const x = px[j]!
      const y = px[j + 1]!
      const o = (y * W + x) * 4
      pos.setXYZ(i, (x - W / 2 + rnd() - 0.5) * k, (H / 2 - y + rnd() - 0.5) * k, (rnd() - 0.5) * 0.14)
      col.setXYZ(i, (data[o]! / 255) * 0.85, (data[o + 1]! / 255) * 0.85, (data[o + 2]! / 255) * 0.85)
    }
    pos.needsUpdate = true
    col.needsUpdate = true
  }

  private buildPoints(count: number, rnd: () => number) {
    const pos = new Float32Array(count * 3)
    const candle = new Float32Array(count * 3)
    const ring = new Float32Array(count * 3)
    const wave = new Float32Array(count * 3)
    const logo = new Float32Array(count * 3)
    const logoCol = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const tone = new Float32Array(count)
    const candles = buildCandles(rnd)
    const golden = Math.PI * (3 - Math.sqrt(5))
    const step = CHART_W / CANDLES
    const cols = Math.ceil(Math.sqrt(count * 2.2))
    const rows = Math.ceil(count / cols)

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const gx = Math.cos(golden * i) * r * RADIUS
      const gz = Math.sin(golden * i) * r * RADIUS
      pos.set([gx, y * RADIUS, gz], i * 3)
      logo.set([gx, y * RADIUS, gz], i * 3)
      logoCol.set([COLORS.base.r, COLORS.base.g, COLORS.base.b], i * 3)

      const ci = i % CANDLES
      const c = candles[ci]!
      const cx = -CHART_W / 2 + step * (ci + 0.5)
      const wick = rnd() < 0.16
      const top = wick ? c.high : Math.max(c.open, c.close)
      const bot = wick ? c.low : Math.min(c.open, c.close)
      candle.set(
        [cx + (rnd() - 0.5) * (wick ? 0.012 : step * 0.56), bot + rnd() * Math.max(top - bot, 0.035), (rnd() - 0.5) * 0.14],
        i * 3,
      )
      tone[i] = c.close >= c.open ? 1 : 0

      ring.set([rnd() * Math.PI * 2, rnd() * Math.PI * 2, i % 3], i * 3)

      const col = i % cols
      const row = Math.floor(i / cols)
      wave.set([(col / (cols - 1) - 0.5) * 9 + (rnd() - 0.5) * 0.02, 0, (row / Math.max(rows - 1, 1) - 0.5) * 5], i * 3)

      seed[i] = rnd()
    }

    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aCandle', new BufferAttribute(candle, 3))
    g.setAttribute('aRing', new BufferAttribute(ring, 3))
    g.setAttribute('aWave', new BufferAttribute(wave, 3))
    g.setAttribute('aLogo', new BufferAttribute(logo, 3))
    g.setAttribute('aLogoCol', new BufferAttribute(logoCol, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    g.setAttribute('aTone', new BufferAttribute(tone, 1))
    this.geos.push(g)
    return g
  }

  private buildArcs() {
    const SEG = 64
    const pos: number[] = []
    const ts: number[] = []
    const offs: number[] = []
    ROUTES.forEach(([a, b], k) => {
      const va = fromLatLon(...HUBS[a]!, 1)
      const vb = fromLatLon(...HUBS[b]!, 1)
      const w = va.angleTo(vb)
      const s = Math.sin(w)
      const lift = 0.1 + w * 0.14
      const pt = (t: number) =>
        va
          .clone()
          .multiplyScalar(Math.sin((1 - t) * w) / s)
          .addScaledVector(vb, Math.sin(t * w) / s)
          .normalize()
          .multiplyScalar(RADIUS * (1.01 + lift * Math.sin(Math.PI * t)))
      const off = (k * 0.618) % 1
      for (let i = 0; i < SEG; i++) {
        const p0 = pt(i / SEG)
        const p1 = pt((i + 1) / SEG)
        pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z)
        ts.push(i / SEG, (i + 1) / SEG)
        offs.push(off, off)
      }
    })
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
    g.setAttribute('aT', new BufferAttribute(new Float32Array(ts), 1))
    g.setAttribute('aOff', new BufferAttribute(new Float32Array(offs), 1))
    this.geos.push(g)
    return g
  }

  private buildDust(count: number, rnd: () => number) {
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(rnd() - 0.5) * 22, (rnd() - 0.5) * 14, (rnd() - 0.5) * 10 - 2], i * 3)
      seed[i] = rnd()
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    this.geos.push(g)
    return g
  }

  private resize() {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    if (!w || !h) return
    const dpr = Math.min(devicePixelRatio, this.composer ? 1.5 : 1.75)
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    this.composer?.setPixelRatio(dpr)
    this.composer?.setSize(w, h)
    this.aspect = w / h
    this.camera.aspect = this.aspect
    this.camera.updateProjectionMatrix()
    const scale = (h * dpr) / (2 * Math.tan((FOV * Math.PI) / 360))
    this.pointsMat.uniforms.uScale!.value = scale
    this.dustMat.uniforms.uScale!.value = scale
  }

  private updateMouse() {
    const p = this.pointer
    this.ray.set(p.x, p.y, 0.5).unproject(this.camera).sub(this.camera.position).normalize()
    const t = -this.camera.position.z / this.ray.z
    this.mouse.copy(this.camera.position).addScaledVector(this.ray, t)
  }

  private tick = (now: number) => {
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0.016
    this.last = now
    this.elapsed += dt
    const t = this.reduced ? 0 : this.elapsed
    const k = this.reduced ? 1 : 1 - Math.exp(-dt * 5)
    for (const key of SCENE_KEYS) this.cur[key] += (this.state[key] - this.cur[key]) * k

    const p = this.pointer
    const pk = 1 - Math.exp(-dt * 6)
    p.x += (p.tx - p.x) * pk
    p.y += (p.ty - p.y) * pk
    const active = !this.reduced && this.elapsed - p.last < 2.5 ? 1 : 0
    this.mouseOn += (active - this.mouseOn) * (1 - Math.exp(-dt * 3))

    this.velTarget *= Math.exp(-dt * 4)
    this.vel += (this.velTarget - this.vel) * (1 - Math.exp(-dt * 6))

    const c = this.cur
    const m = c.morph
    const wSpin = hat(m, 0) + hat(m, 2)
    const wWide = hat(m, 1) + hat(m, 3) + hat(m, 4)
    const narrow = this.aspect < 0.85
    const shift = Math.min(1, Math.max(0, (this.aspect - 0.7) / 0.9))
    const fit = narrow ? wWide * Math.min(2.2, 1.15 / this.aspect) + (1 - wWide) * 1.25 : 1

    if (!this.reduced) this.spin += dt * (0.07 + this.vel * 0.5)
    this.group.position.set(c.x * shift, c.y + (narrow ? 0.4 * wSpin : 0), 0)
    this.group.rotation.set(
      c.tilt - p.y * 0.1,
      (this.spin + p.x * 0.3) * wSpin + p.x * 0.08 * (1 - wSpin) + Math.sin(t * 0.15) * 0.18 * hat(m, 3),
      0,
    )
    this.camera.position.set(Math.sin(t * 0.07) * 0.18, Math.cos(t * 0.05) * 0.12, c.z * fit)
    this.camera.lookAt(0, 0, 0)
    this.camera.rotation.z += Math.sin(t * 0.1) * 0.01 + this.vel * 0.015
    this.camera.updateMatrixWorld()
    this.updateMouse()

    const u = this.pointsMat.uniforms
    u.uMorph!.value = m
    u.uTime!.value = t
    u.uIntro!.value = this.reduced ? 1 : Math.min(1, this.elapsed / 2.8)
    u.uVel!.value = this.vel
    u.uMouseOn!.value = this.mouseOn
    u.uOpacity!.value = narrow ? 0.75 : 1
    this.arcsMat.uniforms.uTime!.value = t
    this.arcsMat.uniforms.uOpacity!.value = Math.max(0, 1 - m * 2.5) * Math.min(1, u.uIntro!.value * 1.2) * (narrow ? 0.6 : 1)
    this.dustMat.uniforms.uTime!.value = t
    this.dust.rotation.y = this.spin * 0.15 + p.x * 0.05
    this.dust.rotation.x = p.y * 0.03

    if (this.composer) {
      this.finish!.uniforms.uTime!.value = this.elapsed
      this.composer.render(dt)
    } else this.renderer.render(this.scene, this.camera)
  }
}
