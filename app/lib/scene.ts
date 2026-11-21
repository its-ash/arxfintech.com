import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineSegments,
  NoToneMapping,
  PerspectiveCamera,
  Points,
  SRGBColorSpace,
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

const RADIUS = 2.04
const CANDLES = 44
const CHART_W = 6.5
const LOGO_W = 5.4
const FOV = 40
const BG = '#0c0d12'

const PALETTE = {
  accent: new Color('#d6fb61'),
  cyan: new Color('#00f5ff'),
  emerald: new Color('#00ff8c'),
  azure: new Color('#2979ff'),
  coral: new Color('#ff2a85'),
  gold: new Color('#ffbe0b'),
  orchid: new Color('#c24dff'),
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
uniform vec3 uAccent;
uniform vec3 uCyan;
uniform vec3 uEmerald;
uniform vec3 uAzure;
uniform vec3 uCoral;
uniform vec3 uGold;
uniform vec3 uOrchid;
uniform float uSat;
attribute vec3 aCandle;
attribute vec3 aRing;
attribute vec3 aWave;
attribute vec3 aLogo;
attribute vec3 aLogoCol;
attribute float aSeed;
attribute float aTone;
attribute float aHub;
varying vec3 vColor;
varying float vAlpha;
varying float vSpark;

${NOISE}

vec3 rotX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c); }
vec3 rotZ(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z); }

vec3 prism(float t) {
  float x = fract(t) * 6.0;
  if (x < 1.0) return mix(uAzure, uCyan, x);
  if (x < 2.0) return mix(uCyan, uEmerald, x - 1.0);
  if (x < 3.0) return mix(uEmerald, uAccent, x - 2.0);
  if (x < 4.0) return mix(uAccent, uGold, x - 3.0);
  if (x < 5.0) return mix(uGold, uCoral, x - 4.0);
  return mix(uCoral, uOrchid, x - 5.0);
}

vec3 ringPos(out float ringPulse, out float ringPhase) {
  float layer = aRing.z;
  float R = 1.24 + layer * 0.44;
  float dir = mod(layer, 2.0) > 0.5 ? -1.0 : 1.0;
  float u = aRing.x + uTime * 0.25 * dir * (1.0 + layer * 0.24);
  ringPhase = 0.5 + 0.5 * sin(u * 2.0 + layer * 1.4);
  ringPulse = pow(0.5 + 0.5 * sin(u * 2.0 - uTime * 1.65 * dir + layer * 1.9), 5.0);
  float tube = 0.042 + aSeed * 0.068 + ringPulse * 0.036;
  float r = R + tube * cos(aRing.y);
  vec3 p = vec3(r * cos(u), tube * sin(aRing.y), r * sin(u));
  if (layer < 0.5) p = rotX(p, 0.24 + sin(uTime * 0.35) * 0.08);
  else if (layer < 1.5) p = rotX(p, 1.12);
  else if (layer < 2.5) p = rotZ(rotX(p, -0.62), 1.06);
  else p = rotZ(rotX(p, -1.18), -0.54);
  return p;
}

vec3 wavePos(out float h, out float crest) {
  vec3 w = aWave;
  float w1 = sin(w.x * 1.05 + uTime * 0.95) * 0.27;
  float w2 = cos(w.z * 1.55 - uTime * 0.78) * 0.19;
  float w3 = sin((w.x * 0.7 - w.z * 0.9) + uTime * 0.65) * 0.15;
  float sn = snoise(vec3(w.x * 0.32, w.z * 0.32, uTime * 0.14)) * 0.46;
  h = w1 + w2 + w3 + sn;
  crest = smoothstep(0.15, 0.85, h);
  return vec3(w.x, h, w.z);
}

float hat(float m, float k) { return clamp(1.0 - abs(m - k), 0.0, 1.0); }

