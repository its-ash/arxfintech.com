export interface Word {
  w: string
  em: boolean
}

export const toWords = (text: string): Word[] => {
  const out: Word[] = []
  let glue = false
  for (const seg of text.split(/(\*[^*]+\*)/)) {
    if (!seg) continue
    const em = seg.length > 1 && seg.startsWith('*') && seg.endsWith('*')
    const raw = em ? seg.slice(1, -1) : seg
    raw.split(/\s+/).forEach((w, i) => {
      if (!w) return
      const prev = out.at(-1)
      if (i === 0 && glue && prev) prev.w += w
      else out.push({ w, em })
    })
    glue = !/\s$/.test(raw)
  }
  return out
}

export const plain = (text: string) => text.replace(/\*/g, '')
