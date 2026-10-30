import type { SceneState } from '~/lib/scene'

export const sceneAttrs = (s: Partial<SceneState>) => ({
  'data-scene': '',
  'data-morph': s.morph ?? 0,
  'data-x': s.x ?? 0,
  'data-y': s.y ?? 0,
  'data-z': s.z ?? 7,
  'data-tilt': s.tilt ?? 0.35,
})