void main() {
  float idx = floor(uMorph);
  float t = uMorph - idx;
  float ts = clamp((t - aSeed * 0.28) / 0.72, 0.0, 1.0);
  ts = ts * ts * (3.0 - 2.0 * ts);
  float m = idx + ts;
  float w0 = hat(m, 0.0);
  float w1 = hat(m, 1.0);
  float w2 = hat(m, 2.0);
  float w3 = hat(m, 3.0);
  float w4 = hat(m, 4.0);

  float lat = position.y / 2.04;
  float lon = atan(position.z, position.x);
  float globeWave = 0.5 + 0.5 * sin(position.y * 2.5 - uTime * 1.15 + lon * 2.0);
  float hubBeat = 0.5 + 0.5 * sin(uTime * 2.6 + aSeed * 14.0);
  vec3 pGlobe = position * (1.0 + aHub * (0.04 + 0.03 * hubBeat) + pow(globeWave, 4.0) * 0.02);

  float candleX = clamp((aCandle.x + 3.25) / 6.5, 0.0, 1.0);
  float scanPos = fract(uTime * 0.15) * 1.4 - 0.2;
  float scan = exp(-pow(scanPos - candleX, 2.0) * 20.0);
  vec3 pCandle = aCandle + vec3(0.0, scan * 0.065, sin(candleX * 6.0 - uTime * 1.2) * 0.09);

  float ringPulse;
  float ringPhase;
  vec3 pRing = ringPos(ringPulse, ringPhase);

  float h;
  float crest;
  vec3 pWave = wavePos(h, crest);

  vec3 pLogo = aLogo + vec3(0.0, 0.0, sin(aLogo.x * 1.9 + uTime * 1.6) * 0.026);

  vec3 p = pGlobe * w0 + pCandle * w1 + pRing * w2 + pWave * w3 + pLogo * w4;

  float gBand = fract(lon / 6.28318 + lat * 0.36 + uTime * 0.055 + sin(position.y * 1.6) * 0.08);
  vec3 cGlobeBase = prism(gBand);
  cGlobeBase = mix(cGlobeBase, mix(uCoral, uOrchid, aSeed), pow(globeWave, 3.2) * 0.52);
  vec3 cHub = mix(uGold, mix(uCoral, uCyan, step(0.5, aSeed)), 0.4 + 0.6 * hubBeat);
  vec3 cGlobe = mix(cGlobeBase, cHub * 1.32, clamp(aHub * 1.35, 0.0, 1.0));
  cGlobe = mix(cGlobe, uAccent * 1.18, step(0.93, aSeed) * 0.6);

  float cy = clamp((aCandle.y + 1.3) / 2.6, 0.0, 1.0);
  vec3 cBull = mix(mix(uCyan, uEmerald, smoothstep(0.0, 0.52, cy)), uAccent, smoothstep(0.48, 1.0, cy));
  vec3 cBear = mix(mix(uOrchid, uCoral, smoothstep(0.0, 0.52, cy)), uGold, smoothstep(0.55, 1.0, cy));
  vec3 cCandle = mix(cBear, cBull, aTone) * (0.9 + scan * 0.55);

  float layer = aRing.z;
  vec3 cRing;
  if (layer < 0.5) cRing = mix(uCyan, uAzure, ringPhase);
  else if (layer < 1.5) cRing = mix(uEmerald, uAccent, ringPhase);
  else if (layer < 2.5) cRing = mix(uCoral, uOrchid, ringPhase);
  else cRing = mix(uGold, uCoral, ringPhase);
  cRing = mix(cRing, mix(uGold, uCyan, mod(layer, 2.0)) * 1.35, ringPulse * 0.72);

  float wBand = fract(aWave.x * 0.095 - aWave.z * 0.08 + uTime * 0.045 + h * 0.38);
  vec3 cWave = prism(wBand);
  cWave = mix(cWave, mix(uGold, uCoral, 0.5 + 0.5 * sin(aWave.x * 0.6 - uTime)), smoothstep(0.32, 0.88, crest) * 0.65);

  float isRed = step(0.12, aLogoCol.r - max(aLogoCol.g, aLogoCol.b));
  float isGreen = step(0.07, aLogoCol.g - max(aLogoCol.r, aLogoCol.b));
  float beat = 0.5 + 0.5 * cos(uTime * 3.92699);
  float pr = uTime > 0.0 ? mix(0.28, 1.0, beat) : 1.0;
  float pg = uTime > 0.0 ? mix(0.28, 1.0, 1.0 - beat) : 1.0;
  vec3 logoTint = mix(uCyan, uOrchid, 0.5 + 0.5 * sin(aLogo.x * 0.85 - uTime * 0.9));
  vec3 cLogoBase = mix(vec3(0.84, 0.9, 1.0), logoTint, 0.22);
  vec3 cLogo = mix(cLogoBase, vec3(1.0, 0.05, 0.22) * pr * 1.45, isRed);
  cLogo = mix(cLogo, vec3(0.04, 1.0, 0.42) * pg * 1.45, isGreen);

  vec3 col = cGlobe * w0 + cCandle * w1 + cRing * w2 + cWave * w3 + cLogo * w4;

  float swirl = sin(ts * 3.14159);
  vec3 q = p * 0.45 + vec3(0.0, 0.0, uTime * 0.08);
  vec3 n = vec3(snoise(q), snoise(q + vec3(31.4, 0.0, 0.0)), snoise(q + vec3(0.0, -17.2, 9.1)));
  p += n * (0.024 + swirl * 0.92 + uVel * 0.58);
  col += prism(aSeed + uTime * 0.12) * (swirl * 0.35 + uVel * 0.16);

  float it = clamp(uIntro * 1.5 - aSeed * 0.5, 0.0, 1.0);
  it = 1.0 - pow(1.0 - it, 3.0);
  vec3 dir = normalize(vec3(sin(aSeed * 91.7), cos(aSeed * 47.3), sin(aSeed * 13.1 + 1.0)) + vec3(0.0001));
  p = mix(dir * (7.0 + aSeed * 9.0), p, it);

  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec2 dv = wp.xy - uMouse.xy;
  float dist = length(dv);
  float f = uMouseOn * smoothstep(1.45, 0.0, dist);
  vec2 radial = normalize(dv + vec2(0.0001));
  vec2 tangent = vec2(-radial.y, radial.x);
  wp.xy += (radial * 0.52 + tangent * 0.24) * f;
  wp.z += f * 0.55;

  float angle = atan(dv.y, dv.x);
  vec3 mouseHue = prism(angle / 6.28318 + uTime * 0.25);
  col = mix(col, mouseHue * 1.45, f * 0.85);

  col = max(mix(vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), col, uSat), 0.0);

  vec4 mv = viewMatrix * wp;
  vec4 center = viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  gl_Position = projectionMatrix * mv;

  float sizeGain = mix(1.0, 0.78, w1) * mix(1.0, 0.84, w4);
  float energy = aHub * w0 * 0.55 + scan * w1 * 0.4 + ringPulse * w2 * 0.6 + crest * w3 * 0.3;
  float twinkle = 0.8 + 0.2 * sin(uTime * 2.1 + aSeed * 62.0);
  gl_PointSize = uSize * uScale * sizeGain * (0.62 + aSeed * 0.76 + energy * 0.44) * twinkle * (1.0 + swirl * 0.52 + f * 0.8) / -mv.z;

  float facing = smoothstep(-2.4, 1.6, mv.z - center.z);
  float density = 0.84 * w0 + 0.36 * w1 + 0.58 * w2 + 0.86 * w3 + 0.34 * w4;
  vAlpha = mix(1.0, mix(0.24, 1.0, facing), w0 + w2) * density * it;
  vSpark = clamp(0.18 + energy * 0.55 + f * 0.6 + swirl * 0.3, 0.0, 1.0);
  vColor = col;
}
`

const pointsFrag = /* glsl */ `
uniform float uOpacity;
uniform float uBoost;
varying vec3 vColor;
varying float vAlpha;
varying float vSpark;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float halo = pow(smoothstep(0.5, 0.0, d), 1.9);
  float core = smoothstep(0.2, 0.0, d);
  vec3 c = vColor * (0.95 + core * (0.48 + vSpark * 0.36));
  float a = (halo * 0.84 + core * 0.3) * vAlpha * uOpacity;
  gl_FragColor = vec4(c * uBoost, min(1.0, a * uBoost));
  #include <colorspace_fragment>
}
`

const arcsVert = /* glsl */ `
attribute float aT;
attribute float aOff;
attribute float aRoute;
varying float vT;
varying float vOff;
varying float vRoute;

