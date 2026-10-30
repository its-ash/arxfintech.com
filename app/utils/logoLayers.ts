export interface LogoLayers {
  base: string
  red: string
  green: string
}

let job: Promise<LogoLayers> | undefined

const split = async (src: string): Promise<LogoLayers> => {
  const img = new Image()
  img.src = src
  await img.decode()
  const w = img.naturalWidth
  const h = img.naturalHeight
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2D context unavailable')
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, w, h)
  const layers = { base: new ImageData(w, h), red: new ImageData(w, h), green: new ImageData(w, h) }
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!]
    if (!a) continue
    const key = r - Math.max(g, b) > 40 ? 'red' : g - Math.max(r, b) > 25 ? 'green' : 'base'
    layers[key].data.set([r, g, b, a], i)
  }
  const url = (d: ImageData) => {
    ctx.clearRect(0, 0, w, h)
    ctx.putImageData(d, 0, 0)
    return cv.toDataURL('image/png')
  }
  return { base: url(layers.base), red: url(layers.red), green: url(layers.green) }
}

export const logoLayers = (src = '/logo.png') => (job ??= split(src).catch((e) => ((job = undefined), Promise.reject(e))))