void main() {
  vT = aT;
  vOff = aOff;
  vRoute = aRoute;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const arcsFrag = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uAccent;
uniform vec3 uCyan;
uniform vec3 uCoral;
uniform vec3 uGold;
uniform vec3 uOrchid;
uniform vec3 uEmerald;
varying float vT;
varying float vOff;
varying float vRoute;

vec3 routeColor(float r) {
  float s = fract(r) * 5.0;
  if (s < 1.0) return mix(uCyan, uAccent, s);
  if (s < 2.0) return mix(uAccent, uGold, s - 1.0);
  if (s < 3.0) return mix(uGold, uCoral, s - 2.0);
  if (s < 4.0) return mix(uCoral, uOrchid, s - 3.0);
  return mix(uOrchid, uEmerald, s - 4.0);
}

void main() {
  float head1 = fract(uTime * 0.19 + vOff);
  float d1 = head1 - vT;
  float trail1 = smoothstep(0.34, 0.0, d1) * step(0.0, d1);
  float head2 = fract(uTime * 0.19 + vOff + 0.5);
  float d2 = head2 - vT;
  float trail2 = smoothstep(0.24, 0.0, d2) * step(0.0, d2) * 0.7;
  float trail = max(trail1, trail2);
  vec3 c = mix(routeColor(vRoute), routeColor(vRoute + 0.28), vT);
  vec3 outCol = c * (1.05 + pow(trail, 1.8) * 1.15);
  float a = (0.14 + trail * 1.25) * uOpacity;
  gl_FragColor = vec4(outCol, min(1.0, a));
  #include <colorspace_fragment>
}
`

const dustVert = /* glsl */ `
uniform float uTime;
uniform float uScale;
attribute float aSeed;
varying float vA;
varying float vSeed;

void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.24 + aSeed * 32.0) * 0.18;
  p.x += cos(uTime * 0.18 + aSeed * 21.0) * 0.1;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float twinkle = 0.72 + 0.28 * sin(uTime * 1.6 + aSeed * 45.0);
  gl_PointSize = (0.017 + aSeed * 0.026) * uScale * twinkle / -mv.z;
  vA = (0.28 + aSeed * 0.4) * twinkle;
  vSeed = aSeed;
}
`

const dustFrag = /* glsl */ `
uniform vec3 uAccent;
uniform vec3 uCyan;
uniform vec3 uCoral;
uniform vec3 uGold;
uniform vec3 uOrchid;
uniform vec3 uAzure;
varying float vA;
varying float vSeed;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float s = fract(vSeed * 6.0);
  vec3 c = s < 0.17 ? uCyan : s < 0.34 ? uAccent : s < 0.51 ? uCoral : s < 0.68 ? uGold : s < 0.85 ? uOrchid : uAzure;
  gl_FragColor = vec4(c * 1.15, pow(smoothstep(0.5, 0.0, d), 1.6) * vA);
  #include <colorspace_fragment>
}
`

const FinishShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uMorph: { value: 0 },
  },
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
uniform float uMorph;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 c = vUv - 0.5;
  float r = dot(c, c);
  vec2 off = c * r * 0.008;
  vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);

  float mx = max(col.r, max(col.g, col.b));
  if (mx > 0.001) {
    float mapped = mx / (1.0 + max(0.0, mx - 0.85) * 0.55);
    col *= mapped / mx;
  }

  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(lum), col, 1.16), 0.0);

  vec2 a1 = vec2(0.72 + sin(uTime * 0.14) * 0.12, 0.44 + cos(uTime * 0.11) * 0.14);
  vec2 a2 = vec2(0.24 + cos(uTime * 0.12) * 0.12, 0.62 + sin(uTime * 0.15) * 0.14);
  float g1 = exp(-dot(vUv - a1, vUv - a1) * 4.5);
  float g2 = exp(-dot(vUv - a2, vUv - a2) * 5.0);
  vec3 aura1 = mix(vec3(0.0, 0.78, 1.0), vec3(0.75, 1.0, 0.25), 0.5 + 0.5 * sin(uMorph * 1.5 + uTime * 0.12));
  vec3 aura2 = mix(vec3(1.0, 0.16, 0.52), vec3(0.62, 0.24, 1.0), 0.5 + 0.5 * cos(uMorph * 1.3 - uTime * 0.1));
  col += aura1 * g1 * 0.042 + aura2 * g2 * 0.036;

  col *= 1.0 - r * 0.42;
  col += (hash(vUv * 900.0 + fract(uTime)) - 0.5) * 0.018;
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
  private onVis = () => {
    if (document.hidden) {
      this.renderer.setAnimationLoop(null)
      this.last = 0
    } else {
      this.renderer.setAnimationLoop(this.tick)
    }
  }

  constructor(
    private canvas: HTMLCanvasElement,
    private reduced: boolean,
    logoUrl?: string,
  ) {
    this.small = matchMedia('(max-width: 767px)').matches
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
    this.renderer.toneMapping = NoToneMapping
    this.renderer.setClearColor(BG, 1)
    this.scene.background = new Color(BG)
    this.scene.add(this.group)

    const count = this.small ? 8000 : 15500
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
        uSize: { value: this.small ? 0.052 : 0.032 },
        uSat: { value: this.small ? 1.38 : 1.32 },
        uBoost: { value: this.small ? 1.25 : 1.0 },
        uScale: { value: 1 },
        uIntro: { value: reduced ? 1 : 0 },
        uVel: { value: 0 },
        uMouse: { value: this.mouse },
        uMouseOn: { value: 0 },
        uOpacity: { value: 1 },
        uAccent: { value: PALETTE.accent },
        uCyan: { value: PALETTE.cyan },
        uEmerald: { value: PALETTE.emerald },
        uAzure: { value: PALETTE.azure },
        uCoral: { value: PALETTE.coral },
        uGold: { value: PALETTE.gold },
        uOrchid: { value: PALETTE.orchid },
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
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
        uAccent: { value: PALETTE.accent },
        uCyan: { value: PALETTE.cyan },
        uCoral: { value: PALETTE.coral },
        uGold: { value: PALETTE.gold },
        uOrchid: { value: PALETTE.orchid },
        uEmerald: { value: PALETTE.emerald },
      },
    })
    this.group.add(new LineSegments(this.buildArcs(), this.arcsMat))

    this.dustMat = new ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uAccent: { value: PALETTE.accent },
        uCyan: { value: PALETTE.cyan },
        uCoral: { value: PALETTE.coral },
        uGold: { value: PALETTE.gold },
        uOrchid: { value: PALETTE.orchid },
        uAzure: { value: PALETTE.azure },
      },
    })
    this.dust = new Points(this.buildDust(this.small ? 300 : 720, rnd), this.dustMat)
    this.scene.add(this.dust)

    if (!this.small) {
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.composer.addPass(new UnrealBloomPass(new Vector2(512, 512), 0.34, 0.38, 0.52))
      this.composer.addPass(new OutputPass())
      this.finish = new ShaderPass(FinishShader)
      this.composer.addPass(this.finish)
    }

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas)
    document.addEventListener('visibilitychange', this.onVis)
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
    document.removeEventListener('visibilitychange', this.onVis)
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
    const tmp = new Color()
    for (let i = 0; i < pos.count; i++) {
      const j = Math.floor(rnd() * n) * 2
      const x = px[j]!
      const y = px[j + 1]!
      const o = (y * W + x) * 4
      pos.setXYZ(i, (x - W / 2 + rnd() - 0.5) * k, (H / 2 - y + rnd() - 0.5) * k, (rnd() - 0.5) * 0.14)
      tmp.setRGB(data[o]! / 255, data[o + 1]! / 255, data[o + 2]! / 255, SRGBColorSpace)
      col.setXYZ(i, tmp.r, tmp.g, tmp.b)
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
    const hub = new Float32Array(count)
    const hubVecs = HUBS.map(([lat, lon]) => fromLatLon(lat, lon, 1))
    const candles = buildCandles(rnd)
    const golden = Math.PI * (3 - Math.sqrt(5))
    const step = CHART_W / CANDLES
    const cols = Math.ceil(Math.sqrt(count * 2.2))
    const rows = Math.ceil(count / cols)

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const ux = Math.cos(golden * i) * r
      const uz = Math.sin(golden * i) * r
      const gx = ux * RADIUS
      const gy = y * RADIUS
      const gz = uz * RADIUS
      pos.set([gx, gy, gz], i * 3)
      logo.set([gx, gy, gz], i * 3)
      logoCol.set([PALETTE.cyan.r, PALETTE.cyan.g, PALETTE.cyan.b], i * 3)

      let maxDot = -1
      for (let h = 0; h < hubVecs.length; h++) {
        const hv = hubVecs[h]!
        const d = ux * hv.x + y * hv.y + uz * hv.z
        if (d > maxDot) maxDot = d
      }
      hub[i] = Math.exp(-Math.max(0, 1 - maxDot) * 42)

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

      ring.set([rnd() * Math.PI * 2, rnd() * Math.PI * 2, i % 4], i * 3)

      const col = i % cols
      const row = Math.floor(i / cols)
      wave.set([(col / (cols - 1) - 0.5) * 9.4 + (rnd() - 0.5) * 0.02, 0, (row / Math.max(rows - 1, 1) - 0.5) * 5.4], i * 3)

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
    g.setAttribute('aHub', new BufferAttribute(hub, 1))
    this.geos.push(g)
    return g
  }

  private buildArcs() {
    const SEG = 64
    const pos: number[] = []
    const ts: number[] = []
    const offs: number[] = []
    const routes: number[] = []
    ROUTES.forEach(([a, b], k) => {
      const va = fromLatLon(...HUBS[a]!, 1)
      const vb = fromLatLon(...HUBS[b]!, 1)
      const w = va.angleTo(vb)
      const s = Math.sin(w)
      const lift = 0.11 + w * 0.15
      const pt = (t: number) =>
        va
          .clone()
          .multiplyScalar(Math.sin((1 - t) * w) / s)
          .addScaledVector(vb, Math.sin(t * w) / s)
          .normalize()
          .multiplyScalar(RADIUS * (1.012 + lift * Math.sin(Math.PI * t)))
      const off = (k * 0.618) % 1
      const rk = k / ROUTES.length
      for (let i = 0; i < SEG; i++) {
        const p0 = pt(i / SEG)
        const p1 = pt((i + 1) / SEG)
        pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z)
        ts.push(i / SEG, (i + 1) / SEG)
        offs.push(off, off)
        routes.push(rk, rk)
      }
    })
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
    g.setAttribute('aT', new BufferAttribute(new Float32Array(ts), 1))
    g.setAttribute('aOff', new BufferAttribute(new Float32Array(offs), 1))
    g.setAttribute('aRoute', new BufferAttribute(new Float32Array(routes), 1))
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
    const k = this.reduced ? 1 : 1 - Math.exp(-dt * 6.5)
    for (const key of SCENE_KEYS) this.cur[key] += (this.state[key] - this.cur[key]) * k

    const p = this.pointer
    const pk = 1 - Math.exp(-dt * 7)
    p.x += (p.tx - p.x) * pk
    p.y += (p.ty - p.y) * pk
    const active = !this.reduced && this.elapsed - p.last < 2.5 ? 1 : 0
    this.mouseOn += (active - this.mouseOn) * (1 - Math.exp(-dt * 3.5))

    this.velTarget *= Math.exp(-dt * 4)
    this.vel += (this.velTarget - this.vel) * (1 - Math.exp(-dt * 6))

    const c = this.cur
    const m = c.morph
    const wSpin = hat(m, 0) + hat(m, 2)
    const wWide = hat(m, 1) + hat(m, 3) + hat(m, 4)
    const narrow = this.aspect < 0.85
    const shift = Math.min(1, Math.max(0, (this.aspect - 0.7) / 0.9))
    const fit = narrow ? wWide * Math.min(2.2, 1.15 / this.aspect) + (1 - wWide) * 1.25 : 1

    if (!this.reduced) this.spin += dt * (0.08 + this.vel * 0.52)
    this.group.position.set(c.x * shift, c.y + (narrow ? 0.4 * wSpin : 0), 0)
    this.group.rotation.set(
      c.tilt - p.y * 0.11,
      (this.spin + p.x * 0.32) * wSpin + p.x * 0.08 * (1 - wSpin) + Math.sin(t * 0.16) * 0.18 * hat(m, 3),
      0,
    )
    this.camera.position.set(Math.sin(t * 0.075) * 0.18, Math.cos(t * 0.055) * 0.12, c.z * fit)
    this.camera.lookAt(0, 0, 0)
    this.camera.rotation.z += Math.sin(t * 0.11) * 0.012 + this.vel * 0.015
    this.camera.updateMatrixWorld()
    this.updateMouse()

    const u = this.pointsMat.uniforms
    u.uMorph!.value = m
    u.uTime!.value = t
    u.uIntro!.value = this.reduced ? 1 : Math.min(1, this.elapsed / 2.4)
    u.uVel!.value = this.vel
    u.uMouseOn!.value = this.mouseOn
    u.uOpacity!.value = 1
    this.arcsMat.uniforms.uTime!.value = t
    this.arcsMat.uniforms.uOpacity!.value = Math.max(0, 1 - m * 2.4) * Math.min(1, u.uIntro!.value * 1.25) * (this.small ? 1.35 : 1.1)
    this.dustMat.uniforms.uTime!.value = t
    this.dust.rotation.y = this.spin * 0.16 + p.x * 0.05
    this.dust.rotation.x = p.y * 0.03

    if (this.composer) {
      this.finish!.uniforms.uTime!.value = this.elapsed
      this.finish!.uniforms.uMorph!.value = m
      this.composer.render(dt)
    } else this.renderer.render(this.scene, this.camera)
  }
}
